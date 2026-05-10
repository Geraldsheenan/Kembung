import Link from "next/link";
import { adminSections } from "@/components/admin/admin-shell";
import { getSupabaseServerClient } from "@/lib/supabase/server";

async function getOverviewMetrics() {
  const supabase = await getSupabaseServerClient();

  const [
    { count: productsCount },
    { count: branchesCount },
    { count: articlesCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("branches").select("*", { count: "exact", head: true }),
    supabase
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("status", "published"),
  ]);

  return [
    {
      label: "Produk aktif",
      value: String(productsCount ?? 0),
      tone: "bg-[var(--primary-container)]/45 text-[var(--primary)]",
    },
    {
      label: "Cabang aktif",
      value: String(branchesCount ?? 0),
      tone: "bg-[var(--secondary-container)] text-[var(--on-secondary-container)]",
    },
    {
      label: "Artikel published",
      value: String(articlesCount ?? 0),
      tone: "bg-[var(--tertiary-container)] text-[var(--on-tertiary-container)]",
    },
  ];
}

export default async function AdminOverviewPage() {
  const metrics = await getOverviewMetrics();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Supabase Connected
        </p>
        <h2 className="mt-4 text-[2.8rem] font-extrabold leading-tight tracking-[-0.05em] text-[var(--primary)]">
          Fondasi admin Kembung sudah siap dipakai lanjut.
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Area admin ini sengaja dimulai dari kerangka yang ringan: helper Supabase,
          API form yang sudah pindah dari SQLite, dan jalur menu yang cocok dengan struktur
          data website saat ini.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="rounded-[1.75rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]"
          >
            <div className={`inline-flex rounded-full px-4 py-2 text-sm font-semibold ${metric.tone}`}>
              {metric.label}
            </div>
            <p className="mt-6 text-[3rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--on-surface)]">
              {metric.value}
            </p>
          </article>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
        <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
          <h3 className="text-2xl font-bold text-[var(--on-surface)]">Modul Dashboard</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {adminSections.map((section) => (
              <Link
                key={section.slug}
                href={`/admin/${section.slug}`}
                className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-5 transition-transform duration-200 hover:-translate-y-1"
              >
                <p className="text-lg font-semibold text-[var(--on-surface)]">
                  {section.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--on-surface-variant)]">
                  {section.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="rounded-[2rem] bg-[var(--primary-container)]/35 p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
            Status Implementasi
          </p>
          <div className="mt-6 space-y-4">
            {[
              "Supabase env sudah terbaca dari project.",
              "Route API newsletter dan contact_messages sudah pindah dari SQLite.",
              "Struktur /admin sudah dipisah dari shell publik.",
              "CRUD detail per modul siap dikerjakan bertahap berikutnya.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-[1.25rem] bg-white px-4 py-4 text-sm leading-7 text-[var(--on-surface-variant)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

