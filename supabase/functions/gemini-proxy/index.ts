import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  let token = req.headers.get('Authorization')?.replace('Bearer ', '');
  if (!token && url.searchParams.has('token')) {
    token = url.searchParams.get('token') || undefined;
  }

  if (!token) {
    return new Response(JSON.stringify({ error: 'Unauthorized: No session token provided' }), { status: 401, headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
  const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired session' }), { status: 401, headers: corsHeaders });
  }

  const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
  if (!geminiApiKey) {
    return new Response(JSON.stringify({ error: 'Server configuration error' }), { status: 500, headers: corsHeaders });
  }

  // --- MODE A: WEBSOCKET PROXY (Voice) ---
  if (req.headers.get("upgrade")?.toLowerCase() === "websocket") {
    const { socket: clientSocket, response } = Deno.upgradeWebSocket(req);
    
    // CRITICAL FIX: Upgraded to v1beta to support Gemini 2.0 Live Voice API
    const geminiUrl = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${geminiApiKey}`;
    
    const geminiSocket = new WebSocket(geminiUrl);
    const messageQueue: any[] = [];

    clientSocket.onmessage = (e) => {
      if (geminiSocket.readyState === WebSocket.OPEN) {
        geminiSocket.send(e.data);
      } else {
        messageQueue.push(e.data);
      }
    };
    
    geminiSocket.onopen = () => {
      while (messageQueue.length > 0) {
        geminiSocket.send(messageQueue.shift());
      }
    };

    geminiSocket.onmessage = (e) => {
      if (clientSocket.readyState === WebSocket.OPEN) clientSocket.send(e.data);
    };
    
    clientSocket.onclose = () => geminiSocket.readyState === WebSocket.OPEN && geminiSocket.close();
    geminiSocket.onclose = () => clientSocket.readyState === WebSocket.OPEN && clientSocket.close();
    
    return response;
  }

  // --- MODE B: HTTP POST PROXY (Text) ---
  if (req.method === 'POST') {
    try {
      const body = await req.json();
      
      // CRITICAL FIX: Standardized to the stable gemini-2.0-flash model
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      return new Response(JSON.stringify(data), { 
        status: response.status, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: corsHeaders });
    }
  }

  return new Response("Method not allowed", { status: 405, headers: corsHeaders });
});