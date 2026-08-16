import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import nodemailer from "npm:nodemailer";

// Initialize Nodemailer with Gmail App Password
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: Deno.env.get("GMAIL_USER"),
    pass: Deno.env.get("GMAIL_PASSWORD"),
  },
});

serve(async (req) => {
  try {
    // 1. Parse the Webhook Payload (The new product row)
    const payload = await req.json();
    const product = payload.record;

    // 2. Fetch all subscribers safely using the Service Role Key
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const { data: subscribers, error } = await supabase
      .from("subscribers")
      .select("email");

    if (error || !subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: "No subscribers found" }), { status: 200 });
    }

    // 3. Extract emails and chunk them into batches of 90 (Gmail SMTP limit is ~100 per send)
    const emails = subscribers.map((sub) => sub.email);
    const chunkSize = 90;
    const emailChunks = [];
    
    for (let i = 0; i < emails.length; i += chunkSize) {
      emailChunks.push(emails.slice(i, i + chunkSize));
    }

    // 4. Build the HTML Aesthetic Template
    // Using inline CSS because most email clients strip external stylesheets
    const htmlTemplate = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-w-width: 600px; margin: 0 auto; background-color: #f6f6f4; padding: 40px 20px; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #042416; margin: 0; font-size: 28px; font-weight: 900;">
            Canvas<span style="color: #10b981;">Builds</span>
          </h1>
          <p style="color: #042416; opacity: 0.6; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin-top: 5px;">
            New Template Dropped
          </p>
        </div>

        <div style="background-color: #ffffff; border-radius: 16px; padding: 30px; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
          <div style="display: inline-block; background-color: #f3f4f6; color: #ec4899; font-size: 10px; font-weight: bold; padding: 4px 12px; border-radius: 99px; text-transform: uppercase; margin-bottom: 15px;">
            ${product.category || 'New Arrival'}
          </div>
          
          <h2 style="color: #042416; font-size: 24px; margin-top: 0; margin-bottom: 10px;">
            ${product.title}
          </h2>
          
          <p style="color: #4b5563; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
            We just released a brand new digital gift template! Beautifully crafted, responsive, and ready to make your special person smile.
          </p>

          <div style="margin-bottom: 30px;">
            <span style="font-size: 24px; font-weight: bold; color: #042416;">${product.price}</span>
            ${product.original_price ? `<span style="font-size: 14px; text-decoration: line-through; color: #9ca3af; margin-left: 10px;">${product.original_price}</span>` : ''}
          </div>

          <a href="https://canvas-builds.vercel.app/product/${product.id}" style="display: block; width: 100%; text-align: center; background-color: #042416; color: #ffffff; padding: 14px 0; border-radius: 12px; text-decoration: none; font-weight: bold; font-size: 16px;">
            View Live Demo
          </a>
        </div>

        <div style="text-align: center; margin-top: 30px;">
          <p style="color: #9ca3af; font-size: 12px; margin-bottom: 5px;">
            You are receiving this because you subscribed on Canvas Builds.
          </p>
          <a href="https://canvas-builds.vercel.app/unsubscribe" style="color: #10b981; font-size: 12px; text-decoration: underline;">
            Unsubscribe instantly
          </a>
        </div>
      </div>
    `;

    // 5. Send out the batches simultaneously
    const sendPromises = emailChunks.map((chunk) => {
      return transporter.sendMail({
        from: '"Canvas Builds" <' + Deno.env.get("GMAIL_USER") + '>',
        to: Deno.env.get("GMAIL_USER"), // Send to yourself
        bcc: chunk, // Hide everyone else's emails in Bcc
        subject: `New Template: ${product.title} ✨`,
        html: htmlTemplate,
      });
    });

    await Promise.all(sendPromises);

    return new Response(JSON.stringify({ success: true, batchesSent: emailChunks.length }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Email error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});