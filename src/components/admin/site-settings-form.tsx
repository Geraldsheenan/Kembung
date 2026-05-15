"use client";

import Image from "next/image";
import { useState } from "react";
import { BrandLogo } from "@/components/common/brand-logo";
import type { PublicSiteSettings } from "@/lib/content/site-content";
import {
  AdminFlashMessage,
  AdminInputClassName,
  AdminPrimaryButton,
  AdminTextareaClassName,
} from "./admin-workspace";
import { MediaUrlField } from "./media-url-field";

type SiteSettingsFormProps = {
  initialValues: PublicSiteSettings;
};

export function SiteSettingsForm({ initialValues }: SiteSettingsFormProps) {
  const [form, setForm] = useState(initialValues);
  const [syncBrandAssets, setSyncBrandAssets] = useState(
    initialValues.logoUrl === initialValues.faviconUrl,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

  function updateLogoUrl(nextValue: string) {
    setForm((current) => ({
      ...current,
      logoUrl: nextValue,
      ...(syncBrandAssets ? { faviconUrl: nextValue } : {}),
    }));
  }

  function updateFaviconUrl(nextValue: string) {
    setForm((current) => ({
      ...current,
      faviconUrl: nextValue,
      ...(syncBrandAssets ? { logoUrl: nextValue } : {}),
    }));
  }

  async function submitForm(nextForm: PublicSiteSettings) {
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextForm),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Site settings belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message ?? "Site settings berhasil disimpan.");
    setIsSubmitting(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitForm(form);
  }

  async function syncAndSave(
    field: "logoUrl" | "faviconUrl",
    value: string,
    successMessage: string,
  ) {
    if (!value) {
      return;
    }

    const nextForm = {
      ...form,
      [field]: value,
    };

    setForm(nextForm);
    await submitForm(nextForm);
    setMessage(successMessage);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["siteName", "Site Name"],
          ["tagline", "Tagline"],
          ["phoneDisplay", "Phone Display"],
          ["phoneInternational", "Phone International"],
          ["siteUrl", "Site URL"],
          ["instagramUrl", "Instagram URL"],
          ["tiktokUrl", "TikTok URL"],
        ].map(([key, label]) => (
          <div key={key} className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              {label}
            </label>
            <input
              value={form[key as keyof PublicSiteSettings] ?? ""}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
        <div className="space-y-5 rounded-[1.75rem] border border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)] p-5 md:p-6">
          <div>
            <h3 className="text-base font-semibold text-[var(--on-surface)]">
              Logo Website
            </h3>
            <p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">
              Field ini dipakai untuk logo header dan footer website.
            </p>
          </div>

          <label className="flex items-start gap-3 rounded-[1.25rem] border border-[var(--outline-variant)]/20 bg-white px-4 py-3">
            <input
              type="checkbox"
              checked={syncBrandAssets}
              onChange={(event) => {
                const checked = event.target.checked;
                setSyncBrandAssets(checked);
                if (!checked) {
                  return;
                }

                setForm((current) => {
                  const sharedAsset = current.logoUrl || current.faviconUrl;
                  return {
                    ...current,
                    logoUrl: sharedAsset,
                    faviconUrl: sharedAsset,
                  };
                });
              }}
              className="mt-1 h-4 w-4 rounded border-[var(--outline-variant)]/40 text-[var(--primary)] focus:ring-[var(--primary)]"
            />
            <span>
              <span className="block text-sm font-semibold text-[var(--on-surface)]">
                Sinkronkan logo dan favicon
              </span>
              <span className="mt-1 block text-xs leading-6 text-[var(--on-surface-variant)]">
                Saat aktif, perubahan gambar di salah satu field akan otomatis dipakai untuk keduanya.
              </span>
            </span>
          </label>

          <MediaUrlField
            label="Logo"
            value={form.logoUrl}
            helpText="Gunakan PNG transparan atau pilih dari Media Library agar hasil di header dan footer lebih rapi."
            onChange={updateLogoUrl}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                void syncAndSave(
                  "faviconUrl",
                  form.logoUrl,
                  "Logo berhasil disalin ke favicon dan langsung disimpan.",
                )
              }
              disabled={!form.logoUrl || isSubmitting}
              className="rounded-full border border-[var(--outline-variant)]/30 bg-white px-4 py-2 text-sm font-semibold text-[var(--on-surface)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Pakai Logo Ini untuk Favicon"}
            </button>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <div className="space-y-3 rounded-[1.5rem] border border-[var(--outline-variant)]/20 bg-[var(--surface)] p-5">
              <div>
                <h4 className="text-sm font-semibold text-[var(--on-surface)]">
                  Preview Header
                </h4>
                <p className="mt-1 text-xs leading-6 text-[var(--on-surface-variant)]">
                  Tampilan logo pada navbar website.
                </p>
              </div>

              <div className="rounded-full border border-white/70 bg-white/70 px-6 py-5 shadow-[0_12px_30px_-26px_rgba(47,58,61,0.18)] backdrop-blur-xl">
                <BrandLogo
                  href=""
                  size="navbar"
                  src={form.logoUrl || initialValues.logoUrl}
                  alt={form.siteName || initialValues.siteName}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-[1.5rem] border border-[var(--outline-variant)]/20 bg-[var(--surface)] p-5">
              <div>
                <h4 className="text-sm font-semibold text-[var(--on-surface)]">
                  Preview Footer
                </h4>
                <p className="mt-1 text-xs leading-6 text-[var(--on-surface-variant)]">
                  Tampilan logo pada footer website.
                </p>
              </div>

              <div className="rounded-[2rem] bg-[var(--secondary-container)] px-8 py-10">
                <BrandLogo
                  href=""
                  size="footer"
                  variant="full"
                  src={form.logoUrl || initialValues.logoUrl}
                  alt={form.siteName || initialValues.siteName}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5 rounded-[1.75rem] border border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)] p-5 md:p-6">
          <div>
            <h3 className="text-base font-semibold text-[var(--on-surface)]">
              Favicon Browser
            </h3>
            <p className="mt-1 text-sm leading-6 text-[var(--on-surface-variant)]">
              Field ini hanya dipakai untuk icon tab browser, bukan untuk logo header/footer.
            </p>
          </div>

          <MediaUrlField
            label="Favicon"
            value={form.faviconUrl}
            helpText="Idealnya gunakan gambar persegi yang tetap jelas di ukuran kecil."
            onChange={updateFaviconUrl}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() =>
                void syncAndSave(
                  "logoUrl",
                  form.faviconUrl,
                  "Favicon berhasil dipakai untuk header/footer dan langsung disimpan.",
                )
              }
              disabled={!form.faviconUrl || isSubmitting}
              className="rounded-full border border-[var(--outline-variant)]/30 bg-white px-4 py-2 text-sm font-semibold text-[var(--on-surface)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Menyimpan..." : "Pakai Favicon Ini untuk Header/Footer"}
            </button>
          </div>

          <div className="space-y-3 rounded-[1.5rem] border border-[var(--outline-variant)]/20 bg-[var(--surface)] p-5">
            <div>
              <h4 className="text-sm font-semibold text-[var(--on-surface)]">
                Preview Favicon
              </h4>
              <p className="mt-1 text-xs leading-6 text-[var(--on-surface-variant)]">
                Preview ini mengikuti field Favicon dan dipakai untuk icon tab browser.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-[1.25rem] border border-[var(--outline-variant)]/20 bg-white px-4 py-4">
              <div className="relative h-12 w-12 overflow-hidden rounded-xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-low)]">
                <Image
                  src={form.faviconUrl || initialValues.faviconUrl}
                  alt={`${form.siteName || initialValues.siteName} favicon`}
                  fill
                  className="object-contain p-1.5"
                />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[var(--on-surface)]">
                  {form.siteName || initialValues.siteName}
                </p>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Browser Tab Icon
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
          Description
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              description: event.target.value,
            }))
          }
          className={textareaClassName}
        />
      </div>

      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
        {isSubmitting ? "Menyimpan..." : "Simpan Site Settings"}
      </AdminPrimaryButton>
    </form>
  );
}
