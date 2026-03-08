const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const TOPICS = [
  "3D modeling computer graphics mesh",
  "artificial intelligence machine learning deep learning",
  "computer graphics rendering shading geometry",
  "generative AI diffusion models image synthesis",
  "real-time rendering rasterization ray tracing GPU",
  "physical AI embodied intelligence physics simulation",
  "computer vision object detection segmentation recognition",
  "visual effects compositing simulation particle systems",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    const results: { topic: string; total: number; error?: string }[] = [];

    // Scrape each topic by calling the search-papers function
    for (const topic of TOPICS) {
      try {
        const resp = await fetch(`${supabaseUrl}/functions/v1/search-papers`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: topic,
            sources: ["crossref", "arxiv", "openalex", "nvidia"],
            maxResults: 10,
            isScheduled: true,
          }),
        });

        const data = await resp.json();
        results.push({ topic, total: data.total || 0 });
      } catch (err) {
        results.push({ topic, total: 0, error: err instanceof Error ? err.message : "Failed" });
      }
    }

    return new Response(
      JSON.stringify({ success: true, scraped: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scheduled scrape error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Scrape failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
