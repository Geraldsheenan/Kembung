"use client";

import { useState } from "react";
import type { PublicSiteSettings } from "@/lib/content/site-content";
import { MediaUrlField } from "./media-url-field";

type SiteSettingsFormProps = {
  initialValues: PublicSiteSettings;
};

export function SiteSettingsForm({ initialValues }: SiteSettingsFormProps) {
  const [form, setForm] = useState(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
              className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
          className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {message ? (
        <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)] disabled:opacity-70"
      >
        {isSubmitting ? "Menyimpan..." : "Simpan Site Settings"}
      </button>
    </form>
  );
}
