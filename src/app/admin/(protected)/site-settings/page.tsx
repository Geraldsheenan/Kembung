import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { SiteSettingsForm } from "@/components/admin/site-settings-form";
import { AdminSurface } from "@/components/admin/admin-workspace";
import { getPublicSiteSettings } from "@/lib/content/site-content";

export default async function AdminSiteSettingsPage() {
  const siteSettings = await getPublicSiteSettings();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="Singleton Module"
        title="Site Settings"
        description="Modul ini sekarang sudah terhubung ke shell publik. Perubahan nomor WhatsApp, social link, dan identitas brand akan langsung mempengaruhi layout situs."
      />

      <AdminSurface className="p-8">
        <SiteSettingsForm initialValues={siteSettings} />
      </AdminSurface>
    </section>
  );
}
