import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { ContactPageAdminClient } from "@/components/admin/contact-page-admin-client";
import { AdminSurface } from "@/components/admin/admin-workspace";
import { getContactPageSettings } from "@/lib/content/contact-page-content";

export default async function AdminContactPagePage() {
  const contactPage = await getContactPageSettings();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="CRUD Module"
        title="Contact Page"
        description="Modul ini mengatur konten lengkap halaman Hubungi Kami, mulai dari alamat, telepon, email, website, sosial media, jam operasional, isi form, sampai kalimat penutup."
      />

      <AdminSurface className="p-8">
        <ContactPageAdminClient initialValue={contactPage} />
      </AdminSurface>
    </section>
  );
}
