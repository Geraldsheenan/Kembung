import { NewsletterAdminClient } from "@/components/admin/newsletter-admin-client";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
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
      <AdminPageIntro
        badge="Dashboard Foundation"
        title="Newsletter"
        description="Lihat subscriber yang masuk dari seluruh form newsletter, ubah status subscribe, dan bersihkan data yang tidak diperlukan."
      />

      <NewsletterAdminClient initialSignups={signups} />
    </section>
  );
}
