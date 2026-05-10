import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { getPublicSiteSettings } from "@/lib/content/site-content";

export default async function AdminSiteSettingsPage() {
  const siteSettings = await getPublicSiteSettings();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Singleton Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Site Settings
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Modul ini sekarang sudah terhubung ke shell publik. Perubahan nomor WhatsApp,
          social link, dan identitas brand akan langsung mempengaruhi layout situs.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <SiteSettingsForm initialValues={siteSettings} />
      </div>
    </section>
  );
}

