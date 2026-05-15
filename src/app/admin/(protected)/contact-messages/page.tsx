import { ContactMessagesAdminClient } from "@/components/admin/contact-messages-admin-client";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type ContactMessageRow = {
  id: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  source: string | null;
  status: "new" | "read" | "replied" | "archived";
  admin_note: string | null;
  created_at: string;
};

async function getContactMessages() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return ((data as ContactMessageRow[] | null) ?? []).map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    subject: item.subject ?? "",
    message: item.message,
    source: item.source ?? "-",
    status: item.status,
    adminNote: item.admin_note ?? "",
    createdAt: item.created_at,
  }));
}

export default async function AdminContactMessagesPage() {
  const messages = await getContactMessages();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="Dashboard Foundation"
        title="Contact Messages"
        description="Inbox pesan masuk dari halaman kontak. Kamu bisa ubah status follow-up, simpan catatan internal, dan hapus spam dari sini."
      />

      <ContactMessagesAdminClient initialMessages={messages} />
    </section>
  );
}
