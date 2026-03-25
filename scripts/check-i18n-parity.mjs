import { readFileSync } from "fs";

const languages = ["en", "fr", "de"];

const objects = Object.fromEntries(
  languages.map((lang) => [
    lang,
    JSON.parse(readFileSync(`messages/${lang}.json`, "utf8")),
  ])
);

function flatten(obj, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(obj)) {
    const next = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object" && !Array.isArray(value)) {
      flatten(value, next, out);
    } else {
      out[next] = true;
    }
  }
  return out;
}

const flattened = Object.fromEntries(
  languages.map((lang) => [lang, flatten(objects[lang])])
);

const enKeys = Object.keys(flattened.en);
const missing = [];
for (const key of enKeys) {
  const miss = languages.filter((lang) => lang !== "en" && !flattened[lang][key]);
  if (miss.length) missing.push({ key, missingIn: miss });
}

console.log(
  JSON.stringify(
    {
      keyCounts: Object.fromEntries(languages.map((lang) => [lang, Object.keys(flattened[lang]).length])),
      missingCount: missing.length,
      sampleMissing: missing.slice(0, 10),
    },
    null,
    2
  )
);
