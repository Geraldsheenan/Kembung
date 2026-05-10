import { AboutPageAdminClient } from "@/components/admin/about-page-admin-client";
import { getAboutPageContent, getAboutPagePrefill } from "@/lib/content/about-content";

export default async function AdminAboutPagePage() {
  const about = await getAboutPageContent();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          CRUD Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          About Page
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Modul ini mengatur story section, mission block, value cards, dan final section
          yang muncul di halaman Tentang Kami.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <AboutPageAdminClient initialValue={getAboutPagePrefill(about)} />
      </div>
    </section>
  );
}
