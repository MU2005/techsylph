"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { contactSchema, type ContactFormData } from "@/lib/validations";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-surface-border bg-white px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/10 transition-all";
const labelClass = "mb-1.5 block font-body text-sm font-medium text-text-primary";
const errorClass = "mt-1 font-body text-xs text-red-500";

export function ContactForm() {
  const t = useTranslations("contact");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setIsLoading(true);
    setErrorMessage(null);
    setIsSuccess(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error ?? t("errorMsg"));
        return;
      }
      setIsSuccess(true);
    } catch {
      setErrorMessage(t("networkError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {isSuccess && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="font-body text-sm text-green-700">
            ✓ {t("successMsg")}
          </p>
        </div>
      )}
      {errorMessage && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="font-body text-sm text-red-700">{errorMessage}</p>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            {t("name")} *
          </label>
          <input
            id="contact-name"
            {...register("name")}
            className={cn(inputClass, errors.name && "border-red-500/50")}
            placeholder={t("namePlaceholder")}
          />
          {errors.name && (
            <p className={errorClass}>{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-company" className={labelClass}>
            {t("company")}
          </label>
          <input
            id="contact-company"
            {...register("company")}
            className={cn(inputClass, errors.company && "border-red-500/50")}
            placeholder={t("companyPlaceholder")}
          />
          {errors.company && (
            <p className={errorClass}>{errors.company.message}</p>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="contact-country" className={labelClass}>
            {t("country")} *
          </label>
          <input
            id="contact-country"
            {...register("country")}
            className={cn(inputClass, errors.country && "border-red-500/50")}
            placeholder={t("countryPlaceholder")}
          />
          {errors.country && (
            <p className={errorClass}>{errors.country.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            {t("email")} *
          </label>
          <input
            id="contact-email"
            type="email"
            {...register("email")}
            className={cn(inputClass, errors.email && "border-red-500/50")}
            placeholder={t("emailPlaceholder")}
          />
          {errors.email && (
            <p className={errorClass}>{errors.email.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="contact-phone" className={labelClass}>
          {t("phone")}
        </label>
        <input
          id="contact-phone"
          {...register("phone")}
          className={cn(inputClass, errors.phone && "border-red-500/50")}
          placeholder={t("phonePlaceholder")}
        />
        {errors.phone && (
          <p className={errorClass}>{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contact-message" className={labelClass}>
          {t("message")} *
        </label>
        <textarea
          id="contact-message"
          rows={5}
          {...register("message")}
          className={cn(inputClass, "resize-none", errors.message && "border-red-500/50")}
          placeholder={t("messagePlaceholder")}
        />
        {errors.message && (
          <p className={errorClass}>{errors.message.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          "w-full inline-flex items-center justify-center rounded-xl border-0 font-body font-semibold text-white shadow-sm transition-all duration-200",
          "gradient-bg hover:opacity-90",
          "px-8 py-4",
          isLoading && "cursor-not-allowed opacity-70"
        )}
      >
        {isLoading
          ? t("sending")
          : isSuccess
            ? t("sent")
            : t("send")}
      </button>
    </form>
  );
}
