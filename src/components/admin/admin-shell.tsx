import Link from "next/link";
import type { PropsWithChildren } from "react";
import { AdminSignOutButton } from "./admin-sign-out-button";

export const adminSections = [
  { slug: "site-settings", label: "Site Settings", description: "Brand, SEO, dan kontak global." },
  { slug: "homepage", label: "Homepage", description: "Hero, featured product, reasons, dan TikTok block." },
  { slug: "products", label: "Products", description: "Produk, fitur, specs, gallery, dan status aktif." },
  { slug: "branches", label: "Branches", description: "Data cabang, map, koordinat, dan foto." },
  { slug: "articles", label: "Articles", description: "Artikel, tag, section, dan status publish." },
  { slug: "about-page", label: "About Page", description: "Story section, mission, dan value cards." },
  { slug: "contact-page", label: "Contact Page", description: "Konten halaman kontak dan CTA sosial." },
  { slug: "newsletter", label: "Newsletter", description: "Subscriber, status, dan export list." },
  { slug: "contact-messages", label: "Contact Messages", description: "Inbox pesan masuk dan status follow-up." },
  { slug: "navigation", label: "Navigation", description: "Navbar, footer help, dan social links." },
  { slug: "media-library", label: "Media Library", description: "Asset gambar dari Supabase Storage." },
] as const;

export type AdminSectionSlug = (typeof adminSections)[number]["slug"];

export function getAdminSection(slug: string) {
  return adminSections.find((section) => section.slug === slug);
}

export function AdminShell({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-[var(--surface-container-low)] text-[var(--on-surface)]">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <aside className="w-full shrink-0 rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)] lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-80 lg:overflow-y-auto">
          <div className="flex items-start justify-between gap-4">
            <Link href="/admin" className="block">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                Kembung Admin
              </p>
              <h1 className="mt-3 text-[2rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
                Dashboard Foundation
              </h1>
              <p className="mt-3 text-sm leading-7 text-[var(--on-surface-variant)]">
                Fondasi Supabase sudah aktif. Berikutnya kita tinggal isi tiap modul CRUD
                sesuai struktur website yang sekarang.
              </p>
            </Link>

            <AdminSignOutButton />
          </div>

          <nav className="mt-8 space-y-2">
            <Link
              href="/admin"
              className="flex rounded-[1.25rem] bg-[var(--primary-container)]/35 px-4 py-3 text-sm font-semibold text-[var(--primary)] transition-colors hover:bg-[var(--primary-container)]/55"
            >
              Overview
            </Link>

            {adminSections.map((section) => (
              <Link
                key={section.slug}
                href={`/admin/${section.slug}`}
                className="block rounded-[1.25rem] px-4 py-3 transition-colors hover:bg-[var(--surface-container-low)]"
              >
                <p className="text-sm font-semibold text-[var(--on-surface)]">
                  {section.label}
                </p>
                <p className="mt-1 text-xs leading-6 text-[var(--on-surface-variant)]">
                  {section.description}
                </p>
              </Link>
            ))}
          </nav>
        </aside>

        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
