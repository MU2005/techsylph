import { defineType, defineField } from "sanity";

export default defineType({
  name: "inquiry",
  title: "Inquiry",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string" }),
    defineField({ name: "company", type: "string" }),
    defineField({ name: "country", type: "string" }),
    defineField({ name: "email", type: "string" }),
    defineField({ name: "phone", type: "string" }),
    defineField({ name: "message", type: "text", rows: 5 }),
    defineField({
      name: "type",
      type: "string",
      options: {
        list: [
          { title: "General Contact", value: "contact" },
          { title: "Request for Quote", value: "rfq" },
        ],
      },
    }),
    defineField({
      name: "status",
      type: "string",
      options: {
        list: [
          { title: "New", value: "new" },
          { title: "In Progress", value: "in-progress" },
          { title: "Resolved", value: "resolved" },
        ],
      },
      initialValue: "new",
    }),
    defineField({
      name: "products",
      title: "Products Interested In",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "quantity",
      title: "Estimated Quantity",
      type: "string",
    }),
    defineField({
      name: "hasAttachment",
      title: "Has Attachment",
      type: "boolean",
    }),
    defineField({
      name: "attachmentName",
      title: "Attachment Filename",
      type: "string",
    }),
    defineField({
      name: "customLabelRequest",
      title: "Custom Label Request",
      type: "boolean",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "email" },
  },
});
