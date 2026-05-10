import { ContactPageAdminClient } from "@/components/admin/contact-page-admin-client";
import { getContactPageSettings } from "@/lib/content/contact-page-content";

export default async function AdminContactPagePage() {
  const contactPage = await getContactPageSettings();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          CRUD Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Contact Page
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Modul ini mengatur konten lengkap halaman Hubungi Kami, mulai dari alamat,
          telepon, email, website, sosial media, jam operasional, isi form, sampai
          kalimat penutup.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <ContactPageAdminClient initialValue={contactPage} />
      </div>
    </section>
  );
}
