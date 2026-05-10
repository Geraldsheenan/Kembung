import { ContactMessagesAdminClient } from "@/components/admin/contact-messages-admin-client";
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
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          Inbox Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Contact Messages
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Inbox pesan masuk dari halaman kontak. Kamu bisa ubah status follow-up, simpan
          catatan internal, dan hapus spam dari sini.
        </p>
      </div>

      <ContactMessagesAdminClient initialMessages={messages} />
    </section>
  );
}
