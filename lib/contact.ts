/** Official public contact email — single source of truth for UI and notifications */
export const CONTACT_EMAIL = "techsylph.co@gmail.com" as const;

export const CONTACT_MAILTO = `mailto:${CONTACT_EMAIL}` as const;

/** Default Resend "from" when `RESEND_FROM` is unset (verify sending in Resend dashboard) */
export const DEFAULT_RESEND_FROM = `TechSylph <${CONTACT_EMAIL}>` as const;
