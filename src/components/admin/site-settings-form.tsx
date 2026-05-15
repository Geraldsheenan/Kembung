"use client";

import { useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/site-settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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

      <div className="grid gap-5 md:grid-cols-2">
        <MediaUrlField
          label="Logo"
          value={form.logoUrl}
          onChange={(nextValue) =>
            setForm((current) => ({
              ...current,
              logoUrl: nextValue,
            }))
          }
        />

        <MediaUrlField
          label="Favicon"
          value={form.faviconUrl}
          onChange={(nextValue) =>
            setForm((current) => ({
              ...current,
              faviconUrl: nextValue,
            }))
          }
        />
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
