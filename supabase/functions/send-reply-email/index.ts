import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import nodemailer from "npm:nodemailer";

const GMAIL_USER = Deno.env.get("GMAIL_USER");
const GMAIL_PASSWORD = Deno.env.get("GMAIL_PASSWORD");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { to, name, replyText, originalMessage } = await req.json();

    const emailHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f6f6f4; margin: 0; padding: 40px 20px; color: #042416;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 40px 20px; text-align: center;">
            <div style="display: inline-block; background-color: #042416; color: #ffffff; font-weight: bold; font-size: 24px; padding: 12px 20px; border-radius: 12px; letter-spacing: -0.5px;">
              Canvas<span style="color: #10b981;">Builds</span>
            </div>
          </td>
        </tr>
        
        <!-- Body -->
        <tr>
          <td style="padding: 20px 40px;">
            <p style="margin: 0 0 20px; font-size: 18px; font-weight: bold; color: #1a202c;">Hi ${name},</p>
            <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4a5568; white-space: pre-wrap;">${replyText}</p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 32px 0;">
            
            <p style="margin: 0 0 8px; font-size: 12px; font-weight: bold; color: #a0aec0; text-transform: uppercase; tracking-widest;">Your Original Message</p>
            <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #718096; font-style: italic; border-left: 3px solid #10b981; padding-left: 12px;">${originalMessage}</p>
          </td>
        </tr>
        
        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px; font-size: 14px; color: #718096; font-weight: 500;">Crafting aesthetic, code-driven digital gifts.</p>
            <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.5;">&copy; ${new Date().getFullYear()} Canvas Builds. All rights reserved.<br>Based in India.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    await transporter.sendMail({
      from: `"Canvas Builds Support" <${GMAIL_USER}>`,
      to: to,
      subject: `Re: Your message to Canvas Builds`,
      html: emailHTML,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});