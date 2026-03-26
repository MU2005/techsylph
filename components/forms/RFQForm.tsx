"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { Upload } from "lucide-react";
import { createRfqSchema, type RFQFormData, type ValidationMessages } from "@/lib/validations";
import { trackLeadSubmission } from "@/lib/analytics";
import { cn } from "@/lib/utils";

const CATEGORY_OPTIONS = [
  "T-Shirts & Basics",
  "Hoodies & Sweatshirts",
  "Activewear",
  "Custom / Private Label",
] as const;

const CATEGORY_KEYS = [
  "categoryTshirts",
  "categoryHoodies",
  "categoryActivewear",
  "categoryCustom",
] as const;

const inputClass =
  "w-full rounded-xl border border-surface-border bg-white px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-muted focus:border-brand-green focus:outline-none focus:ring-2 focus:ring-brand-green/10 transition-all";
const labelClass = "mb-1.5 block font-body text-sm font-medium text-text-primary";
const errorClass = "mt-1 font-body text-xs text-red-500";

const pillBase =
  "cursor-pointer rounded-full border px-4 py-2 text-sm font-body transition-colors duration-200";

const CUSTOM_CATEGORY = "Custom / Private Label";

export function RFQForm() {
  const t = useTranslations("rfq");
  const tCatalog = useTranslations("catalog");
  const locale = useLocale();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validationMessages: ValidationMessages = {
    nameMin: t("validation.nameMin"),
    countryMin: t("validation.countryMin"),
    emailInvalid: t("validation.emailInvalid"),
    messageMin: t("validation.messageMin"),
    companyRequired: t("validation.companyRequired"),
    categoryMin: t("validation.categoryMin"),
    quantityRequired: t("validation.quantityRequired"),
    fileSize: t("validation.fileSize"),
    fileType: t("validation.fileType"),
  };

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RFQFormData>({
    resolver: zodResolver(createRfqSchema(validationMessages)),
    defaultValues: {
      categories: [],
      customization: undefined,
      customLabelRequest: false,
    },
  });

  const categories = watch("categories");
  const customLabelRequest = watch("customLabelRequest");
  const showAttachment =
    customLabelRequest === true || (Array.isArray(categories) && categories.includes(CUSTOM_CATEGORY));

  useEffect(() => {
    if (searchParams.get("type") === "custom") {
      setValue("categories", [CUSTOM_CATEGORY]);
      setValue("customLabelRequest", true);
    }
  }, [searchParams, setValue]);

  async function onSubmit(formValues: RFQFormData) {
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
        res = await fetch("/api/rfq", {
          method: "POST",
          body: formData,
        });
      } else {
        res = await fetch("/api/rfq", {
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
        categories: [],
        customization: undefined,
        customLabelRequest: false,
        attachment: undefined,
      });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      trackLeadSubmission({
        formType: "rfq",
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
      <div aria-live="polite" aria-atomic="true">
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
      </div>

      <div className="grid gap-6 md:grid-cols-2 md:gap-4">
        <div>
          <label htmlFor="rfq-name" className={labelClass}>
            {t("nameLabel")} *
          </label>
          <input
            id="rfq-name"
            {...register("name")}
            className={cn(inputClass, errors.name && "border-red-500/50")}
            placeholder={t("namePlaceholder")}
          />
          {errors.name && (
            <p className={errorClass}>{errors.name.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="rfq-company" className={labelClass}>
            {t("companyLabel")} *
          </label>
          <input
            id="rfq-company"
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
          <label htmlFor="rfq-country" className={labelClass}>
            {t("countryLabel")} *
          </label>
          <input
            id="rfq-country"
            {...register("country")}
            className={cn(inputClass, errors.country && "border-red-500/50")}
            placeholder={t("countryPlaceholder")}
          />
          {errors.country && (
            <p className={errorClass}>{errors.country.message}</p>
          )}
        </div>
        <div>
          <label htmlFor="rfq-email" className={labelClass}>
            {t("emailLabel")} *
          </label>
          <input
            id="rfq-email"
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
        <label htmlFor="rfq-phone" className={labelClass}>
          {t("phoneLabel")}
        </label>
        <input
          id="rfq-phone"
          {...register("phone")}
          className={cn(inputClass, errors.phone && "border-red-500/50")}
          placeholder={t("phonePlaceholder")}
        />
        {errors.phone && (
          <p className={errorClass}>{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("categoriesLabel")} *</label>
        <Controller
          name="categories"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {CATEGORY_OPTIONS.map((opt, i) => {
                const checked = field.value.includes(opt);
                return (
                  <button
                    key={opt}
                    type="button"
                    aria-pressed={checked}
                    onClick={() => {
                      const next = checked
                        ? field.value.filter((x) => x !== opt)
                        : [...field.value, opt];
                      field.onChange(next);
                    }}
                    className={cn(
                      pillBase,
                      checked
                        ? "gradient-bg border-transparent text-white"
                        : "border border-surface-3 bg-white text-text-secondary hover:border-brand-green/50"
                    )}
                  >
                    {tCatalog(CATEGORY_KEYS[i])}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.categories && (
          <p className={errorClass}>{errors.categories.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="rfq-quantity" className={labelClass}>
          {t("quantityLabel")} *
        </label>
        <input
          id="rfq-quantity"
          {...register("quantity")}
          className={cn(inputClass, errors.quantity && "border-red-500/50")}
          placeholder={t("quantityPlaceholder")}
        />
        {errors.quantity && (
          <p className={errorClass}>{errors.quantity.message}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>{t("customizationLabel")}</label>
        <Controller
          name="customization"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-3">
              {(["yes", "no", "not-sure"] as const).map((value) => {
                const label =
                  value === "yes"
                    ? t("customYes")
                    : value === "no"
                      ? t("customNo")
                      : t("customNotSure");
                const selected = field.value === value;
                return (
                  <button
                    key={value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => field.onChange(value)}
                    className={cn(
                      pillBase,
                      selected
                        ? "gradient-bg border-transparent text-white"
                        : "border border-surface-3 bg-white text-text-secondary hover:border-brand-green/50"
                    )}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          )}
        />
        {errors.customization && (
          <p className={errorClass}>{errors.customization.message}</p>
        )}
      </div>

      {Array.isArray(categories) && categories.includes(CUSTOM_CATEGORY) && (
        <div>
          <label className="mt-4 flex cursor-pointer items-center gap-3">
            <input type="checkbox" {...register("customLabelRequest")} />
            <span className="font-body text-sm text-text-secondary">
              {t("customLabelCheckbox")}
            </span>
          </label>
        </div>
      )}

      {showAttachment && (
        <div>
          <label className={labelClass}>
            {t("attachmentLabel")}
            <span className="ml-1 font-body text-sm font-normal text-text-muted">
              {t("attachmentHint")}
            </span>
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
          {errors.attachment && (
            <p className={errorClass}>{errors.attachment.message}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="rfq-message" className={labelClass}>
          {t("notesLabel")}
        </label>
        <textarea
          id="rfq-message"
          rows={4}
          {...register("message")}
          className={cn(inputClass, "resize-none", errors.message && "border-red-500/50")}
          placeholder={t("notesPlaceholder")}
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
          ? t("submitting")
          : isSuccess
            ? t("submitted")
            : t("submit")}
      </button>
    </form>
  );
}
