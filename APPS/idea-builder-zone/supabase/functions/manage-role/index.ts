import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const log = (step: string, details?: any) => {
  console.log(`[MANAGE-ROLE] ${step}${details ? ` - ${JSON.stringify(details)}` : ""}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    log("Function started");

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    const token = authHeader.replace("Bearer ", "");

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not found");

    const { action } = (await req.json().catch(() => ({ action: null }))) as { action: string | null };
    if (!action || !["upgrade", "downgrade"].includes(action)) {
      throw new Error("Invalid or missing action. Use 'upgrade' or 'downgrade'.");
    }

    log("Processing action", { action, userId: user.id });

    // Check existing role row
    const { data: existing, error: existingError } = await supabase
      .from("user_roles")
      .select("id")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();

    if (existingError) throw new Error(existingError.message);

    if (action === "upgrade") {
      const periodEnd = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      if (existing) {
        const { error } = await supabase
          .from("user_roles")
          .update({ role: "premium", subscription_status: "active", current_period_end: periodEnd })
          .eq("user_id", user.id);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from("user_roles")
          .insert({ user_id: user.id, role: "premium", subscription_status: "active", current_period_end: periodEnd });
        if (error) throw new Error(error.message);
      }

      log("Upgraded user to premium", { userId: user.id, periodEnd });
      return new Response(JSON.stringify({ ok: true, role: "premium", current_period_end: periodEnd }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    // Downgrade path
    if (existing) {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: "free", subscription_status: null, current_period_end: null })
        .eq("user_id", user.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: user.id, role: "free", subscription_status: null, current_period_end: null });
      if (error) throw new Error(error.message);
    }

    log("Downgraded user to free", { userId: user.id });
    return new Response(JSON.stringify({ ok: true, role: "free" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    log("ERROR", { message });
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});