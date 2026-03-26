"use client";

import { useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import {
  createSampleRequestSchema,
  type SampleRequestFormData,
  type SampleValidationMessages,
} from "@/lib/validations";
import { trackLeadSubmission } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-surface-border bg-white px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/10 transition-all";
const labelClass = "mb-1.5 block font-body text-sm font-medium text-text-primary";
const errorClass = "mt-1 font-body text-xs text-red-500";
const pillBase =
  "cursor-pointer rounded-full border px-4 py-2 text-sm font-body transition-colors duration-200";

type SampleRequestFormProps = {
  productName: string;
  productSlug?: string;
  productUrl: string;
};

const CUSTOMIZATION_OPTIONS = [
  { value: "no", labelKey: "customizationNo" },
  { value: "logo-print", labelKey: "customizationLogoPrint" },
  { value: "embroidery", labelKey: "customizationEmbroidery" },
  { value: "labels-packaging", labelKey: "customizationLabelsPackaging" },
  { value: "not-sure", labelKey: "customizationNotSure" },
] as const;

export function SampleRequestForm({
  productName,
  productSlug,
  productUrl,
}: SampleRequestFormProps) {
  const t = useTranslations("sampleRequest");
  const locale = useLocale();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validationMessages: SampleValidationMessages = {
    nameMin: t("validation.nameMin"),
    companyRequired: t("validation.companyRequired"),
    countryMin: t("validation.countryMin"),
    emailInvalid: t("validation.emailInvalid"),
    quantityRequired: t("validation.quantityRequired"),
    messageMin: t("validation.messageMin"),
    fileSize: t("validation.fileSize"),
    fileType: t("validation.fileType"),
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<SampleRequestFormData>({
    resolver: zodResolver(createSampleRequestSchema(validationMessages)),
    defaultValues: {
      name: "",
      company: "",
      country: "",
      email: "",
      phone: "",
      sampleQuantity: "1",
      sizePreference: "",
      colorPreference: "",
      customization: "not-sure",
      customizationNotes: "",
      productName,
      productSlug: productSlug ?? "",
      productUrl,
      message: t("defaultMessage", { product: productName }),
      attachment: undefined,
    },
  });

  async function onSubmit(formValues: SampleRequestFormData) {
    setIsLoading(true);
    setErrorMessage(null);
    setIsSuccess(false);
    try {
      const payload = {
        ...formValues,
        attachment: undefined,
      };

      let res: Response;
      if (selectedFile) {
        const formData = new FormData();
        formData.append("data", JSON.stringify(payload));
        formData.append("attachment", selectedFile);
        res = await fetch("/api/sample-request", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/sample-request", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formValues),
        });
      }

      const json = await res.json();
      if (!res.ok) {
        setErrorMessage(json.error ?? t("errorMsg"));
        return;
      }
      setIsSuccess(true);
      reset({
        name: "",
        company: "",
        country: "",
        email: "",
        phone: "",
        sampleQuantity: "1",
        sizePreference: "",
        colorPreference: "",
        customization: "not-sure",
        customizationNotes: "",
        productName,
        productSlug: productSlug ?? "",
        productUrl,
        message: t("defaultMessage", { product: productName }),
        attachment: undefined,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      trackLeadSubmission({
        formType: "sample-request",
        locale,
        path: pathname,
        partial: Boolean(json?.partial),
      });
    } catch {
      setErrorMessage(t("networkError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <input type="hidden" {...register("productName")} />
      <input type="hidden" {...register("productSlug")} />
      <input type="hidden" {...register("productUrl")} />

      <div aria-live="polite" aria-atomic="true">
        {isSuccess && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4">
            <p className="font-body text-sm text-green-700">✓ {t("successMsg")}</p>
          </div>
        )}
        {errorMessage && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4">
            <p className="font-body text-sm text-red-700">{errorMessage}</p>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="sample-name" className={labelClass}>
            {t("nameLabel")} *
          </label>
          <input id="sample-name" {...register("name")} className={cn(inputClass, errors.name && "border-red-500/50")} placeholder={t("namePlaceholder")} />
          {errors.name && <p className={errorClass}>{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="sample-company" className={labelClass}>
            {t("companyLabel")} *
          </label>
          <input id="sample-company" {...register("company")} className={cn(inputClass, errors.company && "border-red-500/50")} placeholder={t("companyPlaceholder")} />
          {errors.company && <p className={errorClass}>{errors.company.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="sample-country" className={labelClass}>
            {t("countryLabel")} *
          </label>
          <input id="sample-country" {...register("country")} className={cn(inputClass, errors.country && "border-red-500/50")} placeholder={t("countryPlaceholder")} />
          {errors.country && <p className={errorClass}>{errors.country.message}</p>}
        </div>
        <div>
          <label htmlFor="sample-email" className={labelClass}>
            {t("emailLabel")} *
          </label>
          <input id="sample-email" type="email" {...register("email")} className={cn(inputClass, errors.email && "border-red-500/50")} placeholder={t("emailPlaceholder")} />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="sample-phone" className={labelClass}>
            {t("phoneLabel")}
          </label>
          <input id="sample-phone" {...register("phone")} className={cn(inputClass, errors.phone && "border-red-500/50")} placeholder={t("phonePlaceholder")} />
          {errors.phone && <p className={errorClass}>{errors.phone.message}</p>}
        </div>
        <div>
          <label htmlFor="sample-quantity" className={labelClass}>
            {t("quantityLabel")} *
          </label>
          <select id="sample-quantity" {...register("sampleQuantity")} className={cn(inputClass, errors.sampleQuantity && "border-red-500/50")}>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="5+">5+</option>
          </select>
          {errors.sampleQuantity && <p className={errorClass}>{errors.sampleQuantity.message}</p>}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="sample-size" className={labelClass}>
            {t("sizePreferenceLabel")}
          </label>
          <input id="sample-size" {...register("sizePreference")} className={inputClass} placeholder={t("sizePreferencePlaceholder")} />
        </div>
        <div>
          <label htmlFor="sample-color" className={labelClass}>
            {t("colorPreferenceLabel")}
          </label>
          <input id="sample-color" {...register("colorPreference")} className={inputClass} placeholder={t("colorPreferencePlaceholder")} />
        </div>
      </div>

      <div>
        <label className={labelClass}>{t("customizationLabel")}</label>
        <Controller
          name="customization"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {CUSTOMIZATION_OPTIONS.map((opt) => {
                const selected = field.value === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => field.onChange(opt.value)}
                    className={cn(
                      pillBase,
                      selected
                        ? "gradient-bg border-transparent text-white"
                        : "border border-surface-3 bg-white text-text-secondary hover:border-brand-green/50"
                    )}
                  >
                    {t(opt.labelKey)}
                  </button>
                );
              })}
            </div>
          )}
        />
      </div>

      <div>
        <label htmlFor="sample-customization-notes" className={labelClass}>
          {t("customizationNotesLabel")}
        </label>
        <textarea
          id="sample-customization-notes"
          rows={3}
          {...register("customizationNotes")}
          className={cn(inputClass, "resize-none")}
          placeholder={t("customizationNotesPlaceholder")}
        />
      </div>

      <div>
        <label className={labelClass}>
          {t("attachmentLabel")}
          <span className="ml-1 font-body text-sm font-normal text-text-muted">{t("attachmentHint")}</span>
        </label>
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="mt-2 cursor-pointer rounded-xl border-2 border-dashed border-surface-border p-6 text-center transition-colors hover:border-brand-green"
        >
          <Upload className="mx-auto mb-2 size-8 text-text-muted" />
          <p className="font-body text-sm text-text-secondary">
            {selectedFile ? selectedFile.name : t("attachmentDropzone")}
          </p>
          {selectedFile && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                setValue("attachment", undefined);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="mt-1 text-xs text-red-500 hover:underline"
            >
              {t("attachmentRemove")}
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setSelectedFile(file);
              setValue("attachment", file);
            }
          }}
        />
        {errors.attachment && <p className={errorClass}>{errors.attachment.message}</p>}
      </div>

      <div>
        <label htmlFor="sample-message" className={labelClass}>
          {t("messageLabel")} *
        </label>
        <textarea
          id="sample-message"
          rows={4}
          {...register("message")}
          className={cn(inputClass, "resize-none", errors.message && "border-red-500/50")}
          placeholder={t("messagePlaceholder")}
        />
        {errors.message && <p className={errorClass}>{errors.message.message}</p>}
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
        {isLoading ? t("submitting") : isSuccess ? t("submitted") : t("submit")}
      </button>
    </form>
  );
}
