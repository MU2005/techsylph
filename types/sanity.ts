export interface SanityImage {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  hotspot?: { x: number; y: number };
}

export interface Product {
  _id: string;
  name: string;
  slug: { current: string };
  category: "tshirts" | "hoodies" | "activewear" | "custom";
  description?: string;
  moq?: number;
  badge?: string;
  images?: SanityImage[];
  fabricDetails?: string;
  availableColors?: string[];
  availableSizes?: string[];
  customizable?: boolean;
  featured?: boolean;
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  author?: string;
  publishedAt?: string;
  category?: string;
  coverImage?: SanityImage;
  excerpt?: string;
  /** Portable Text blocks from Sanity */
  body?: unknown[];
}

export interface Testimonial {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  country?: string;
  rating?: number;
  quote: string;
  avatar?: SanityImage;
}

export interface FaqItem {
  _id: string;
  question: string;
  answer: string;
  order?: number;
}

export interface SiteSettings {
  statsProducts?: string;
  statsCountries?: string;
  statsMoq?: string;
  statsTurnaround?: string;
  /** URL of the hero video shown on mobile (from Sanity file asset). */
  heroVideoUrl?: string;
  categories?: {
    title: string;
    slug: string;
    description?: string;
    icon?: string;
    color?: string;
    image?: SanityImage;
  }[];
}

export interface CustomLabelData {
  heroHeadline?: string;
  heroSubtitle?: string;
  moqNote?: string;
  turnaroundNote?: string;
  customizations?: {
    title: string;
    description?: string;
    icon?: string;
    details?: string[];
    image?: SanityImage;
  }[];
  process?: {
    stepNumber: number;
    title: string;
    description?: string;
    duration?: string;
  }[];
}
