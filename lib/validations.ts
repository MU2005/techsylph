import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().optional(),
  country: z.string().min(2, "Please enter your country"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const rfqSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company: z.string().min(2, "Company name is required"),
  country: z.string().min(2, "Please enter your country"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().optional(),
  categories: z
    .array(z.string())
    .min(1, "Select at least one product category"),
  quantity: z.string().min(1, "Please provide an estimated quantity"),
  customization: z.enum(["yes", "no", "not-sure"]),
  message: z.string().optional(),
  attachment: z
    .instanceof(File)
    .optional()
    .refine((f) => !f || f.size <= MAX_FILE_SIZE, "File must be under 10MB")
    .refine(
      (f) => !f || ALLOWED_FILE_TYPES.includes(f.type),
      "Only JPG, PNG, WEBP, or PDF files allowed"
    ),
  customLabelRequest: z.boolean().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type RFQFormData = z.infer<typeof rfqSchema>;
