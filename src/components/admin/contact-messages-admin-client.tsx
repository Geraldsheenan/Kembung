"use client";

import { useMemo, useState } from "react";
import {
  AdminFlashMessage,
  AdminInputClassName,
  AdminPrimaryButton,
  AdminSurface,
  AdminTextareaClassName,
} from "./admin-workspace";

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
  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

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
      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <AdminSurface className="grid gap-3 p-4 md:grid-cols-2">
        <input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Cari nama, email, source"
          className={inputClassName}
        />
        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value as "all" | ContactMessageRecord["status"])
          }
          className={inputClassName}
        >
          <option value="all">Semua status</option>
          <option value="new">new</option>
          <option value="read">read</option>
          <option value="replied">replied</option>
          <option value="archived">archived</option>
        </select>
      </AdminSurface>

      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <AdminSurface
              key={item.id}
              className="p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-[1.45rem] font-extrabold tracking-[-0.04em] text-[#18202b]">
                    {item.name}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {item.email} - {item.source} - {dateFormatter.format(new Date(item.createdAt))}
                  </p>
                  {item.subject ? (
                    <p className="mt-2 text-sm font-semibold text-[#3f6b49]">
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
                    className="rounded-full border border-slate-200 bg-[#f7f8fa] px-4 py-2 text-sm text-slate-700 focus:outline-none"
                  >
                    <option value="new">new</option>
                    <option value="read">read</option>
                    <option value="replied">replied</option>
                    <option value="archived">archived</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => deleteMessage(item.id)}
                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>

              <div className="mt-5 rounded-[1.5rem] bg-[#f4f3ee] px-5 py-4 text-sm leading-7 text-slate-600">
                {item.message}
              </div>

              <div className="mt-5 space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">
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
                  className={textareaClassName}
                />
              </div>

              <div className="mt-4">
                <AdminPrimaryButton onClick={() => saveMessage(item)} className="px-5 py-3">
                  Simpan Update
                </AdminPrimaryButton>
              </div>
            </AdminSurface>
          ))
        ) : (
          <AdminSurface className="px-6 py-8 text-center text-sm text-slate-500">
            Tidak ada pesan yang cocok dengan filter.
          </AdminSurface>
        )}
      </div>
    </div>
  );
}
