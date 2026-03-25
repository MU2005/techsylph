import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { reportApiError } from "@/lib/monitoring";
import { writeClient } from "@/sanity/lib/writeClient";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@techsylph.shop";
const FROM_EMAIL =
  process.env.RESEND_FROM || "TechSylph <onboarding@resend.dev>";

function contactEmailHtml(data: ContactFormData): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Contact Inquiry</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 1.5rem; margin-bottom: 24px;">New Contact Inquiry — TechSylph</h1>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.name)}</td></tr>
    ${data.company ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Company</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.company)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Country</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.country)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.email)}</td></tr>
    ${data.phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.phone)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; vertical-align: top;"><strong>Message</strong></td><td style="padding: 8px 0;">${escapeHtml(data.message)}</td></tr>
  </table>
</body>
</html>
  `.trim();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`contact:${ip}`);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(limit.retryAfterSeconds) },
        }
      );
    }

    const body = await request.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    let sanitySaved = false;
    try {
      await writeClient.create({
        _type: "inquiry",
        type: "contact",
        status: "new",
        name: data.name,
        company: data.company ?? undefined,
        country: data.country,
        email: data.email,
        phone: data.phone ?? undefined,
        message: data.message,
      });
      sanitySaved = true;
    } catch (sanityError) {
      reportApiError(sanityError, "Contact API", { stage: "sanity_create" });
    }

    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: "New Contact Inquiry — TechSylph",
          html: contactEmailHtml(data),
        });
        if (!error) emailSent = true;
        else reportApiError(error, "Contact API", { stage: "resend_send_error" });
      } catch (resendError) {
        reportApiError(resendError, "Contact API", { stage: "resend_send_exception" });
      }
    }

    if (sanitySaved || emailSent) {
      return NextResponse.json({
        success: true,
        partial: !sanitySaved || !emailSent,
        services: {
          sanitySaved,
          emailSent,
        },
      });
    }
    return NextResponse.json(
      { error: "Could not save inquiry or send notification. Please try again." },
      { status: 500 }
    );
  } catch (e) {
    reportApiError(e, "Contact API", { stage: "unexpected" });
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
