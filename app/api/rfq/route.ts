import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rfqSchema, type RFQFormData } from "@/lib/validations";
import { writeClient } from "@/sanity/lib/writeClient";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "hello@techsylph.shop";
const FROM_EMAIL =
  process.env.RESEND_FROM || "TechSylph <onboarding@resend.dev>";

const CUSTOMIZATION_LABELS: Record<string, string> = {
  yes: "Yes",
  no: "No",
  "not-sure": "Not Sure",
};

function rfqEmailHtml(data: RFQFormData): string {
  const customizationLabel = CUSTOMIZATION_LABELS[data.customization] ?? data.customization;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>RFQ Submission</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 1.5rem; margin-bottom: 24px;">New RFQ Submission — TechSylph</h1>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Company</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.company)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Country</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.country)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.email)}</td></tr>
    ${data.phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.phone)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product Categories</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.categories.join(", "))}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Estimated Quantity</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.quantity)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Customization needed?</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(customizationLabel)}</td></tr>
    ${data.message ? `<tr><td style="padding: 8px 0; vertical-align: top;"><strong>Additional Notes</strong></td><td style="padding: 8px 0;">${escapeHtml(data.message)}</td></tr>` : ""}
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
    const body = await request.json();
    const parsed = rfqSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const data = parsed.data;

    const messageForSanity = `Customization: ${data.customization}. ${data.message || ""}`.trim();

    let sanitySaved = false;
    try {
      await writeClient.create({
        _type: "inquiry",
        type: "rfq",
        status: "new",
        name: data.name,
        company: data.company,
        country: data.country,
        email: data.email,
        phone: data.phone ?? undefined,
        products: data.categories,
        quantity: data.quantity,
        message: messageForSanity,
      });
      sanitySaved = true;
    } catch (sanityError) {
      console.error("[RFQ API] Sanity create error:", sanityError);
    }

    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const { error } = await resend.emails.send({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: "New RFQ Submission — TechSylph",
          html: rfqEmailHtml(data),
        });
        if (!error) emailSent = true;
        else console.error("[RFQ API] Resend error:", error);
      } catch (resendError) {
        console.error("[RFQ API] Resend exception:", resendError);
      }
    }

    if (sanitySaved || emailSent) {
      return NextResponse.json({ success: true });
    }
    return NextResponse.json(
      { error: "Could not save RFQ or send notification. Please try again." },
      { status: 500 }
    );
  } catch (e) {
    console.error("[RFQ API]", e);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
