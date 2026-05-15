"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import {
  AdminCanvasPanel,
  AdminCreateDialog,
  AdminDangerButton,
  AdminFlashMessage,
  AdminGhostButton,
  AdminInputClassName,
  AdminPanelHeading,
  AdminPrimaryButton,
  AdminSidebarPanel,
  AdminWorkspaceShell,
} from "./admin-workspace";

type NavigationEditorRecord = {
  id?: string;
  label: string;
  href: string;
  location: "navbar" | "footer_help" | "footer_social";
  sortOrder: number;
  isActive: boolean;
};

type NavigationAdminClientProps = {
  initialItems: NavigationEditorRecord[];
};

function emptyItem(): NavigationEditorRecord {
  return {
    label: "",
    href: "",
    location: "navbar",
    sortOrder: 0,
    isActive: true,
  };
}

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export function NavigationAdminClient({
  initialItems,
}: NavigationAdminClientProps) {
  const [items, setItems] = useState(initialItems);
  const [selectedId, setSelectedId] = useState<string | "new">(
    initialItems[0]?.id ?? "new",
  );
  const [draft, setDraft] = useState<NavigationEditorRecord>(
    initialItems[0] ?? emptyItem(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<
    "all" | "navbar" | "footer_help" | "footer_social"
  >("all");
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    label: "",
    href: "",
    location: "navbar" as NavigationEditorRecord["location"],
  });

  const inputClassName = AdminInputClassName();

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [item.label, item.href, item.location].join(" ").toLowerCase().includes(normalizedQuery);
      const matchesLocation = locationFilter === "all" || item.location === locationFilter;

      return matchesQuery && matchesLocation;
    });
  }, [items, searchQuery, locationFilter]);

  function selectItem(nextItem: NavigationEditorRecord | null) {
    if (!nextItem?.id) {
      setSelectedId("new");
      setDraft(emptyItem());
      return;
    }

    setSelectedId(nextItem.id);
    setDraft(nextItem);
  }

  function beginCreateItem() {
    setSelectedId("new");
    setDraft({
      ...emptyItem(),
      label: createDraft.label,
      href: createDraft.href,
      location: createDraft.location,
    });
    setMessage(null);
    setErrorMessage(null);
    setIsCreateModalOpen(false);
  }

  async function saveItem(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const result = (await response.json()) as { message?: string; id?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Item navigation belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    const nextItem = {
      ...draft,
      id: result.id ?? draft.id,
    };

    setItems((current) => {
      const exists = nextItem.id
        ? current.some((item) => item.id === nextItem.id)
        : false;

      if (!exists) {
        return [nextItem, ...current];
      }

      return current.map((item) => (item.id === nextItem.id ? nextItem : item));
    });

    if (nextItem.id) {
      setSelectedId(nextItem.id);
    }

    setDraft(nextItem);
    setMessage(result.message ?? "Navigation berhasil disimpan.");
    setIsSubmitting(false);
  }

  async function saveOrder(nextItems: NavigationEditorRecord[]) {
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/navigation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: nextItems.map((item, index) => ({
          id: item.id,
          sortOrder: index,
        })),
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Urutan navigation belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    setItems(nextItems.map((item, index) => ({ ...item, sortOrder: index })));
    setDraft((current) => {
      if (!current.id) {
        return current;
      }

      const nextCurrent = nextItems.find((item) => item.id === current.id);
      return nextCurrent ? { ...nextCurrent, sortOrder: nextItems.indexOf(nextCurrent) } : current;
    });
    setMessage(result.message ?? "Urutan navigation berhasil disimpan.");
    setIsSubmitting(false);
  }

  async function deleteItem() {
    if (!draft.id) {
      setDraft(emptyItem());
      setSelectedId("new");
      return;
    }

    const confirmed = window.confirm(`Hapus item ${draft.label || draft.href}?`);
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/navigation?id=${draft.id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Item navigation belum berhasil dihapus.");
      setIsSubmitting(false);
      return;
    }

    const nextItems = items.filter((item) => item.id !== draft.id);
    setItems(nextItems);
    selectItem(nextItems[0] ?? null);
    setMessage(result.message ?? "Navigation berhasil dihapus.");
    setIsSubmitting(false);
  }

  return (
    <>
      <AdminCreateDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Navigation Item"
        description="Buat item navigasi baru lewat popup dulu, lalu lanjutkan pengaturan posisi, status, dan urutan di canvas utama."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-slate-600">Label</label>
            <input
              value={createDraft.label}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  label: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </div>
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-slate-600">Href</label>
            <input
              value={createDraft.href}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  href: event.target.value,
                }))
              }
              className={inputClassName}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="ml-1 text-sm font-semibold text-slate-600">Location</label>
            <select
              value={createDraft.location}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  location: event.target.value as NavigationEditorRecord["location"],
                }))
              }
              className={inputClassName}
            >
              <option value="navbar">navbar</option>
              <option value="footer_help">footer_help</option>
              <option value="footer_social">footer_social</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <AdminGhostButton onClick={() => setIsCreateModalOpen(false)}>Batal</AdminGhostButton>
          <AdminPrimaryButton onClick={beginCreateItem}>Lanjutkan</AdminPrimaryButton>
        </div>
      </AdminCreateDialog>

      <AdminWorkspaceShell
        sidebar={
          <AdminSidebarPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Navigation Items</h3>
                <p className="mt-1 text-sm leading-7 text-slate-500">
                  {items.length > 0
                    ? `${items.length} item navigation ada di database.`
                    : "Belum ada item navigation di Supabase."}
                </p>
              </div>
              <AdminPrimaryButton onClick={() => setIsCreateModalOpen(true)}>
                Item Baru
              </AdminPrimaryButton>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari label atau href"
                className={inputClassName}
              />
              <select
                value={locationFilter}
                onChange={(event) =>
                  setLocationFilter(
                    event.target.value as "all" | "navbar" | "footer_help" | "footer_social",
                  )
                }
                className={inputClassName}
              >
                <option value="all">Semua lokasi</option>
                <option value="navbar">navbar</option>
                <option value="footer_help">footer_help</option>
                <option value="footer_social">footer_social</option>
              </select>
            </div>

            <div className="mt-4 rounded-[1.25rem] border border-slate-200 bg-[#f7f8fa] px-4 py-3 text-xs leading-6 text-slate-500">
              Drag-and-drop pada daftar di bawah untuk mengubah urutan, lalu klik `Simpan Urutan`.
            </div>

            <div className="mt-4">
              <AdminGhostButton disabled={isSubmitting} onClick={() => void saveOrder(items)}>
                Simpan Urutan
              </AdminGhostButton>
            </div>

            <div className="mt-6 space-y-3">
              {filteredItems.length > 0 ? (
                filteredItems.map((item) => {
                  const actualIndex = items.findIndex((current) => current.id === item.id);

                  return (
                    <button
                      key={item.id ?? `${item.location}-${item.href}`}
                      type="button"
                      draggable
                      onDragStart={() => setDraggedIndex(actualIndex)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (draggedIndex === null) {
                          return;
                        }

                        setItems((current) =>
                          moveItem(current, draggedIndex, actualIndex).map((entry, index) => ({
                            ...entry,
                            sortOrder: index,
                          })),
                        );
                        setDraggedIndex(null);
                      }}
                      onDragEnd={() => setDraggedIndex(null)}
                      onClick={() => selectItem(item)}
                      className={`block w-full rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                        selectedItem?.id === item.id
                          ? "border-[#c8d5ff] bg-[#eef3ff]"
                          : "border-slate-200 bg-[#f7f8fa]"
                      }`}
                    >
                      <span className="mb-2 inline-flex items-center gap-2 text-slate-500">
                        <span className="cursor-grab rounded-full bg-white p-2">
                          <GripVertical className="h-4 w-4" />
                        </span>
                        <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                          Drag
                        </span>
                      </span>
                      <p className="text-sm font-semibold text-slate-950">{item.label}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {item.location} - {item.href}
                      </p>
                    </button>
                  );
                })
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-700">
                  Tidak ada navigation item yang cocok dengan filter.
                </div>
              )}
            </div>
          </AdminSidebarPanel>
        }
      >
        <AdminCanvasPanel>
          <form onSubmit={saveItem} className="space-y-6">
            <AdminPanelHeading
              eyebrow="Navigation Editor"
              title={draft.label || "Item baru"}
              description="Editor navigation sekarang mengikuti bahasa visual dashboard overview agar pengelolaan link, lokasi, dan urutan terasa lebih bersih dan konsisten."
              action={<AdminDangerButton onClick={deleteItem}>Hapus</AdminDangerButton>}
            />

            {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}
            {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">Label</label>
                <input
                  value={draft.label}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      label: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">Href</label>
                <input
                  value={draft.href}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      href: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">Location</label>
                <select
                  value={draft.location}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      location: event.target.value as NavigationEditorRecord["location"],
                    }))
                  }
                  className={inputClassName}
                >
                  <option value="navbar">navbar</option>
                  <option value="footer_help">footer_help</option>
                  <option value="footer_social">footer_social</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">Sort Order</label>
                <input
                  type="number"
                  value={draft.sortOrder}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      sortOrder: Number(event.target.value),
                    }))
                  }
                  className={inputClassName}
                />
              </div>

              <label className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-[#f7f8fa] px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={draft.isActive}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      isActive: event.target.checked,
                    }))
                  }
                />
                Item aktif
              </label>
            </div>

            <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
              {isSubmitting ? "Menyimpan..." : "Simpan Navigation"}
            </AdminPrimaryButton>
          </form>
        </AdminCanvasPanel>
      </AdminWorkspaceShell>
    </>
  );
}
