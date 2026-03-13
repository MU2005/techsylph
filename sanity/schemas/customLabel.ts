import { defineField, defineType } from "sanity";

export default defineType({
  name: "customLabel",
  title: "Custom Label Page",
  type: "document",
  fields: [
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Your Brand. Our Manufacturing.",
    }),
    defineField({
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      initialValue:
        "Full custom label and private label manufacturing from Pakistan. MOQ from 50 pieces.",
    }),
    defineField({
      name: "customizations",
      title: "Customization Options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "title", title: "Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "🏷️ Label / Tag", value: "Tag" },
                  { title: "🧵 Embroidery", value: "Scissors" },
                  { title: "🎨 Screen Print", value: "Palette" },
                  { title: "🔖 Woven Patch", value: "Layers" },
                  { title: "📦 Fabric / GSM", value: "Package" },
                  { title: "📐 Sizing / Fit", value: "Ruler" },
                  { title: "⭐ Private Label", value: "Star" },
                  { title: "✅ Quality Check", value: "ShieldCheck" },
                ],
                layout: "radio",
              },
            }),
            defineField({
              name: "image",
              title: "Example Image (optional)",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "details",
              title: "Detail Points (bullet list)",
              type: "array",
              of: [{ type: "string" }],
              description:
                'e.g. "Available in woven, printed, or leather patch"',
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "process",
      title: "Custom Order Process Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "stepNumber",
              title: "Step Number",
              type: "number",
            }),
            defineField({ name: "title", title: "Step Title", type: "string" }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "duration",
              title: "Timeframe (e.g. 1-2 days)",
              type: "string",
            }),
          ],
          preview: { select: { title: "title" } },
        },
      ],
    }),
    defineField({
      name: "moqNote",
      title: "MOQ Note",
      type: "string",
      initialValue: "Minimum order from 50 pieces per style",
    }),
    defineField({
      name: "turnaroundNote",
      title: "Turnaround Note",
      type: "string",
      initialValue: "Typical production: 3–4 weeks after sample approval",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Custom Label Page" };
    },
  },
});
