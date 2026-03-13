"use client";

import { useTranslations } from "next-intl";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { CTAButton } from "@/components/shared/CTAButton";
import { cn } from "@/lib/utils";

export type FAQItem = { _id?: string; question: string; answer: string };

export function FAQAccordion({
  items,
  locale,
}: {
  items: FAQItem[];
  locale: string;
}) {
  const t = useTranslations("faq");
  if (items.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="card-base overflow-hidden rounded-2xl">
        <Accordion className="w-full">
          {items.map((item, i) => (
            <AccordionItem
              key={item._id ?? i}
              value={`item-${i}`}
              className="border-surface-3 px-6 data-[state=open]:bg-surface-1"
            >
              <AccordionTrigger
                className={cn(
                  "font-display font-semibold text-text-primary py-5 hover:no-underline",
                  "hover:text-brand-green focus-visible:ring-brand-green/50"
                )}
              >
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm leading-relaxed text-text-secondary pb-5">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <div className="card-base rounded-2xl p-6 text-center">
        <p className="font-display font-bold text-text-primary">{t("stillQuestions")}</p>
        <div className="mt-4">
          <CTAButton href="/contact" variant="primary">
            {t("contactUs")}
          </CTAButton>
        </div>
      </div>
    </div>
  );
}
