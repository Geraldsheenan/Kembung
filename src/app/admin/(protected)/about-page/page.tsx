import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { AboutPageAdminClient } from "@/components/admin/about-page-admin-client";
import { AdminSurface } from "@/components/admin/admin-workspace";
import { getAboutPageContent, getAboutPagePrefill } from "@/lib/content/about-content";

export default async function AdminAboutPagePage() {
  const about = await getAboutPageContent();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="CRUD Module"
        title="About Page"
        description="Modul ini mengatur story section, mission block, value cards, dan final section yang muncul di halaman Tentang Kami."
      />

      <AdminSurface className="p-8">
        <AboutPageAdminClient initialValue={getAboutPagePrefill(about)} />
      </AdminSurface>
    </section>
  );
}
