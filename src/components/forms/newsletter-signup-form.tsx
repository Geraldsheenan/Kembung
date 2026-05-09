"use client";

import { useState, type FormEvent } from "react";
import { useToast } from "@/components/animation/toast";

type NewsletterSignupFormProps = {
  source: string;
  inputPlaceholder: string;
  buttonLabel: string;
  formClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterSignupForm({
  source,
  inputPlaceholder,
  buttonLabel,
  formClassName,
  inputClassName,
  buttonClassName,
}: NewsletterSignupFormProps) {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { pushToast } = useToast();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      pushToast("Masukkan email yang valid dulu ya.", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizedEmail,
          source,
        }),
      });

      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        pushToast(result.message ?? "Pendaftaran belum berhasil.", "error");
        return;
      }

      setEmail("");
      pushToast(result.message ?? `${normalizedEmail} berhasil didaftarkan.`);
    } catch (error) {
      console.error("Newsletter submit failed", error);
      pushToast("Koneksi sedang bermasalah. Coba lagi ya.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className={formClassName}>
      <input
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder={inputPlaceholder}
        className={inputClassName}
        aria-label="Email newsletter"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        className={buttonClassName}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Mengirim..." : buttonLabel}
      </button>
    </form>
  );
}
