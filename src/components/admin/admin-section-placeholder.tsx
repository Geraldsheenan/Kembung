import Link from "next/link";
import type { AdminSectionSlug } from "./admin-shell";

const moduleChecklist: Record<
  AdminSectionSlug,
  { title: string; items: string[]; primaryAction: string }
> = {
  "site-settings": {
    title: "Global brand configuration",
    items: [
      "Form singleton untuk nama brand, tagline, SEO, dan kontak WhatsApp.",
      "Preview untuk logo, favicon, dan social links global.",
      "Sinkronisasi ke navbar, footer, metadata, dan helper WhatsApp.",
    ],
    primaryAction: "Bangun form singleton + fetch site_settings",
  },
  homepage: {
    title: "Homepage content control",
    items: [
      "Editor section berdasarkan section_key seperti hero, newsletter, dan TikTok.",
      "Selector featured products per device dengan sort order.",
      "Repeater untuk reason items desktop dan mobile.",
    ],
    primaryAction: "Bangun fetch blok homepage + reorder UI",
  },
  products: {
    title: "Product CRUD hub",
    items: [
      "Table produk dengan filter aktif, kategori, dan featured.",
      "Editor nested untuk specs, features, colors, audiences, dan gallery.",
      "Upload gambar ke Supabase Storage lalu simpan public URL ke product image fields.",
    ],
    primaryAction: "Bangun products table + nested detail editor",
  },
  branches: {
    title: "Branch management",
    items: [
      "Table cabang dengan sort order dan status aktif.",
      "Form alamat, jam operasional, koordinat, map embed, dan tone visual.",
      "Preview peta dan thumbnail cabang sebelum publish.",
    ],
    primaryAction: "Bangun branch form + map preview",
  },
  articles: {
    title: "Editorial workflow",
    items: [
      "List artikel draft dan published dengan featured switch.",
      "Editor tag, section, dan paragraf berurutan.",
      "Field SEO seperti canonical URL dan OG image override.",
    ],
    primaryAction: "Bangun article editor + nested sections",
  },
  "about-page": {
    title: "About page blocks",
    items: [
      "Editor setiap section berdasarkan section_key.",
      "Repeater value cards dengan icon_key dan theme_key.",
      "Image picker untuk story visual dan final CTA image.",
    ],
    primaryAction: "Bangun about sections + values editor",
  },
  "contact-page": {
    title: "Contact page content",
    items: [
      "Form singleton untuk title, description, dan WhatsApp card copy.",
      "Field alamat studio, preview map image, dan social links lokal halaman kontak.",
      "Tombol cepat ke modul Contact Messages untuk follow-up user.",
    ],
    primaryAction: "Bangun contact page singleton form",
  },
  newsletter: {
    title: "Subscriber operations",
    items: [
      "Table subscriber dengan filter status dan source.",
      "Bulk action untuk unsubscribe atau cleanup data duplikat.",
      "Export CSV agar tim marketing gampang olah data.",
    ],
    primaryAction: "Bangun subscriber list + export action",
  },
  "contact-messages": {
    title: "Inbox and support follow-up",
    items: [
      "List pesan dengan status new, read, replied, dan archived.",
      "Panel detail pesan dengan admin_note internal.",
      "Action cepat untuk ubah status tanpa meninggalkan tabel.",
    ],
    primaryAction: "Bangun inbox table + side detail panel",
  },
  navigation: {
    title: "Navigation and footer links",
    items: [
      "Manage location navbar, footer_help, dan footer_social dalam satu tabel.",
      "Drag or input sort order untuk kontrol urutan menu.",
      "Toggles aktif/nonaktif untuk eksperimen link tanpa hapus data.",
    ],
    primaryAction: "Bangun navigation table + location filter",
  },
  "media-library": {
    title: "Storage-backed media picker",
    items: [
      "List asset dari tabel media_assets dan bucket public-media.",
      "Upload flow yang menyimpan file_path, alt_text, dan tag.",
      "Picker reuse agar form produk, artikel, dan section bisa pilih gambar yang sama.",
    ],
    primaryAction: "Bangun upload + asset picker foundation",
  },
};

type AdminSectionPlaceholderProps = {
  slug: AdminSectionSlug;
  label: string;
  description: string;
};

export function AdminSectionPlaceholder({
  slug,
  label,
  description,
}: AdminSectionPlaceholderProps) {
  const section = moduleChecklist[slug];

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Admin Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold leading-tight tracking-[-0.04em] text-[var(--primary)]">
          {label}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          {description}
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
          <h3 className="text-xl font-bold text-[var(--on-surface)]">{section.title}</h3>
          <div className="mt-6 space-y-4">
            {section.items.map((item) => (
              <div
                key={item}
                className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4 text-sm leading-7 text-[var(--on-surface-variant)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[var(--primary-container)]/35 p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Next Build Slice
          </p>
          <h3 className="mt-4 text-2xl font-extrabold tracking-[-0.03em] text-[var(--primary)]">
            {section.primaryAction}
          </h3>
          <p className="mt-4 text-sm leading-7 text-[var(--on-surface-variant)]">
            Halaman ini masih placeholder yang sengaja dibuat tipis, jadi kita bisa lanjut
            isi CRUD per modul tanpa bongkar struktur admin lagi.
          </p>

          <div className="mt-8 flex flex-col gap-3">
            <Link
              href="/admin"
              className="rounded-full bg-[var(--primary)] px-5 py-3 text-center text-sm font-semibold text-[var(--on-primary)]"
            >
              Kembali ke Overview
            </Link>
            <Link
              href="/admin/products"
              className="rounded-full border border-[var(--outline-variant)]/35 bg-white px-5 py-3 text-center text-sm font-semibold text-[var(--on-surface)]"
            >
              Lihat Modul Produk
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

