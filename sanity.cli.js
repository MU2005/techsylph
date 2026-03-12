/**
 * Sanity CLI config — required for `sanity dataset import` and other CLI commands.
 * Loads .env.local so projectId and dataset are available.
 */

const path = require("path");
const fs = require("fs");

const envPath = path.join(__dirname, ".env.local");
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, "utf-8");
  content.split("\n").forEach((line) => {
    const match = line.match(/^([^#=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, "");
      process.env[key] = value;
    }
  });
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

if (!projectId) {
  console.error(
    "Missing NEXT_PUBLIC_SANITY_PROJECT_ID. Add it to .env.local or set it in this file."
  );
  process.exit(1);
}

module.exports = {
  api: {
    projectId,
    dataset,
  },
};
