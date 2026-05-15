"use client";

import { useState } from "react";
import type { ContactPageSettingsContent } from "@/lib/content/contact-page-content";
import {
  AdminFlashMessage,
  AdminInputClassName,
  AdminPrimaryButton,
  AdminTextareaClassName,
} from "./admin-workspace";
import { MediaUrlField } from "./media-url-field";

type ContactPageAdminClientProps = {
  initialValue: ContactPageSettingsContent;
};

export function ContactPageAdminClient({
  initialValue,
}: ContactPageAdminClientProps) {
  const [form, setForm] = useState(initialValue);
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

    const response = await fetch("/api/admin/contact-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Contact page belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message ?? "Contact page berhasil disimpan.");
    setIsSubmitting(false);
  }

  function updateField<Key extends keyof ContactPageSettingsContent>(
    key: Key,
    value: ContactPageSettingsContent[Key],
  ) {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-5 md:grid-cols-2">
        {[
          ["title", "Judul Halaman"],
          ["addressLabel", "Label Alamat"],
          ["phoneLabel", "Label Nomor Telepon"],
          ["phoneNumber", "Nomor Telepon"],
          ["emailLabel", "Label Email"],
          ["emailAddress", "Email"],
          ["websiteLabel", "Label Website"],
          ["websiteText", "Teks Website"],
          ["websiteUrl", "URL Website"],
          ["socialMediaLabel", "Label Social Media"],
          ["instagramHandle", "Handle Instagram"],
          ["instagramUrl", "URL Instagram"],
          ["tiktokHandle", "Handle TikTok"],
          ["tiktokUrl", "URL TikTok"],
          ["operationalHoursTitle", "Judul Jam Operasional"],
          ["weekdayHours", "Jam Senin - Jumat"],
          ["saturdayHours", "Jam Sabtu"],
          ["holidayHours", "Jam Minggu / Hari Libur"],
          ["formTitle", "Judul Form"],
        ].map(([key, label]) => (
          <div key={key} className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              {label}
            </label>
            <input
              value={String(form[key as keyof ContactPageSettingsContent] ?? "")}
              onChange={(event) =>
                updateField(
                  key as keyof ContactPageSettingsContent,
                  event.target.value as never,
                )
              }
              className={inputClassName}
            />
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
          Deskripsi Halaman
        </label>
        <textarea
          rows={4}
          value={form.description}
          onChange={(event) => updateField("description", event.target.value)}
          className={textareaClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
          Alamat Lengkap
        </label>
        <textarea
          rows={3}
          value={form.address}
          onChange={(event) => updateField("address", event.target.value)}
          className={textareaClassName}
        />
      </div>

      <MediaUrlField
        label="Gambar Lokasi / Peta"
        value={form.studioMapImageUrl}
        onChange={(nextValue) => updateField("studioMapImageUrl", nextValue)}
        uploadTag="contact"
        uploadAltText="Lokasi Kembunk"
      />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
            Judul Kartu WhatsApp
          </label>
          <input
            value={form.whatsappCardTitle}
            onChange={(event) => updateField("whatsappCardTitle", event.target.value)}
            className={inputClassName}
          />
        </div>

        <div className="space-y-2">
          <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
            Kalimat Penutup
          </label>
          <textarea
            rows={3}
            value={form.closingStatement}
            onChange={(event) => updateField("closingStatement", event.target.value)}
            className={textareaClassName}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
          Deskripsi Kartu WhatsApp
        </label>
        <textarea
          rows={3}
          value={form.whatsappCardDescription}
          onChange={(event) => updateField("whatsappCardDescription", event.target.value)}
          className={textareaClassName}
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
          Deskripsi Form
        </label>
        <textarea
          rows={3}
          value={form.formDescription}
          onChange={(event) => updateField("formDescription", event.target.value)}
          className={textareaClassName}
        />
      </div>

      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
        {isSubmitting ? "Menyimpan..." : "Simpan Contact Page"}
      </AdminPrimaryButton>
    </form>
  );
}
