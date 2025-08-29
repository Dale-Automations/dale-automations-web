import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface CallbackRequest {
  name: string;
  phone: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, phone }: CallbackRequest = await req.json();

    console.log("Processing callback request:", { name, phone });

    // Validate input
    if (!name || !phone) {
      return new Response(
        JSON.stringify({ error: "Name and phone are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead into database
    const { data, error } = await supabase
      .from("callback_leads")
      .insert({
        name: name.trim(),
        phone: phone.trim(),
        status: "pending"
      })
      .select()
      .single();

    if (error) {
      console.error("Database error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to save lead" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Lead saved successfully:", data);

    // Send data to n8n webhook
    try {
      const webhookResponse = await fetch("https://n8n.daleautomations.com/webhook-test/Ascend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: data.id,
          name: data.name,
          phone: data.phone,
          status: data.status,
          created_at: data.created_at
        }),
      });
      
      console.log("Webhook called:", webhookResponse.status);
    } catch (webhookError) {
      console.error("Failed to call webhook:", webhookError);
      // Don't fail the entire request if webhook fails
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Lead saved successfully",
        lead_id: data.id 
      }), 
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in save-callback-lead function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);