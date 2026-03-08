import { supabase } from "@/integrations/supabase/client";

export interface Paper {
  paperId: string;
  title: string;
  abstract: string | null;
  year: number | null;
  citationCount: number | null;
  url: string;
  authors: { name: string }[];
  venue: string | null;
  source?: string;
  pdfUrl?: string;
}

export interface SearchResult {
  papers: Paper[];
  counts: Record<string, number>;
  total: number;
}

export async function searchPapers(
  query: string,
  sources = ["crossref", "arxiv", "openalex"],
  maxResults = 15
): Promise<SearchResult> {
  const { data, error } = await supabase.functions.invoke("search-papers", {
    body: { query, sources, maxResults },
  });

  if (error) {
    console.error("Edge function error:", error);
    throw new Error(error.message || "Search failed");
  }

  return data as SearchResult;
}

type ChatMessage = { role: "user" | "assistant"; content: string };

export async function streamPaperChat({
  messages,
  paperContext,
  onDelta,
  onDone,
}: {
  messages: ChatMessage[];
  paperContext: { title: string; authors?: string[]; year?: number; abstract?: string; source?: string };
  onDelta: (text: string) => void;
  onDone: () => void;
}) {
  const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/paper-chat`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
    },
    body: JSON.stringify({ messages, paperContext }),
  });

  if (!resp.ok) {
    const errData = await resp.json().catch(() => ({}));
    throw new Error(errData.error || `Chat failed (${resp.status})`);
  }

  if (!resp.body) throw new Error("No response body");

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let textBuffer = "";
  let streamDone = false;

  while (!streamDone) {
    const { done, value } = await reader.read();
    if (done) break;
    textBuffer += decoder.decode(value, { stream: true });

    let newlineIndex: number;
    while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
      let line = textBuffer.slice(0, newlineIndex);
      textBuffer = textBuffer.slice(newlineIndex + 1);

      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line.startsWith(":") || line.trim() === "") continue;
      if (!line.startsWith("data: ")) continue;

      const jsonStr = line.slice(6).trim();
      if (jsonStr === "[DONE]") {
        streamDone = true;
        break;
      }

      try {
        const parsed = JSON.parse(jsonStr);
        const content = parsed.choices?.[0]?.delta?.content as string | undefined;
        if (content) onDelta(content);
      } catch {
        textBuffer = line + "\n" + textBuffer;
        break;
      }
    }
  }

  onDone();
}
