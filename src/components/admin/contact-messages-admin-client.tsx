"use client";

import { useMemo, useState } from "react";

type ContactMessageRecord = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  status: "new" | "read" | "replied" | "archived";
  adminNote: string;
  createdAt: string;
};

type ContactMessagesAdminClientProps = {
  initialMessages: ContactMessageRecord[];
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function ContactMessagesAdminClient({
  initialMessages,
}: ContactMessagesAdminClientProps) {
  const [items, setItems] = useState(initialMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | ContactMessageRecord["status"]
  >("all");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.name, item.email, item.subject, item.source, item.message]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  async function saveMessage(item: ContactMessageRecord) {
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/contact-messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: item.id,
        status: item.status,
        adminNote: item.adminNote,
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Pesan belum berhasil diperbarui.");
      return;
    }

    setMessage(result.message ?? "Pesan berhasil diperbarui.");
  }

  async function deleteMessage(id: string) {
    const confirmed = window.confirm("Hapus pesan ini?");
    if (!confirmed) {
      return;
    }

    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/contact-messages?id=${id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Pesan belum berhasil dihapus.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    setMessage(result.message ?? "Pesan berhasil dihapus.");
  }

  return (
    <div className="space-y-6">
      {message ? (
        <div className="rounded-[1.25rem] bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {errorMessage ? (
        <div className="rounded-[1.25rem] bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari nama, email, source"
          className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | ContactMessageRecord["status"])
          }
          className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">Semua status</option>
          <option value="new">new</option>
          <option value="read">read</option>
          <option value="replied">replied</option>
          <option value="archived">archived</option>
        </select>
      </div>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <article
              key={item.id}
              className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[var(--on-surface)]">{item.name}</h3>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    {item.email} - {item.source} - {dateFormatter.format(new Date(item.createdAt))}
                  </p>
                  {item.subject ? (
                    <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                      Subjek: {item.subject}
                    </p>
                  ) : null}
                </div>

                <div className="flex gap-3">
                  <select
                    value={item.status}
                    onChange={(event) =>
                      setItems((current) =>
                        current.map((currentItem) =>
                          currentItem.id === item.id
                            ? {
                                ...currentItem,
                                status: event.target.value as ContactMessageRecord["status"],
                              }
                            : currentItem,
                        ),
                      )
                    }
                    className="rounded-full border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-2 text-sm focus:outline-none"
                  >
                    <option value="new">new</option>
                    <option value="read">read</option>
                    <option value="replied">replied</option>
                    <option value="archived">archived</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteMessage(item.id)}
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4 text-sm leading-7 text-[var(--on-surface-variant)]">
                {item.message}
              </div>

              <div className="mt-5 space-y-2">
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                  Admin Note
                </label>
                <textarea
                  rows={3}
                  value={item.adminNote}
                  onChange={(event) =>
                    setItems((current) =>
                      current.map((currentItem) =>
                        currentItem.id === item.id
                          ? { ...currentItem, adminNote: event.target.value }
                          : currentItem,
                      ),
                    )
                  }
                  className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => saveMessage(item)}
                  className="rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--on-primary)]"
                >
                  Simpan Update
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[2rem] bg-white px-6 py-8 text-center text-sm text-[var(--on-surface-variant)] shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
            Tidak ada pesan yang cocok dengan filter.
          </div>
        )}
      </div>
    </div>
  );
}
