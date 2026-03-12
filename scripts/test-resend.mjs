/**
 * Test Resend email delivery.
 * Loads .env.local from project root, then sends one test email.
 *
 * Run:  npm run test:resend
 *
 * Note: With from "onboarding@resend.dev", Resend only allows sending TO the
 * email address of your Resend account. Set ADMIN_EMAIL in .env.local to
 * that address (e.g. the one you signed up with) to receive the test.
 * To send to any address, verify a domain at resend.com/domains and set RESEND_FROM.
 */

import { readFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const envPath = join(root, ".env.local");

if (existsSync(envPath)) {
  const content = readFileSync(envPath, "utf8");
  content.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const idx = trimmed.indexOf("=");
    if (idx === -1) return;
    const key = trimmed.slice(0, idx).trim();
    let val = trimmed.slice(idx + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    process.env[key] = val;
  });
  console.log("[test-resend] Loaded .env.local");
} else {
  console.warn("[test-resend] No .env.local found; using process.env only.");
}

const apiKey = process.env.RESEND_API_KEY;
const toEmail = process.env.ADMIN_EMAIL || "hello@techsylph.shop";

if (!apiKey) {
  console.error("[test-resend] RESEND_API_KEY is not set. Add it to .env.local and try again.");
  process.exit(1);
}

console.log("[test-resend] Sending test email to:", toEmail);
console.log("[test-resend] From: TechSylph <onboarding@resend.dev>");

const { Resend } = await import("resend");
const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from: "TechSylph <onboarding@resend.dev>",
  to: toEmail,
  subject: "TechSylph — Resend test",
  html: `
    <p>If you see this, Resend is working.</p>
    <p>Sent at: ${new Date().toISOString()}</p>
    <p>— TechSylph test script</p>
  `,
});

if (error) {
  console.error("[test-resend] Resend error:", error);
  console.error("[test-resend] Tip: Using onboarding@resend.dev you can only send to your Resend account email. Set ADMIN_EMAIL to that address in .env.local.");
  process.exitCode = 1;
  process.exit(1);
}

console.log("[test-resend] Success! Message id:", data?.id ?? "(no id)");
console.log("[test-resend] Check the inbox (and spam) for:", toEmail);
