// app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

export const dynamic = "force-dynamic"; // don’t cache in dev

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  subject: z.string().min(3).max(120),
  message: z.string().min(10).max(2000),
  website: z.string().optional(), // honeypot
});

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function readForm(req: NextRequest) {
  const ct = req.headers.get("content-type") || "";
  try {
    // This handles both multipart and urlencoded on modern Next
    const fd = await req.formData();
    return Object.fromEntries(fd.entries());
  } catch {
    // Fallback for environments where formData() fails for urlencoded
    if (ct.includes("application/x-www-form-urlencoded")) {
      const body = await req.text();
      return Object.fromEntries(new URLSearchParams(body).entries());
    }
    throw new Error("Unsupported content-type: " + ct);
  }
}

export async function POST(req: NextRequest) {
    debugger;
  console.log("[/api/contact] POST hit" , req);
  try {
      const raw = await readForm(req);
      console.log("raw log" , raw);

    const parsed = schema.safeParse({
      name: String(raw.name || ""),
      email: String(raw.email || ""),
      subject: String(raw.subject || ""),
      message: String(raw.message || ""),
      website: String(raw.website || ""),
    });

    if (!parsed.success) {
      console.warn("[/api/contact] validation failed", parsed.error.flatten());
      const msg = encodeURIComponent("Please fill out all fields correctly.");
      return NextResponse.redirect(new URL(`/help/contact?error=${msg}`, req.url), { status: 303 });
    }

    // Honeypot: treat as success
    if (parsed.data.website) {
      return NextResponse.redirect(new URL(`/help/contact?sent=1`, req.url), { status: 303 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO;
    console.log(
       "resendApiKey",  resendApiKey, 
       "toEmail",  toEmail, 
       "parsed.data",  parsed.data, 
       "parsed.data.name",  parsed.data.name, 
       "parsed.data.email",  parsed.data.email, 
       "parsed.data.subject",  parsed.data.subject, 
    )

    const subject = ` ${parsed.data.subject}`;
    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial">
        <h2>New contact message</h2>
        <p><strong>Name:</strong> ${escapeHtml(parsed.data.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(parsed.data.email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(parsed.data.subject)}</p>
        <pre style="white-space:pre-wrap;font-family:inherit;border:1px solid #eee;padding:12px;border-radius:8px">${escapeHtml(
          parsed.data.message
        )}</pre>
      </div>`;

    if (!resendApiKey) {
      console.log("[/api/contact] (no RESEND_API_KEY) → logging instead of sending", {
        to: toEmail, subject,
      });
    } else {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        to: toEmail,
        from: 'gearhub <support@resend.com>',
        subject,
        html,
        text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
        reply_to: [parsed.data.email],
      });
    }

    return NextResponse.redirect(new URL(`/help/contact?sent=1`, req.url), { status: 303 });
  } catch (err) {
    console.error("[/api/contact] error", err);
    const msg = encodeURIComponent("Something went wrong. Please try again.");
    return NextResponse.redirect(new URL(`/help/contact?error=${msg}`, req.url), { status: 303 });
  }
}

// Optional: make accidental GETs obvious in dev
export async function GET(req: NextRequest) {
  return NextResponse.json({ ok: false, message: "Use POST" }, { status: 405 });
}
