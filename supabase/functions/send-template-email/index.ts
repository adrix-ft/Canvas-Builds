import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import nodemailer from "npm:nodemailer";

// Access the secure environment variables
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const GMAIL_USER = Deno.env.get("GMAIL_USER");
const GMAIL_PASSWORD = Deno.env.get("GMAIL_PASSWORD");

// Configure the Gmail SMTP transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASSWORD,
  },
});

serve(async (req) => {
  try {
    const payload = await req.json();
    const newProduct = payload.record;

    // Connect using service role key to bypass RLS
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!);
    const { data: subscribers, error: dbError } = await supabase
      .from("subscribers")
      .select("email");

    if (dbError) throw new Error(`Database error: ${dbError.message}`);
    if (!subscribers || subscribers.length === 0) {
      console.log("No subscribers found in database.");
      return new Response("No subscribers to email.", { status: 200 });
    }

    const emailList = subscribers.map((sub) => sub.email);

    // Modern HTML Email Template
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
            <h1 style="margin: 0 0 16px; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">We just dropped something special. ✨</h1>
            <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.6; color: #4a5568;">Hey there,</p>
            <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4a5568;">You're getting this email because you subscribed to updates from Canvas Builds. We've just released a beautiful new digital gift template to help you celebrate your favorite moments.</p>

            <!-- Product Card -->
            <div style="background: linear-gradient(135deg, #fce7f3 0%, #ffe4e6 100%); border-radius: 16px; padding: 32px; text-align: center; margin-bottom: 32px; border: 1px solid #fbcfe8;">
              <span style="background-color: #ec4899; color: #ffffff; font-size: 12px; font-weight: bold; padding: 6px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">New ${newProduct.category || 'Template'}</span>
              <h2 style="margin: 20px 0 12px; font-size: 32px; font-weight: 800; color: #1a202c;">${newProduct.title}</h2>
              <p style="margin: 0; font-size: 20px; font-weight: bold; color: #ec4899;">${newProduct.price}</p>
            </div>

            <p style="margin: 0 0 32px; font-size: 16px; line-height: 1.6; color: #4a5568; text-align: center;">Ready to personalize it and surprise someone special?</p>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 40px;">
              <a href="https://canvas-builds.vercel.app/store" style="display: inline-block; background-color: #042416; color: #ffffff; font-weight: bold; font-size: 16px; text-decoration: none; padding: 18px 36px; border-radius: 12px;">Explore the Template &rarr;</a>
            </div>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; padding: 32px 40px; text-align: center; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0 0 12px; font-size: 14px; color: #718096; font-weight: 500;">Crafting aesthetic, code-driven digital gifts.</p>
            <p style="margin: 0; font-size: 12px; color: #a0aec0; line-height: 1.5;">&copy; ${new Date().getFullYear()} Canvas Builds. All rights reserved.<br>Based in India, built with ❤️</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    // Send the email via Gmail SMTP
    const info = await transporter.sendMail({
      from: `"Canvas Builds" <${GMAIL_USER}>`,
      to: GMAIL_USER, // Send a copy to yourself
      bcc: emailList, // BCC hides everyone's emails from each other
      subject: `🎉 New Template Dropped: ${newProduct.title}`,
      html: emailHTML,
    });

    console.log("Message sent via Gmail:", info.messageId);

    return new Response(JSON.stringify({ success: true, messageId: info.messageId }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Function error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    });
  }
});