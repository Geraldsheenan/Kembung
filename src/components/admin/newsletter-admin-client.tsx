"use client";

import { useMemo, useState } from "react";

type NewsletterRecord = {
  id: string;
  email: string;
  source: string;
  status: "subscribed" | "unsubscribed";
  createdAt: string;
};

type NewsletterAdminClientProps = {
  initialSignups: NewsletterRecord[];
};

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function NewsletterAdminClient({
  initialSignups,
}: NewsletterAdminClientProps) {
  const [items, setItems] = useState(initialSignups);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NewsletterRecord["status"]>("all");
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.email, item.source].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [items, searchQuery, statusFilter]);

  async function updateStatus(id: string, status: NewsletterRecord["status"]) {
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Status newsletter belum berhasil diubah.");
      return;
    }

    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, status } : item)),
    );
    setMessage(result.message ?? "Status newsletter berhasil diubah.");
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Hapus subscriber ini?");
    if (!confirmed) {
      return;
    }

    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/newsletter?id=${id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Subscriber belum berhasil dihapus.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== id));
    setMessage(result.message ?? "Subscriber berhasil dihapus.");
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
          placeholder="Cari email atau source"
          className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | NewsletterRecord["status"])
          }
          className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">Semua status</option>
          <option value="subscribed">subscribed</option>
          <option value="unsubscribed">unsubscribed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[var(--surface-container-low)] text-sm text-[var(--on-surface-variant)]">
              <tr>
                <th className="px-5 py-4 font-semibold">Email</th>
                <th className="px-5 py-4 font-semibold">Source</th>
                <th className="px-5 py-4 font-semibold">Created</th>
                <th className="px-5 py-4 font-semibold">Status</th>
                <th className="px-5 py-4 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-[var(--outline-variant)]/20">
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--on-surface)]">
                      {item.email}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--on-surface-variant)]">
                      {item.source}
                    </td>
                    <td className="px-5 py-4 text-sm text-[var(--on-surface-variant)]">
                      {dateFormatter.format(new Date(item.createdAt))}
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={item.status}
                        onChange={(event) =>
                          updateStatus(
                            item.id,
                            event.target.value as NewsletterRecord["status"],
                          )
                        }
                        className="rounded-full border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-2 text-sm focus:outline-none"
                      >
                        <option value="subscribed">subscribed</option>
                        <option value="unsubscribed">unsubscribed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-sm text-[var(--on-surface-variant)]"
                  >
                    Tidak ada subscriber yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
