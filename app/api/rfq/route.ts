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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rfqEmailHtml(data: Omit<RFQFormData, "attachment"> & { customLabelRequest?: boolean }): string {
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
    <tr><td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Custom Label Request</strong></td><td style="padding: 8px 0; border-bottom: 1px solid #eee;">${data.customLabelRequest ? "Yes" : "No"}</td></tr>
    ${data.message ? `<tr><td style="padding: 8px 0; vertical-align: top;"><strong>Additional Notes</strong></td><td style="padding: 8px 0;">${escapeHtml(data.message)}</td></tr>` : ""}
  </table>
</body>
</html>
  `.trim();
}

const schemaWithoutAttachment = rfqSchema.omit({ attachment: true });

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    let data: Omit<RFQFormData, "attachment"> & { customLabelRequest?: boolean };
    let attachmentBuffer: Buffer | null = null;
    let attachmentName = "";
    let attachmentType = "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const dataStr = formData.get("data");
      if (typeof dataStr !== "string") {
        return NextResponse.json(
          { error: "Validation failed", details: null },
          { status: 400 }
        );
      }
      data = JSON.parse(dataStr) as Omit<RFQFormData, "attachment"> & { customLabelRequest?: boolean };
      const file = formData.get("attachment") as File | null;
      if (file && file.size > 0) {
        const arrayBuffer = await file.arrayBuffer();
        attachmentBuffer = Buffer.from(arrayBuffer);
        attachmentName = file.name;
        attachmentType = file.type || "application/octet-stream";
      }
    } else {
      const body = await request.json();
      data = body as Omit<RFQFormData, "attachment"> & { customLabelRequest?: boolean };
    }

    const parsed = schemaWithoutAttachment.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }
    const validated = parsed.data;

    const messageForSanity = `Customization: ${validated.customization}. ${validated.customLabelRequest ? "Custom label request. " : ""}${validated.message || ""}`.trim();

    let sanitySaved = false;
    try {
      await writeClient.create({
        _type: "inquiry",
        type: "rfq",
        status: "new",
        name: validated.name,
        company: validated.company,
        country: validated.country,
        email: validated.email,
        phone: validated.phone ?? undefined,
        products: validated.categories,
        quantity: validated.quantity,
        message: messageForSanity,
        hasAttachment: !!attachmentBuffer,
        attachmentName: attachmentName || undefined,
        customLabelRequest: validated.customLabelRequest ?? false,
      });
      sanitySaved = true;
    } catch (sanityError) {
      console.error("[RFQ API] Sanity create error:", sanityError);
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
          subject: `New RFQ${attachmentBuffer ? " (with attachment)" : ""} — ${validated.company ?? validated.name}`,
          html: rfqEmailHtml(validated),
        };
        if (attachmentBuffer && attachmentName) {
          emailPayload.attachments = [
            {
              filename: attachmentName,
              content: attachmentBuffer,
              contentType: attachmentType,
            },
          ];
        }
        const { error } = await resend.emails.send(emailPayload);
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
