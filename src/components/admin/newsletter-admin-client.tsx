"use client";

import { useMemo, useState } from "react";
import {
  AdminFlashMessage,
  AdminInputClassName,
  AdminSurface,
} from "./admin-workspace";

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
  const inputClassName = AdminInputClassName();

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
      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <AdminSurface className="grid gap-3 p-4 md:grid-cols-2">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari email atau source"
          className={inputClassName}
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | NewsletterRecord["status"])
          }
          className={inputClassName}
        >
          <option value="all">Semua status</option>
          <option value="subscribed">subscribed</option>
          <option value="unsubscribed">unsubscribed</option>
        </select>
      </AdminSurface>

      <AdminSurface className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left">
            <thead className="bg-[#f4f6f8] text-sm text-slate-500">
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
                  <tr key={item.id} className="border-t border-slate-200/80">
                    <td className="px-5 py-4 text-sm font-semibold text-[#18202b]">
                      {item.email}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {item.source}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
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
                        className="rounded-full border border-slate-200 bg-[#f3f4f0] px-4 py-2 text-sm text-slate-700 focus:outline-none"
                      >
                        <option value="subscribed">subscribed</option>
                        <option value="unsubscribed">unsubscribed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
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
                    className="px-5 py-8 text-center text-sm text-slate-500"
                  >
                    Tidak ada subscriber yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </AdminSurface>
    </div>
  );
}
