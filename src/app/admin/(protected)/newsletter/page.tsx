import { NewsletterAdminClient } from "@/components/admin/newsletter-admin-client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type NewsletterRow = {
  id: string;
  email: string;
  source: string | null;
  status: "subscribed" | "unsubscribed";
  created_at: string;
};

async function getNewsletterSignups() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("newsletter_signups")
    .select("id, email, source, status, created_at")
    .order("created_at", { ascending: false });

  return ((data as NewsletterRow[] | null) ?? []).map((item) => ({
    id: item.id,
    email: item.email,
    source: item.source ?? "-",
    status: item.status,
    createdAt: item.created_at,
  }));
}

export default async function AdminNewsletterPage() {
  const signups = await getNewsletterSignups();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Inbox Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Newsletter
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Lihat subscriber yang masuk dari seluruh form newsletter, ubah status subscribe,
          dan bersihkan data yang tidak diperlukan.
        </p>
      </div>

      <NewsletterAdminClient initialSignups={signups} />
    </section>
  );
}
