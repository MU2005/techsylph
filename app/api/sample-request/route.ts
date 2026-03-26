import { NextResponse } from "next/server";
import { Resend } from "resend";
import { sampleRequestSchema, type SampleRequestFormData } from "@/lib/validations";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { reportApiError } from "@/lib/monitoring";
import { writeClient } from "@/sanity/lib/writeClient";
import { CONTACT_EMAIL, DEFAULT_RESEND_FROM } from "@/lib/contact";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || CONTACT_EMAIL;
const FROM_EMAIL = process.env.RESEND_FROM || DEFAULT_RESEND_FROM;

const schemaWithoutAttachment = sampleRequestSchema.omit({ attachment: true });
const ALLOWED_ATTACHMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
]);
const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

const CUSTOMIZATION_LABELS: Record<SampleRequestFormData["customization"], string> = {
  no: "No customization",
  "logo-print": "Logo print",
  embroidery: "Embroidery",
  "labels-packaging": "Labels / Packaging",
  "not-sure": "Not sure",
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sampleEmailHtml(data: Omit<SampleRequestFormData, "attachment">): string {
  const customization = CUSTOMIZATION_LABELS[data.customization] ?? data.customization;
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>Sample Request</title></head>
<body style="font-family: system-ui, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <h1 style="font-size: 1.5rem; margin-bottom: 24px;">New Sample Request — TechSylph</h1>
  <table style="width: 100%; border-collapse: collapse;">
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Name</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.name)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Company</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.company)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Country</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.country)}</td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Email</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.email)}</td></tr>
    ${data.phone ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Phone</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.phone)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.productName)}</td></tr>
    ${data.productSlug ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product Slug</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.productSlug)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Product URL</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><a href="${escapeHtml(data.productUrl)}">${escapeHtml(data.productUrl)}</a></td></tr>
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Sample Quantity</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.sampleQuantity)}</td></tr>
    ${data.sizePreference ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Size Preference</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.sizePreference)}</td></tr>` : ""}
    ${data.colorPreference ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Color Preference</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.colorPreference)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Customization</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(customization)}</td></tr>
    ${data.customizationNotes ? `<tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Customization Notes</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${escapeHtml(data.customizationNotes)}</td></tr>` : ""}
    <tr><td style="padding: 8px 0; vertical-align: top;"><strong>Notes</strong></td><td style="padding: 8px 0;">${escapeHtml(data.message)}</td></tr>
  </table>
</body>
</html>
  `.trim();
}

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`sample-request:${ip}`);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
      );
    }

    const contentType = request.headers.get("content-type") ?? "";
    let data: Omit<SampleRequestFormData, "attachment">;
    let attachmentBuffer: Buffer | null = null;
    let attachmentName = "";
    let attachmentType = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const dataStr = formData.get("data");
      if (typeof dataStr !== "string") {
        return NextResponse.json({ error: "Validation failed", details: null }, { status: 400 });
      }
      try {
        data = JSON.parse(dataStr) as Omit<SampleRequestFormData, "attachment">;
      } catch {
        return NextResponse.json(
          { error: "Validation failed", details: { data: ["Invalid multipart data payload"] } },
          { status: 400 }
        );
      }
      const file = formData.get("attachment") as File | null;
      if (file && file.size > 0) {
        if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
          return NextResponse.json({ error: "Validation failed", details: { attachment: ["File must be under 10MB"] } }, { status: 400 });
        }
        if (!ALLOWED_ATTACHMENT_TYPES.has(file.type)) {
          return NextResponse.json({ error: "Validation failed", details: { attachment: ["Only JPG, PNG, WEBP, or PDF files allowed"] } }, { status: 400 });
        }
        const arrayBuffer = await file.arrayBuffer();
        attachmentBuffer = Buffer.from(arrayBuffer);
        attachmentName = file.name;
        attachmentType = file.type || "application/octet-stream";
      }
    } else {
      const body = await request.json();
      data = body as Omit<SampleRequestFormData, "attachment">;
    }

    const parsed = schemaWithoutAttachment.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const validated = parsed.data;

    let sanitySaved = false;
    try {
      await writeClient.create({
        _type: "inquiry",
        type: "sample-request",
        status: "new",
        name: validated.name,
        company: validated.company,
        country: validated.country,
        email: validated.email,
        phone: validated.phone ?? undefined,
        products: [validated.productName],
        quantity: validated.sampleQuantity,
        message: `${validated.message}\n\nProduct URL: ${validated.productUrl}\nCustomization: ${CUSTOMIZATION_LABELS[validated.customization]}`,
        hasAttachment: !!attachmentBuffer,
        attachmentName: attachmentName || undefined,
        sampleCustomization: validated.customization,
        sampleCustomizationNotes: validated.customizationNotes || undefined,
        sampleSizePreference: validated.sizePreference || undefined,
        sampleColorPreference: validated.colorPreference || undefined,
        productSlug: validated.productSlug || undefined,
        productUrl: validated.productUrl,
      });
      sanitySaved = true;
    } catch (sanityError) {
      reportApiError(sanityError, "Sample Request API", { stage: "sanity_create" });
    }

    let emailSent = false;
    if (process.env.RESEND_API_KEY) {
      try {
        const emailPayload: {
          from: string;
          to: string;
          subject: string;
          html: string;
          attachments?: { filename: string; content: Buffer; contentType?: string }[];
        } = {
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `New Sample Request${attachmentBuffer ? " (with attachment)" : ""} — ${validated.company}`,
          html: sampleEmailHtml(validated),
        };
        if (attachmentBuffer && attachmentName) {
          emailPayload.attachments = [
            { filename: attachmentName, content: attachmentBuffer, contentType: attachmentType },
          ];
        }
        const { error } = await resend.emails.send(emailPayload);
        if (!error) emailSent = true;
        else reportApiError(error, "Sample Request API", { stage: "resend_send_error" });
      } catch (resendError) {
        reportApiError(resendError, "Sample Request API", { stage: "resend_send_exception" });
      }
    }

    if (sanitySaved || emailSent) {
      return NextResponse.json({
        success: true,
        partial: !sanitySaved || !emailSent,
        services: { sanitySaved, emailSent },
      });
    }
    return NextResponse.json(
      { error: "Could not save sample request or send notification. Please try again." },
      { status: 500 }
    );
  } catch (e) {
    reportApiError(e, "Sample Request API", { stage: "unexpected" });
    return NextResponse.json({ error: "An unexpected error occurred." }, { status: 500 });
  }
}
