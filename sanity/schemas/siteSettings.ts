import { defineField, defineType } from "sanity";

export default defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "statsProducts",
      title: "Products Available (e.g. 500+)",
      type: "string",
      initialValue: "500+",
    }),
    defineField({
      name: "statsCountries",
      title: "Countries Served (e.g. 20+)",
      type: "string",
      initialValue: "20+",
    }),
    defineField({
      name: "statsMoq",
      title: "Minimum Order Qty (e.g. 50 pcs)",
      type: "string",
      initialValue: "50 pcs",
    }),
    defineField({
      name: "statsTurnaround",
      title: "Avg. Turnaround Time (e.g. 4 Weeks)",
      type: "string",
      initialValue: "4 Weeks",
    }),
    defineField({
      name: "categories",
      title: "Product Categories",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Category Title",
              type: "string",
            }),
            defineField({
              name: "slug",
              title: "Slug (for filter link)",
              type: "string",
              description: "e.g. tshirts — used in /catalog?category=tshirts",
            }),
            defineField({
              name: "description",
              title: "Short Description",
              type: "text",
              rows: 2,
            }),
            defineField({
              name: "icon",
              title: "Category Icon",
              type: "string",
              options: {
                list: [
                  { title: "👕 T-Shirt", value: "Shirt" },
                  { title: "🧥 Hoodie / Layers", value: "Layers" },
                  { title: "⚡ Activewear", value: "Zap" },
                  { title: "🏷️ Custom / Label", value: "Tag" },
                  { title: "📦 Package", value: "Package" },
                  { title: "🌍 Global", value: "Globe" },
                  { title: "⭐ Star", value: "Star" },
                  { title: "🛡️ Quality", value: "ShieldCheck" },
                  { title: "✂️ Scissors", value: "Scissors" },
                  { title: "🎨 Palette", value: "Palette" },
                ],
                layout: "radio",
              },
              initialValue: "Shirt",
            }),
            defineField({
              name: "color",
              title: "Accent Color",
              type: "string",
              options: {
                list: [
                  { title: "🟢 Emerald Green", value: "emerald" },
                  { title: "🔵 Blue", value: "blue" },
                  { title: "🟠 Orange", value: "orange" },
                  { title: "🟣 Purple", value: "purple" },
                  { title: "🔴 Red", value: "red" },
                  { title: "🩷 Pink", value: "pink" },
                  { title: "⭐ Amber", value: "amber" },
                  { title: "🩵 Sky Blue", value: "sky" },
                ],
                layout: "radio",
              },
              initialValue: "emerald",
            }),
            defineField({
              name: "image",
              title: "Category Image (optional)",
              type: "image",
              description:
                "Optional. If set, shown instead of the icon.",
              options: { hotspot: true },
            }),
          ],
          preview: {
            select: { title: "title" },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
