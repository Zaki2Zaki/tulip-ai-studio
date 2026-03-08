const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function searchCrossRef(query: string, rows = 20) {
  const res = await fetch(
    `https://api.crossref.org/works?query=${encodeURIComponent(query)}&rows=${rows}&sort=relevance&order=desc`
  );
  const data = await res.json();
  return (data.message?.items || []).map((item: any) => {
    // Try to find an open-access PDF link from CrossRef
    const pdfLink = (item.link || []).find((l: any) =>
      l["content-type"] === "application/pdf" || l["content-type"]?.includes("pdf")
    );
    return {
      paperId: item.DOI || crypto.randomUUID(),
      title: Array.isArray(item.title) ? item.title[0] : item.title || "Untitled",
      abstract: item.abstract?.replace(/<[^>]*>/g, "") || null,
      year: item.published?.["date-parts"]?.[0]?.[0] || null,
      citationCount: item["is-referenced-by-count"] || null,
      url: item.URL || `https://doi.org/${item.DOI}`,
      authors: (item.author || []).map((a: any) => ({ name: `${a.given || ""} ${a.family || ""}`.trim() })),
      venue: item["container-title"]?.[0] || null,
      source: "crossref",
      pdfUrl: pdfLink?.URL || null,
    };
  });
}

async function searchArxiv(query: string, maxResults = 10) {
  const isId = /^\d{4}\.\d{4,5}(v\d+)?$/.test(query.trim());
  const url = isId
    ? `https://export.arxiv.org/api/query?id_list=${query.trim()}&max_results=1`
    : `https://export.arxiv.org/api/query?search_query=all:${encodeURIComponent(query)}&start=0&max_results=${maxResults}&sortBy=relevance&sortOrder=descending`;

  const res = await fetch(url);
  const xml = await res.text();

  const entries: any[] = [];
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  while ((match = entryRegex.exec(xml)) !== null) {
    const entry = match[1];
    const get = (tag: string) => {
      const m = entry.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].replace(/\s+/g, " ").trim() : "";
    };
    const id = get("id").replace("http://arxiv.org/abs/", "");
    const authors: string[] = [];
    const authorRegex = /<author>\s*<name>([^<]+)<\/name>/g;
    let am;
    while ((am = authorRegex.exec(entry)) !== null) authors.push(am[1].trim());

    entries.push({
      paperId: `arxiv:${id}`,
      title: get("title"),
      abstract: get("summary"),
      year: parseInt(get("published").slice(0, 4)) || null,
      citationCount: null,
      url: `https://arxiv.org/abs/${id}`,
      authors: authors.map((name) => ({ name })),
      venue: "arXiv",
      source: "arxiv",
      pdfUrl: `https://arxiv.org/pdf/${id}`,
    });
  }
  return entries;
}

async function searchOpenAlex(query: string, perPage = 20) {
  const res = await fetch(
    `https://api.openalex.org/works?search=${encodeURIComponent(query)}&per_page=${perPage}&sort=relevance_score:desc&mailto=tuliptech@research.dev`
  );
  const data = await res.json();
  return (data.results || []).map((w: any) => {
    // Extract open access PDF URL from OpenAlex
    const oaPdfUrl = w.primary_location?.pdf_url
      || w.best_oa_location?.pdf_url
      || (w.open_access?.oa_url || null);
    return {
      paperId: w.id || crypto.randomUUID(),
      title: w.title || "Untitled",
      abstract: w.abstract_inverted_index
        ? Object.entries(w.abstract_inverted_index as Record<string, number[]>)
            .flatMap(([word, positions]) => positions.map((pos) => ({ word, pos })))
            .sort((a, b) => a.pos - b.pos)
            .map((x) => x.word)
            .join(" ")
        : null,
      year: w.publication_year || null,
      citationCount: w.cited_by_count || null,
      url: w.doi ? `https://doi.org/${w.doi.replace("https://doi.org/", "")}` : w.id,
      authors: (w.authorships || []).slice(0, 5).map((a: any) => ({
        name: a.author?.display_name || "Unknown",
      })),
      venue: w.primary_location?.source?.display_name || null,
      source: "openalex",
      pdfUrl: oaPdfUrl,
    };
  });
}

async function searchNvidia(query: string, maxResults = 15) {
  // Search OpenAlex filtered to Nvidia Research affiliation for relevant papers
  const res = await fetch(
    `https://api.openalex.org/works?search=${encodeURIComponent(query)}&filter=authorships.institutions.ror:https://ror.org/01f5ytq51&per_page=${maxResults}&sort=relevance_score:desc&mailto=tuliptech@research.dev`
  );
  const data = await res.json();
  return (data.results || []).map((w: any) => ({
    paperId: w.id || crypto.randomUUID(),
    title: w.title || "Untitled",
    abstract: w.abstract_inverted_index
      ? Object.entries(w.abstract_inverted_index as Record<string, number[]>)
          .flatMap(([word, positions]) => positions.map((pos) => ({ word, pos })))
          .sort((a, b) => a.pos - b.pos)
          .map((x) => x.word)
          .join(" ")
      : null,
    year: w.publication_year || null,
    citationCount: w.cited_by_count || null,
    url: w.doi ? `https://doi.org/${w.doi.replace("https://doi.org/", "")}` : w.id,
    authors: (w.authorships || []).slice(0, 5).map((a: any) => ({
      name: a.author?.display_name || "Unknown",
    })),
    venue: w.primary_location?.source?.display_name || null,
    source: "nvidia",
  }));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources, maxResults } = await req.json();
    if (!query) {
      return new Response(
        JSON.stringify({ error: "Query is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const enabledSources = sources || ["crossref", "arxiv", "openalex"];
    const limit = maxResults || 15;

    const promises: Promise<any[]>[] = [];
    const sourceNames: string[] = [];

    if (enabledSources.includes("crossref")) {
      promises.push(searchCrossRef(query, limit));
      sourceNames.push("crossref");
    }
    if (enabledSources.includes("arxiv")) {
      promises.push(searchArxiv(query, limit));
      sourceNames.push("arxiv");
    }
    if (enabledSources.includes("openalex")) {
      promises.push(searchOpenAlex(query, limit));
      sourceNames.push("openalex");
    }
    if (enabledSources.includes("nvidia")) {
      promises.push(searchNvidia(query, limit));
      sourceNames.push("nvidia");
    }

    const results = await Promise.allSettled(promises);
    const papers: any[] = [];
    const counts: Record<string, number> = {};

    results.forEach((result, i) => {
      const name = sourceNames[i];
      if (result.status === "fulfilled") {
        papers.push(...result.value);
        counts[name] = result.value.length;
      } else {
        console.error(`${name} search failed:`, result.reason);
        counts[name] = 0;
      }
    });

    return new Response(
      JSON.stringify({ papers, counts, total: papers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Search error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Search failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
