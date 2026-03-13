export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id, name, slug, category, description, moq,
  badge, images, fabricDetails, availableColors, availableSizes,
  customizable, featured
}`;

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, name, slug, category, description, moq,
  badge, images, fabricDetails, availableColors,
  availableSizes, customizable, featured
}`;

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true][0...6] {
  _id, name, slug, category, description, moq, badge, images, customizable, featured
}`;

export const BLOG_POSTS_QUERY = `*[_type == "blogPost"] | order(publishedAt desc) {
  _id, title, slug, excerpt, publishedAt, category, coverImage, author
}`;

export const BLOG_POST_BY_SLUG_QUERY = `*[_type == "blogPost" && slug.current == $slug][0] {
  _id, title, slug, excerpt, publishedAt, category, coverImage, author, body
}`;

export const TESTIMONIALS_QUERY = `*[_type == "testimonial"] | order(_createdAt desc) {
  _id,
  name,
  role,
  company,
  country,
  rating,
  "quote": coalesce(quote, text)
}`;

export const FAQ_QUERY = `*[_type == "faqItem"] | order(order asc) {
  _id, question, answer, order
}`;

export const INQUIRIES_QUERY = `*[_type == "inquiry"] | order(_createdAt desc) {
  _id, name, company, country, email, phone,
  message, type, status, _createdAt
}`;

export const SITE_SETTINGS_QUERY = `*[_type == "siteSettings"][0] {
  statsProducts,
  statsCountries,
  statsMoq,
  statsTurnaround,
  "heroVideoUrl": heroVideo.asset->url,
  categories[] {
    title,
    slug,
    description,
    icon,
    color,
    image
  }
}`;

export const CUSTOM_LABEL_QUERY = `*[_type == "customLabel"][0] {
  heroHeadline,
  heroSubtitle,
  moqNote,
  turnaroundNote,
  customizations[] {
    title,
    description,
    icon,
    details,
    image
  },
  process[] | order(stepNumber asc) {
    stepNumber,
    title,
    description,
    duration
  }
}`;
