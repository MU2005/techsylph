import { defineType, defineField } from "sanity";

export default defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "name",
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "category" }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "moq",
      title: "Minimum Order Quantity",
      type: "number",
    }),
    defineField({
      name: "badge",
      title: "Badge (e.g. Bestseller, New)",
      type: "string",
    }),
    defineField({
      name: "images",
      title: "Product Images",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "fabricDetails",
      title: "Fabric & Material Details",
      type: "string",
    }),
    defineField({
      name: "availableColors",
      title: "Available Colors",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "availableSizes",
      title: "Available Sizes",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "customizable",
      title: "Custom/Private Label Available?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage?",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "object",
      fields: [
        { name: "metaTitle", type: "string", title: "Meta Title" },
        {
          name: "metaDescription",
          type: "text",
          title: "Meta Description",
          rows: 2,
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      categoryTitle: "category.title",
      media: "images.0",
    },
    prepare({ title, categoryTitle, media }) {
      return {
        title,
        subtitle: categoryTitle || "No category selected",
        media,
      };
    },
  },
});
