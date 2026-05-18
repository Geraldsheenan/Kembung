import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  BookOpenText,
  GalleryVerticalEnd,
  LayoutList,
  Mail,
  MapPinned,
  MessageSquareMore,
  PenSquare,
  Sparkles,
} from "lucide-react";
import { adminSections } from "@/components/admin/admin-config";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type ProductOverviewRow = {
  id: string;
  name: string;
  category: string;
  price: number | string;
  is_featured: boolean | null;
};

type BranchOverviewRow = {
  id: string;
  name: string;
  area: string;
  hours: string | null;
};

type ArticleOverviewRow = {
  id: string;
  title: string;
  category: string;
  status: "draft" | "published";
  published_date: string | null;
  is_featured: boolean | null;
};

type ContactMessageOverviewRow = {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  status: "new" | "read" | "replied" | "archived";
  created_at: string;
};

type NewsletterOverviewRow = {
  id: string;
  email: string;
  source: string | null;
  status: "subscribed" | "unsubscribed";
  created_at: string;
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string | null) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength - 1)}...`;
}

function getStatusLabel(value: string) {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getModuleTone(count: number) {
  if (count === 0) {
    return {
      cardClass: "border-amber-200 bg-amber-50/80 hover:border-amber-300 hover:bg-white",
      iconClass: "bg-white text-amber-600 group-hover:bg-amber-100 group-hover:text-amber-700",
      badgeClass: "bg-amber-100 text-amber-700",
      statusLabel: "Perlu diisi",
      statusClass: "bg-amber-100 text-amber-700",
    };
  }

  if (count <= 2) {
    return {
      cardClass: "border-sky-200 bg-sky-50/60 hover:border-sky-300 hover:bg-white",
      iconClass: "bg-white text-sky-700 group-hover:bg-sky-100 group-hover:text-sky-700",
      badgeClass: "bg-sky-100 text-sky-700",
      statusLabel: "Mulai terisi",
      statusClass: "bg-sky-100 text-sky-700",
    };
  }

  return {
    cardClass: "border-emerald-200 bg-emerald-50/50 hover:border-emerald-300 hover:bg-white",
    iconClass:
      "bg-white text-emerald-700 group-hover:bg-emerald-100 group-hover:text-emerald-700",
    badgeClass: "bg-emerald-100 text-emerald-700",
    statusLabel: "Siap dikelola",
    statusClass: "bg-emerald-100 text-emerald-700",
  };
}

async function getDashboardData() {
  const supabase = await getSupabaseServerClient();

  const [
    { count: productsCount },
    { count: branchesCount },
    { count: articlesPublishedCount },
    { count: articlesDraftCount },
    { count: newsletterCount },
    { count: unsubscribedCount },
    { count: newMessagesCount },
    { count: totalMessagesCount },
    { count: mediaAssetsCount },
    { count: navigationItemsCount },
    { count: homepageSectionsCount },
    { count: siteSettingsCount },
    { count: aboutSectionsCount },
    { count: contactPageSettingsCount },
    productsQuery,
    branchesQuery,
    articlesQuery,
    messagesQuery,
    newsletterQuery,
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("branches").select("*", { count: "exact", head: true }).eq("is_active", true),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("articles").select("*", { count: "exact", head: true }).eq("status", "draft"),
    supabase
      .from("newsletter_signups")
      .select("*", { count: "exact", head: true })
      .eq("status", "subscribed"),
    supabase
      .from("newsletter_signups")
      .select("*", { count: "exact", head: true })
      .eq("status", "unsubscribed"),
    supabase
      .from("contact_messages")
      .select("*", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("contact_messages").select("*", { count: "exact", head: true }),
    supabase.from("media_assets").select("*", { count: "exact", head: true }),
    supabase.from("navigation_items").select("*", { count: "exact", head: true }),
    supabase.from("homepage_sections").select("*", { count: "exact", head: true }),
    supabase.from("site_settings").select("*", { count: "exact", head: true }),
    supabase.from("about_page_sections").select("*", { count: "exact", head: true }),
    supabase.from("contact_page_settings").select("*", { count: "exact", head: true }),
    supabase
      .from("products")
      .select("id, name, category, price, is_featured")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("sort_order", { ascending: true })
      .limit(5),
    supabase
      .from("branches")
      .select("id, name, area, hours")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .limit(5),
    supabase
      .from("articles")
      .select("id, title, category, status, published_date, is_featured")
      .order("published_date", { ascending: false, nullsFirst: false })
      .limit(5),
    supabase
      .from("contact_messages")
      .select("id, name, email, subject, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("newsletter_signups")
      .select("id, email, source, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  return {
    totals: {
      products: productsCount ?? 0,
      branches: branchesCount ?? 0,
      publishedArticles: articlesPublishedCount ?? 0,
      draftArticles: articlesDraftCount ?? 0,
      newsletterSubscribers: newsletterCount ?? 0,
      unsubscribed: unsubscribedCount ?? 0,
      newMessages: newMessagesCount ?? 0,
      totalMessages: totalMessagesCount ?? 0,
      mediaAssets: mediaAssetsCount ?? 0,
      navigationItems: navigationItemsCount ?? 0,
      homepageSections: homepageSectionsCount ?? 0,
      siteSettings: siteSettingsCount ?? 0,
      aboutSections: aboutSectionsCount ?? 0,
      contactPageSettings: contactPageSettingsCount ?? 0,
    },
    products: ((productsQuery.data as ProductOverviewRow[] | null) ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      category: item.category,
      price: Number(item.price ?? 0),
      isFeatured: Boolean(item.is_featured),
    })),
    branches: ((branchesQuery.data as BranchOverviewRow[] | null) ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      area: item.area,
      hours: item.hours ?? "-",
    })),
    articles: ((articlesQuery.data as ArticleOverviewRow[] | null) ?? []).map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      status: item.status,
      publishedDate: item.published_date,
      isFeatured: Boolean(item.is_featured),
    })),
    messages: ((messagesQuery.data as ContactMessageOverviewRow[] | null) ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      email: item.email,
      subject: item.subject ?? "Tanpa subjek",
      status: item.status,
      createdAt: item.created_at,
    })),
    signups: ((newsletterQuery.data as NewsletterOverviewRow[] | null) ?? []).map((item) => ({
      id: item.id,
      email: item.email,
      source: item.source ?? "-",
      status: item.status,
      createdAt: item.created_at,
    })),
  };
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-[24px] border border-slate-200/80 bg-white p-5 shadow-[0_10px_28px_-24px_rgba(15,23,42,0.25)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-[2rem] font-extrabold tracking-[-0.05em] text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-500">{note}</p>
        </div>
        <div className="rounded-2xl bg-[#eef3ff] p-3 text-[#3458f5]">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

function SectionCard({
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children: ReactNode;
}) {
  return (
    <article className="rounded-[28px] border border-slate-200/80 bg-white p-6 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.22)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-[1.2rem] font-bold tracking-[-0.03em] text-slate-950">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        {actionLabel && actionHref ? (
          <Link
            href={actionHref}
            className="inline-flex items-center rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
      <div className="mt-6">{children}</div>
    </article>
  );
}

export default async function AdminOverviewPage() {
  const { totals, products, branches, articles, messages, signups } = await getDashboardData();

  const moduleCounts: Record<string, { count: number; note: string }> = {
    "site-settings": {
      count: totals.siteSettings,
      note: totals.siteSettings > 0 ? "Konfigurasi brand sudah tersedia." : "Belum ada konfigurasi.",
    },
    homepage: {
      count: totals.homepageSections,
      note: "Blok homepage yang sudah tersimpan.",
    },
    products: {
      count: totals.products,
      note: "Produk aktif dalam katalog publik.",
    },
    store: {
      count: totals.branches,
      note: "Store aktif yang bisa dilihat visitor.",
    },
    articles: {
      count: totals.publishedArticles + totals.draftArticles,
      note: `${formatCompactNumber(totals.publishedArticles)} published, ${formatCompactNumber(
        totals.draftArticles,
      )} draft.`,
    },
    "about-page": {
      count: totals.aboutSections,
      note: "Section tentang kami yang sudah terisi.",
    },
    "contact-page": {
      count: totals.contactPageSettings,
      note: "Konfigurasi halaman kontak yang tersimpan.",
    },
    newsletter: {
      count: totals.newsletterSubscribers,
      note: "Subscriber aktif dari seluruh form.",
    },
    "contact-messages": {
      count: totals.totalMessages,
      note: `${formatCompactNumber(totals.newMessages)} pesan perlu follow-up.`,
    },
    navigation: {
      count: totals.navigationItems,
      note: "Item navigasi untuk navbar dan footer.",
    },
    "media-library": {
      count: totals.mediaAssets,
      note: "Asset gambar di media library.",
    },
  };

  const activeModules = Object.values(moduleCounts).filter((item) => item.count > 0).length;
  const emptyModules = Object.values(moduleCounts).filter((item) => item.count === 0).length;
  const completionPercent = Math.round((activeModules / adminSections.length) * 100);

  const summaryCards = [
    {
      label: "Produk Aktif",
      value: formatCompactNumber(totals.products),
      note: "Produk yang sudah aktif dan tampil di katalog publik.",
      icon: GalleryVerticalEnd,
    },
    {
      label: "Store Aktif",
      value: formatCompactNumber(totals.branches),
      note: "Store yang sedang aktif di halaman lokasi Kembunk.",
      icon: MapPinned,
    },
    {
      label: "Artikel Published",
      value: formatCompactNumber(totals.publishedArticles),
      note: `${formatCompactNumber(totals.draftArticles)} artikel masih berstatus draft.`,
      icon: BookOpenText,
    },
    {
      label: "Subscriber Newsletter",
      value: formatCompactNumber(totals.newsletterSubscribers),
      note: `${formatCompactNumber(totals.unsubscribed)} kontak sudah unsubscribe.`,
      icon: Mail,
    },
    {
      label: "Pesan Baru",
      value: formatCompactNumber(totals.newMessages),
      note: `${formatCompactNumber(totals.totalMessages)} total pesan masuk tersimpan.`,
      icon: MessageSquareMore,
    },
    {
      label: "Media Library",
      value: formatCompactNumber(totals.mediaAssets),
      note: "Total asset gambar yang sudah tersimpan di dashboard.",
      icon: LayoutList,
    },
  ];

  const priorityItems = [
    {
      label: "Pesan baru perlu dibalas",
      value: formatCompactNumber(totals.newMessages),
      href: "/admin/contact-messages",
      valueClass: "text-[#3458f5]",
    },
    {
      label: "Artikel draft menunggu publish",
      value: formatCompactNumber(totals.draftArticles),
      href: "/admin/articles",
      valueClass: "text-amber-600",
    },
    {
      label: "Subscriber aktif newsletter",
      value: formatCompactNumber(totals.newsletterSubscribers),
      href: "/admin/newsletter",
      valueClass: "text-emerald-700",
    },
    {
      label: "Item navigasi tersimpan",
      value: formatCompactNumber(totals.navigationItems),
      href: "/admin/navigation",
      valueClass: "text-slate-900",
    },
  ];

  const contentFlowItems = [
    {
      label: "Draft artikel",
      value: formatCompactNumber(totals.draftArticles),
      helper: "siap ditinjau atau dipublish",
      href: "/admin/articles",
    },
    {
      label: "Pesan baru",
      value: formatCompactNumber(totals.newMessages),
      helper: "perlu follow-up dari tim admin",
      href: "/admin/contact-messages",
    },
    {
      label: "Subscriber aktif",
      value: formatCompactNumber(totals.newsletterSubscribers),
      helper: "lead tersimpan dari seluruh form",
      href: "/admin/newsletter",
    },
    {
      label: "Modul kosong",
      value: formatCompactNumber(emptyModules),
      helper: "bagian CMS yang masih perlu dilengkapi",
      href: "/admin/site-settings",
    },
  ];

  const managementReadinessItems = [
    {
      label: "Konten publik",
      value:
        totals.products + totals.publishedArticles + totals.branches > 0
          ? Math.min(
              100,
              Math.round(
                ((totals.products + totals.publishedArticles + totals.branches) / Math.max(3, 12)) *
                  100,
              ),
            )
          : 0,
      note: "Produk, artikel published, dan store aktif yang sudah tayang.",
    },
    {
      label: "Lead management",
      value:
        totals.newsletterSubscribers + totals.totalMessages > 0
          ? Math.min(
              100,
              Math.round(
                ((totals.newsletterSubscribers +
                  Math.max(totals.totalMessages - totals.newMessages, 0)) /
                  Math.max(1, totals.newsletterSubscribers + totals.totalMessages)) *
                  100,
              ),
            )
          : 0,
      note: "Subscriber tersimpan dan pesan yang sudah melewati status baru.",
    },
    {
      label: "Struktur CMS",
      value:
        [totals.siteSettings, totals.homepageSections, totals.aboutSections, totals.contactPageSettings]
          .filter((item) => item > 0).length * 25,
      note: "Kelengkapan fondasi halaman inti dan pengaturan website.",
    },
  ];

  return (
    <section className="space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#ebf1ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-[#3458f5]">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Management Overview
        </div>
        <div>
          <h1 className="text-[2.25rem] font-extrabold tracking-[-0.05em] text-slate-950">
            Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-slate-500">
            Ringkasan ini menampilkan rekap data yang benar-benar sudah masuk ke sistem Kembunk:
            produk, store, artikel, subscriber, pesan kontak, dan modul admin lain yang sudah
            terisi.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <article className="col-span-12 rounded-[30px] border border-slate-200/80 bg-[linear-gradient(135deg,#ffffff_0%,#f6f8fd_100%)] p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.28)] xl:col-span-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#3458f5]">
                Fokus Hari Ini
              </p>
              <h2 className="mt-3 text-[2rem] font-extrabold tracking-[-0.05em] text-slate-950">
                Workspace management untuk monitor konten, lead, dan kesiapan modul.
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-slate-500">
                Semua blok di dashboard ini diambil dari data admin yang sudah terisi. Jadi tim bisa
                langsung melihat mana yang siap tayang, mana yang perlu tindak lanjut, dan mana yang
                masih butuh dilengkapi.
              </p>
            </div>

            <div className="grid min-w-[260px] grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {contentFlowItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-[22px] border border-slate-200/80 bg-white/90 px-4 py-4 transition-colors hover:bg-white"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-[1.8rem] font-extrabold tracking-[-0.05em] text-slate-950">
                    {item.value}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.helper}</p>
                </Link>
              ))}
            </div>
          </div>
        </article>

        <article className="col-span-12 rounded-[30px] border border-slate-200/80 bg-white p-6 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.28)] xl:col-span-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-400">
                Kesiapan Sistem
              </p>
              <h2 className="mt-2 text-[1.35rem] font-bold tracking-[-0.03em] text-slate-950">
                Rekap operasional admin
              </h2>
            </div>
            <div className="rounded-full bg-[#eef3ff] px-3 py-2 text-sm font-bold text-[#3458f5]">
              {completionPercent}%
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#3458f5_0%,#6e82ff_100%)]"
              style={{ width: `${completionPercent}%` }}
            />
          </div>

          <div className="mt-6 space-y-4">
            {managementReadinessItems.map((item) => (
              <div key={item.label} className="rounded-[20px] bg-slate-50/80 px-4 py-4">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                  <span className="text-lg font-extrabold tracking-[-0.04em] text-[#334f2b]">
                    {item.value}%
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[20px] border border-dashed border-slate-200 bg-slate-50/70 px-4 py-4">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Perlu perhatian
            </p>
            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-sm font-semibold text-slate-950">Modul yang belum terisi</p>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  emptyModules > 0 ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {emptyModules > 0 ? `${emptyModules} modul` : "Semua terisi"}
              </span>
            </div>
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {summaryCards.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            note={item.note}
            icon={item.icon}
          />
        ))}
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8">
          <SectionCard
            title="Rekap Tiap Fitur"
            description="Setiap modul di bawah ini mengambil jumlah data yang sudah tersimpan, supaya admin bisa langsung melihat area mana yang sudah terisi dan area mana yang masih perlu dilanjutkan."
            actionLabel="Kelola modul"
            actionHref="/admin/products"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {adminSections.map((section) => {
                const details = moduleCounts[section.slug] ?? { count: 0, note: section.description };
                const tone = getModuleTone(details.count);

                return (
                  <Link
                    key={section.slug}
                    href={`/admin/${section.slug}`}
                    className={`group rounded-[22px] border p-5 transition-all hover:-translate-y-0.5 ${tone.cardClass}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className={`rounded-2xl p-3 shadow-sm transition-colors ${tone.iconClass}`}>
                        <section.icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${tone.badgeClass}`}>
                        {formatCompactNumber(details.count)}
                      </span>
                    </div>
                    <h3 className="mt-4 text-base font-bold text-slate-950">{section.label}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{details.note}</p>
                    <div className="mt-4">
                      <span className={`rounded-full px-3 py-1 text-[11px] font-bold ${tone.statusClass}`}>
                        {tone.statusLabel}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12 lg:col-span-4">
          <SectionCard
            title="Prioritas Admin"
            description="Panel cepat untuk memantau hal-hal yang paling sering butuh tindakan di dashboard management."
          >
            <div className="space-y-3">
              {priorityItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center justify-between rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-4 transition-colors hover:bg-white"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                    <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                      langsung buka modul
                    </p>
                  </div>
                  <span className={`text-[1.6rem] font-extrabold tracking-[-0.05em] ${item.valueClass}`}>
                    {item.value}
                  </span>
                </Link>
              ))}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-4">
          <SectionCard
            title="Produk Aktif"
            description="Ringkasan katalog yang saat ini aktif di website."
            actionLabel="Buka Products"
            actionHref="/admin/products"
          >
            <div className="space-y-3">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-slate-950">{product.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {product.category}
                        </p>
                      </div>
                      {product.isFeatured ? (
                        <span className="rounded-full bg-[#eef3ff] px-3 py-1 text-[11px] font-bold text-[#3458f5]">
                          Featured
                        </span>
                      ) : null}
                    </div>
                    <p className="mt-4 text-lg font-bold text-[#334f2b]">
                      {formatRupiah(product.price)}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-amber-200 bg-amber-50/60 px-4 py-5 text-sm text-amber-700">
                  Belum ada produk aktif yang bisa direkap.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <SectionCard
            title="Artikel Terbaru"
            description="Artikel terbaru dari modul SEO dan content marketing."
            actionLabel="Buka Articles"
            actionHref="/admin/articles"
          >
            <div className="space-y-3">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div
                    key={article.id}
                    className="rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-bold leading-6 text-slate-950">
                          {truncate(article.title, 60)}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-slate-400">
                          {article.category}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-[11px] font-bold ${
                          article.status === "published"
                            ? "bg-[#eefbf1] text-[#24643b]"
                            : "bg-[#fff4e6] text-[#9a5a09] ring-1 ring-amber-200"
                        }`}
                      >
                        {getStatusLabel(article.status)}
                      </span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4 text-sm text-slate-500">
                      <span>{formatDate(article.publishedDate)}</span>
                      {article.isFeatured ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-[#3458f5]">
                          <PenSquare className="h-4 w-4" aria-hidden="true" />
                          Featured
                        </span>
                      ) : null}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-amber-200 bg-amber-50/60 px-4 py-5 text-sm text-amber-700">
                  Belum ada artikel yang tersimpan.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <SectionCard
            title="Store Aktif"
            description="Store yang saat ini ditampilkan di halaman lokasi."
            actionLabel="Buka Store"
            actionHref="/admin/store"
          >
            <div className="space-y-3">
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="rounded-[20px] border border-slate-200/80 bg-slate-50/70 px-4 py-4"
                  >
                    <p className="text-base font-bold text-slate-950">{branch.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{branch.area}</p>
                    <p className="mt-3 text-sm font-medium text-slate-600">
                      Jam operasional: {branch.hours}
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-amber-200 bg-amber-50/60 px-4 py-5 text-sm text-amber-700">
                  Belum ada store aktif yang bisa ditampilkan.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-6">
          <SectionCard
            title="Pesan Kontak Terbaru"
            description="Inbox terbaru dari form hubungi kami untuk kebutuhan follow-up."
            actionLabel="Buka Contact Messages"
            actionHref="/admin/contact-messages"
          >
            <div className="space-y-3">
              {messages.length > 0 ? (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`rounded-[20px] border px-4 py-4 ${
                      message.status === "new"
                        ? "border-[#c8d5ff] bg-[#eef3ff]/70"
                        : "border-slate-200/80 bg-slate-50/70"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-slate-950">{message.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{message.email}</p>
                        <p className="mt-3 text-sm font-medium text-slate-700">
                          Subjek: {truncate(message.subject, 72)}
                        </p>
                      </div>
                      <div className="text-left md:text-right">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                            message.status === "new"
                              ? "bg-[#dce6ff] text-[#3458f5] ring-1 ring-[#c8d5ff]"
                              : message.status === "read"
                                ? "bg-slate-200/80 text-slate-700"
                                : message.status === "replied"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {getStatusLabel(message.status)}
                        </span>
                        <p className="mt-3 text-sm text-slate-500">{formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-amber-200 bg-amber-50/60 px-4 py-5 text-sm text-amber-700">
                  Belum ada pesan kontak yang masuk.
                </div>
              )}
            </div>
          </SectionCard>
        </div>

        <div className="col-span-12 xl:col-span-6">
          <SectionCard
            title="Subscriber Terbaru"
            description="Daftar subscriber newsletter yang terakhir masuk dari form publik."
            actionLabel="Buka Newsletter"
            actionHref="/admin/newsletter"
          >
            <div className="space-y-3">
              {signups.length > 0 ? (
                signups.map((signup) => (
                  <div
                    key={signup.id}
                    className={`rounded-[20px] border px-4 py-4 ${
                      signup.status === "unsubscribed"
                        ? "border-amber-200 bg-amber-50/60"
                        : "border-slate-200/80 bg-slate-50/70"
                    }`}
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-slate-950">{signup.email}</p>
                        <p className="mt-1 text-sm text-slate-500">Source: {signup.source}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold ${
                            signup.status === "subscribed"
                              ? "bg-[#eefbf1] text-[#24643b]"
                              : "bg-[#fff4e6] text-[#9a5a09] ring-1 ring-amber-200"
                          }`}
                        >
                          {getStatusLabel(signup.status)}
                        </span>
                        <p className="mt-3 text-sm text-slate-500">{formatDate(signup.createdAt)}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[20px] border border-dashed border-amber-200 bg-amber-50/60 px-4 py-5 text-sm text-amber-700">
                  Belum ada subscriber yang masuk.
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </section>
  );
}
