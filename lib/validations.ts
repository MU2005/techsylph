import { z } from "zod";

export type ValidationMessages = {
  nameMin: string;
  countryMin: string;
  emailInvalid: string;
  messageMin: string;
  companyRequired: string;
  categoryMin: string;
  quantityRequired: string;
  fileSize: string;
  fileType: string;
};

export type SampleValidationMessages = {
  nameMin: string;
  companyRequired: string;
  countryMin: string;
  emailInvalid: string;
  quantityRequired: string;
  messageMin: string;
  fileSize: string;
  fileType: string;
};

const DEFAULT_MESSAGES: ValidationMessages = {
  nameMin: "Name must be at least 2 characters",
  countryMin: "Please enter your country",
  emailInvalid: "Please enter a valid email",
  messageMin: "Message must be at least 10 characters",
  companyRequired: "Company name is required",
  categoryMin: "Select at least one product category",
  quantityRequired: "Please provide an estimated quantity",
  fileSize: "File must be under 10MB",
  fileType: "Only JPG, PNG, WEBP, or PDF files allowed",
};

const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const DEFAULT_SAMPLE_MESSAGES: SampleValidationMessages = {
  nameMin: "Name must be at least 2 characters",
  companyRequired: "Company name is required",
  countryMin: "Please enter your country",
  emailInvalid: "Please enter a valid email",
  quantityRequired: "Please select sample quantity",
  messageMin: "Message must be at least 10 characters",
  fileSize: "File must be under 10MB",
  fileType: "Only JPG, PNG, WEBP, or PDF files allowed",
};

export function createContactSchema(m: ValidationMessages = DEFAULT_MESSAGES) {
  return z.object({
    name: z.string().min(2, m.nameMin),
    company: z.string().optional(),
    country: z.string().min(2, m.countryMin),
    email: z.string().email(m.emailInvalid),
    phone: z.string().optional(),
    message: z.string().min(10, m.messageMin),
  });
}

export function createRfqSchema(m: ValidationMessages = DEFAULT_MESSAGES) {
  return z.object({
    name: z.string().min(2, m.nameMin),
    company: z.string().min(2, m.companyRequired),
    country: z.string().min(2, m.countryMin),
    email: z.string().email(m.emailInvalid),
    phone: z.string().optional(),
    categories: z.array(z.string()).min(1, m.categoryMin),
    quantity: z.string().min(1, m.quantityRequired),
    customization: z.enum(["yes", "no", "not-sure"]),
    message: z.string().optional(),
    attachment: z
      .instanceof(File)
      .optional()
      .refine((f) => !f || f.size <= MAX_FILE_SIZE, m.fileSize)
      .refine(
        (f) => !f || ALLOWED_FILE_TYPES.includes(f.type),
        m.fileType
      ),
    customLabelRequest: z.boolean().optional(),
  });
}

export function createSampleRequestSchema(
  m: SampleValidationMessages = DEFAULT_SAMPLE_MESSAGES
) {
  return z.object({
    name: z.string().min(2, m.nameMin),
    company: z.string().min(2, m.companyRequired),
    country: z.string().min(2, m.countryMin),
    email: z.string().email(m.emailInvalid),
    phone: z.string().optional(),
    sampleQuantity: z.string().min(1, m.quantityRequired),
    sizePreference: z.string().optional(),
    colorPreference: z.string().optional(),
    customization: z.enum(["no", "logo-print", "embroidery", "labels-packaging", "not-sure"]),
    customizationNotes: z.string().optional(),
    productName: z.string().min(1),
    productSlug: z.string().optional(),
    productUrl: z.string().min(1),
    message: z.string().min(10, m.messageMin),
    attachment: z
      .instanceof(File)
      .optional()
      .refine((f) => !f || f.size <= MAX_FILE_SIZE, m.fileSize)
      .refine((f) => !f || ALLOWED_FILE_TYPES.includes(f.type), m.fileType),
  });
}

export const contactSchema = createContactSchema();
export const rfqSchema = createRfqSchema();
export const sampleRequestSchema = createSampleRequestSchema();

export type ContactFormData = z.infer<typeof contactSchema>;
export type RFQFormData = z.infer<typeof rfqSchema>;
export type SampleRequestFormData = z.infer<typeof sampleRequestSchema>;
