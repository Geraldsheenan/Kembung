"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useToast } from "@/components/animation/toast";
import { LimitedRichText } from "@/components/common/limited-rich-text";

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactMessageFormProps = {
  title?: string;
  description?: string;
};

export function ContactMessageForm({ title, description }: ContactMessageFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pushToast } = useToast();

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      subject: form.subject.trim(),
      message: form.message.trim(),
      source: "contact-page",
    };

    if (payload.name.length < 2) {
      pushToast("Nama lengkap minimal 2 karakter.", "error");
      return;
    }

    if (!emailPattern.test(payload.email)) {
      pushToast("Masukkan email yang valid dulu ya.", "error");
      return;
    }

    if (payload.message.length < 10) {
      pushToast("Pesan minimal 10 karakter ya.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        pushToast(result.message ?? "Pesan belum berhasil dikirim.", "error");
        return;
      }

      setForm(initialState);
      pushToast(result.message ?? `Pesan ${payload.name} berhasil terkirim.`);
    } catch (error) {
      console.error("Contact message submit failed", error);
      pushToast("Koneksi sedang bermasalah. Coba lagi ya.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {title ? (
        <div className="space-y-2">
          <LimitedRichText
            as="h2"
            value={title}
            className="text-[1.9rem] font-bold text-[var(--primary)] [&_em]:italic [&_strong]:font-extrabold [&_u]:underline"
          />
          {description ? (
            <LimitedRichText
              value={description}
              className="text-sm leading-7 text-[var(--on-surface-variant)] [&_em]:italic [&_strong]:font-semibold [&_u]:underline"
            />
          ) : null}
        </div>
      ) : null}

      <div className="space-y-2">
        <label
          htmlFor="contact-name"
          className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]"
        >
          Nama Lengkap
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Siapa nama kamu?"
          className="w-full rounded-full border-none bg-[var(--secondary-fixed)]/30 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-container)]"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="contact-email"
          className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="example@hydration.com"
          className="w-full rounded-full border-none bg-[var(--secondary-fixed)]/30 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-container)]"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="contact-subject"
          className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]"
        >
          Subjek Pesan
        </label>
        <input
          id="contact-subject"
          name="subject"
          type="text"
          value={form.subject}
          onChange={handleChange}
          placeholder="Contoh: Tanya stok, kerja sama, atau kritik dan saran"
          className="w-full rounded-full border-none bg-[var(--secondary-fixed)]/30 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-container)]"
          disabled={isSubmitting}
        />
      </div>
      <div className="space-y-2">
        <label
          htmlFor="contact-message"
          className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]"
        >
          Pesan
        </label>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tulis apa aja yang ada di pikiranmu..."
          className="w-full resize-none rounded-[1.5rem] border-none bg-[var(--secondary-fixed)]/30 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary-container)]"
          disabled={isSubmitting}
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-[var(--primary)]/20 transition-transform duration-200 hover:scale-105 md:w-max disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
      </button>
    </form>
  );
}
