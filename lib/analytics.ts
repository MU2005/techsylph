type LeadFormType = "contact" | "rfq";

type LeadEventPayload = {
  formType: LeadFormType;
  locale: string;
  path: string;
  partial?: boolean;
};

declare global {
  interface Window {
    gtag?: (
      command: "event",
      eventName: string,
      params?: Record<string, string | number | boolean | undefined>
    ) => void;
  }
}

export function trackLeadSubmission(payload: LeadEventPayload) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "generate_lead", {
    event_category: "lead_form",
    event_label: payload.formType,
    form_type: payload.formType,
    locale: payload.locale,
    page_path: payload.path,
    partial: payload.partial ?? false,
    value: 1,
  });
}
