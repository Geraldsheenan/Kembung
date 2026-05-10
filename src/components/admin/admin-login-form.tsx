"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const supabase = getSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsSubmitting(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]" htmlFor="admin-email">
          Email
        </label>
        <input
          id="admin-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@kembung.com"
          className="w-full rounded-full border border-[var(--outline-variant)]/35 bg-[var(--surface-container-low)] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          disabled={isSubmitting}
          required
        />
      </div>

      <div className="space-y-2">
        <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]" htmlFor="admin-password">
          Password
        </label>
        <input
          id="admin-password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Masukkan password admin"
          className="w-full rounded-full border border-[var(--outline-variant)]/35 bg-[var(--surface-container-low)] px-6 py-4 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          disabled={isSubmitting}
          required
        />
      </div>

      {errorMessage ? (
        <div className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-full bg-[var(--primary)] px-6 py-4 text-sm font-semibold text-[var(--on-primary)] transition-transform duration-200 hover:scale-[1.01] disabled:opacity-70 disabled:hover:scale-100"
      >
        {isSubmitting ? "Masuk..." : "Masuk ke Dashboard"}
      </button>
    </form>
  );
}

