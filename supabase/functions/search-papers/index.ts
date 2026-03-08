import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

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
    // Filter out Wiley TDM URLs (require authentication, won't work in viewers)
    const rawPdfUrl = pdfLink?.URL || null;
    const pdfUrl = rawPdfUrl && !rawPdfUrl.includes("api.wiley.com/onlinelibrary/tdm") ? rawPdfUrl : null;
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
      pdfUrl: pdfUrl,
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
  return (data.results || []).map((w: any) => {
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
      source: "nvidia",
      pdfUrl: oaPdfUrl,
    };
  });
}

/** Extract DOI from a paper's URL or paperId */
function extractDoi(paper: any): string | null {
  // paperId might be a DOI directly (CrossRef)
  if (paper.paperId && /^10\.\d{4,}/.test(paper.paperId)) return paper.paperId;
  // URL might contain DOI
  const doiMatch = paper.url?.match(/doi\.org\/(.+)/);
  if (doiMatch) return decodeURIComponent(doiMatch[1]);
  return null;
}

/** Batch-enrich papers with open-access PDF URLs via Unpaywall */
async function enrichWithUnpaywall(papers: any[]): Promise<any[]> {
  const papersNeedingPdf = papers.filter((p) => !p.pdfUrl);
  if (papersNeedingPdf.length === 0) return papers;

  // Build DOI-to-paper index
  const doiMap = new Map<string, any[]>();
  for (const p of papersNeedingPdf) {
    const doi = extractDoi(p);
    if (doi) {
      if (!doiMap.has(doi)) doiMap.set(doi, []);
      doiMap.get(doi)!.push(p);
    }
  }

  if (doiMap.size === 0) return papers;

  // Fetch Unpaywall in parallel (batches of 10 to be polite)
  const dois = [...doiMap.keys()];
  const batchSize = 10;

  for (let i = 0; i < dois.length; i += batchSize) {
    const batch = dois.slice(i, i + batchSize);
    const results = await Promise.allSettled(
      batch.map(async (doi) => {
        const res = await fetch(
          `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=tuliptech@research.dev`
        );
        if (!res.ok) return null;
        const data = await res.json();
        return { doi, data };
      })
    );

    for (const result of results) {
      if (result.status !== "fulfilled" || !result.value) continue;
      const { doi, data } = result.value;

      // Find best open-access PDF URL
      const oaPdf =
        data.best_oa_location?.url_for_pdf ||
        data.best_oa_location?.url ||
        data.first_oa_location?.url_for_pdf ||
        data.first_oa_location?.url ||
        null;

      if (oaPdf && doiMap.has(doi)) {
        for (const p of doiMap.get(doi)!) {
          p.pdfUrl = oaPdf;
        }
      }
    }
  }

  return papers;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, sources, maxResults, isScheduled } = await req.json();
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
    let papers: any[] = [];
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

    // Enrich papers missing PDF URLs via Unpaywall (uses DOI)
    try {
      papers = await enrichWithUnpaywall(papers);
    } catch (e) {
      console.error("Unpaywall enrichment failed:", e);
    }

    const pdfCount = papers.filter((p: any) => !!p.pdfUrl).length;

    // Log search to search_logs table
    try {
      const sb = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      const { error: logError } = await sb.from("search_logs").insert({
        query,
        sources: enabledSources,
        result_counts: counts,
        total_results: papers.length,
        pdf_count: pdfCount,
        is_scheduled: isScheduled || false,
      });
      if (logError) console.error("Search log insert error:", JSON.stringify(logError));
      else console.log("Search logged successfully");
    } catch (logErr) {
      console.error("Failed to log search:", logErr);
    }

    return new Response(
      JSON.stringify({ papers, counts, total: papers.length }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Search error:", error);

    // Log error
    try {
      const sb = createClient(
        Deno.env.get("SUPABASE_URL")!,
        Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
      );
      await sb.from("search_logs").insert({
        query: "unknown",
        sources: [],
        error: error instanceof Error ? error.message : "Search failed",
        is_scheduled: false,
      });
    } catch (_) { /* ignore logging failure */ }

    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Search failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
