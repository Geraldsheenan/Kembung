"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";

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
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--on-surface)]">Navigation Items</h3>
            <p className="mt-1 text-sm leading-7 text-[var(--on-surface-variant)]">
              {items.length > 0
                ? `${items.length} item navigation ada di database.`
                : "Belum ada item navigation di Supabase."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectItem(null)}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
          >
            Item Baru
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari label atau href"
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <select
            value={locationFilter}
            onChange={(event) =>
              setLocationFilter(
                event.target.value as "all" | "navbar" | "footer_help" | "footer_social",
              )
            }
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">Semua lokasi</option>
            <option value="navbar">navbar</option>
            <option value="footer_help">footer_help</option>
            <option value="footer_social">footer_social</option>
          </select>
        </div>

        <div className="mt-4 rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-3 text-xs leading-6 text-[var(--on-surface-variant)]">
          Drag-and-drop pada daftar di bawah untuk mengubah urutan, lalu klik `Simpan Urutan`.
        </div>

        <div className="mt-4">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void saveOrder(items)}
            className="rounded-full border border-[var(--outline-variant)]/30 px-4 py-2 text-sm font-semibold text-[var(--on-surface)] disabled:opacity-60"
          >
            Simpan Urutan
          </button>
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
                  className={`block w-full rounded-[1.5rem] px-4 py-4 text-left transition-colors ${
                    selectedItem?.id === item.id
                      ? "bg-[var(--primary-container)]/45"
                      : "bg-[var(--surface-container-low)]"
                  }`}
                >
                  <span className="mb-2 inline-flex items-center gap-2 text-[var(--on-surface-variant)]">
                    <span className="cursor-grab rounded-full bg-white p-2">
                      <GripVertical className="h-4 w-4" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                      Drag
                    </span>
                  </span>
                  <p className="text-sm font-semibold text-[var(--on-surface)]">{item.label}</p>
                  <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                    {item.location} - {item.href}
                  </p>
                </button>
              );
            })
          ) : (
            <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
              Tidak ada navigation item yang cocok dengan filter.
            </div>
          )}
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <form onSubmit={saveItem} className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                Navigation Editor
              </p>
              <h3 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
                {draft.label || "Item baru"}
              </h3>
            </div>

            <button
              type="button"
              onClick={deleteItem}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Hapus
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Label
              </label>
              <input
                value={draft.label}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    label: event.target.value,
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Href
              </label>
              <input
                value={draft.href}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    href: event.target.value,
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Location
              </label>
              <select
                value={draft.location}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    location: event.target.value as NavigationEditorRecord["location"],
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="navbar">navbar</option>
                <option value="footer_help">footer_help</option>
                <option value="footer_social">footer_social</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Sort Order
              </label>
              <input
                type="number"
                value={draft.sortOrder}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    sortOrder: Number(event.target.value),
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <label className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-3 text-sm font-semibold text-[var(--on-surface)]">
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

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-[var(--on-primary)] disabled:opacity-70"
          >
            {isSubmitting ? "Menyimpan..." : "Simpan Navigation"}
          </button>
        </form>
      </section>
    </div>
  );
}
