import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, to, internalTo, user, scores, overall, recommendation, selectedServices, estimateRange } = body;

    console.log(`[send-assessment] type=${type}, to=${to}`);

    if (type === "pipeline-assessment") {
      console.log("Pipeline assessment received:", JSON.stringify({ to, user, overall, recommendation }, null, 2));
    } else if (type === "quote-request") {
      console.log("Quote request received:", JSON.stringify({ to, user: user, selectedServices, estimateRange }, null, 2));
    }

    // Log internally
    if (internalTo) {
      console.log(`Internal notification would go to: ${internalTo}`);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Assessment received" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Send assessment error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
