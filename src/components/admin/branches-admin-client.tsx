"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { MediaUrlField } from "./media-url-field";

type BranchGalleryItem = {
  imageUrl: string;
  altText: string;
};

type BranchEditorRecord = {
  id?: string;
  slug: string;
  name: string;
  area: string;
  badge: string;
  address: string;
  shortAddress: string;
  latitude: string;
  longitude: string;
  hours: string;
  mobileHours: string;
  description: string;
  amenity: string;
  amenityIcon: string;
  theme: string;
  mobileSubtitle: string;
  mobileAddressLine: string;
  mobileStatus: string;
  mobileStatusTone: string;
  mobileFeatureIcon: string;
  mapUrl: string;
  mapEmbed: string;
  imageUrl: string;
  imageClassName: string;
  facilities: string[];
  gallery: BranchGalleryItem[];
  sortOrder: number;
  isActive: boolean;
};

type BranchesAdminClientProps = {
  initialBranches: BranchEditorRecord[];
};

function emptyBranch(): BranchEditorRecord {
  return {
    slug: "",
    name: "",
    area: "",
    badge: "",
    address: "",
    shortAddress: "",
    latitude: "",
    longitude: "",
    hours: "",
    mobileHours: "",
    description: "",
    amenity: "",
    amenityIcon: "",
    theme: "",
    mobileSubtitle: "",
    mobileAddressLine: "",
    mobileStatus: "",
    mobileStatusTone: "",
    mobileFeatureIcon: "",
    mapUrl: "",
    mapEmbed: "",
    imageUrl: "",
    imageClassName: "",
    facilities: [],
    gallery: [],
    sortOrder: 0,
    isActive: true,
  };
}

function reorderItems<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

export function BranchesAdminClient({
  initialBranches,
}: BranchesAdminClientProps) {
  const [branches, setBranches] = useState(initialBranches);
  const [selectedId, setSelectedId] = useState<string | "new">(
    initialBranches[0]?.id ?? "new",
  );
  const [draft, setDraft] = useState<BranchEditorRecord>(
    initialBranches[0] ?? emptyBranch(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [draggedFacilityIndex, setDraggedFacilityIndex] = useState<number | null>(null);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedBranch = useMemo(
    () => branches.find((item) => item.id === selectedId) ?? null,
    [branches, selectedId],
  );

  const filteredBranches = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return branches.filter((branch) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [branch.name, branch.slug, branch.area, branch.address]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? branch.isActive : !branch.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [branches, searchQuery, statusFilter]);

  function selectBranch(nextBranch: BranchEditorRecord | null) {
    if (!nextBranch?.id) {
      setSelectedId("new");
      setDraft(emptyBranch());
      return;
    }

    setSelectedId(nextBranch.id);
    setDraft(nextBranch);
  }

  async function saveBranch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/branches", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const result = (await response.json()) as { message?: string; id?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Cabang belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    const nextBranch = {
      ...draft,
      id: result.id ?? draft.id,
    };

    setBranches((current) => {
      const exists = nextBranch.id
        ? current.some((item) => item.id === nextBranch.id)
        : false;

      if (!exists) {
        return [nextBranch, ...current];
      }

      return current.map((item) => (item.id === nextBranch.id ? nextBranch : item));
    });

    if (nextBranch.id) {
      setSelectedId(nextBranch.id);
    }

    setDraft(nextBranch);
    setMessage(result.message ?? "Cabang berhasil disimpan.");
    setIsSubmitting(false);
  }

  async function deleteBranch() {
    if (!draft.id) {
      setDraft(emptyBranch());
      setSelectedId("new");
      return;
    }

    const confirmed = window.confirm(`Hapus cabang ${draft.name || draft.slug}?`);
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/branches?id=${draft.id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Cabang belum berhasil dihapus.");
      setIsSubmitting(false);
      return;
    }

    const nextBranches = branches.filter((item) => item.id !== draft.id);
    setBranches(nextBranches);
    selectBranch(nextBranches[0] ?? null);
    setMessage(result.message ?? "Cabang berhasil dihapus.");
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--on-surface)]">Cabang Supabase</h3>
            <p className="mt-1 text-sm leading-7 text-[var(--on-surface-variant)]">
              {branches.length > 0
                ? `${branches.length} cabang ada di database.`
                : "Belum ada cabang di Supabase."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectBranch(null)}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
          >
            Cabang Baru
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari nama, slug, area"
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | "active" | "inactive")
            }
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">Semua status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {filteredBranches.length > 0 ? (
            filteredBranches.map((branch) => (
              <button
                key={branch.id ?? branch.slug}
                type="button"
                onClick={() => selectBranch(branch)}
                className={`block w-full rounded-[1.5rem] px-4 py-4 text-left transition-colors ${
                  selectedBranch?.id === branch.id
                    ? "bg-[var(--primary-container)]/45"
                    : "bg-[var(--surface-container-low)]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--on-surface)]">{branch.name}</p>
                <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                  /{branch.slug} - {branch.area || "No area"}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
              Tidak ada cabang yang cocok dengan filter.
            </div>
          )}
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <form onSubmit={saveBranch} className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                Branch Editor
              </p>
              <h3 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
                {draft.name || "Cabang baru"}
              </h3>
            </div>

            <button
              type="button"
              onClick={deleteBranch}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Hapus
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["name", "Nama"],
              ["slug", "Slug"],
              ["area", "Area"],
              ["badge", "Badge"],
              ["address", "Alamat"],
              ["shortAddress", "Short Address"],
              ["hours", "Jam Operasional"],
              ["mobileHours", "Mobile Hours"],
              ["amenity", "Amenity"],
              ["amenityIcon", "Amenity Icon"],
              ["theme", "Theme"],
              ["mobileSubtitle", "Mobile Subtitle"],
              ["mobileAddressLine", "Mobile Address Line"],
              ["mobileStatus", "Mobile Status"],
              ["mobileStatusTone", "Mobile Status Tone"],
              ["mobileFeatureIcon", "Mobile Feature Icon"],
              ["mapUrl", "Map URL"],
              ["imageClassName", "Image Class Name"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                  {label}
                </label>
                <input
                  value={String(draft[key as keyof BranchEditorRecord] ?? "")}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      [key]: event.target.value,
                    }))
                  }
                  className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            ))}
          </div>

          <MediaUrlField
            label="Image"
            value={draft.imageUrl}
            onChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                imageUrl: nextValue,
              }))
            }
          />

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Latitude
              </label>
              <input
                value={draft.latitude}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    latitude: event.target.value,
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Longitude
              </label>
              <input
                value={draft.longitude}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    longitude: event.target.value,
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
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
            Cabang aktif
          </label>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Description
            </label>
            <textarea
              rows={4}
              value={draft.description}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Map Embed
            </label>
            <textarea
              rows={4}
              value={draft.mapEmbed}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  mapEmbed: event.target.value,
                }))
              }
              className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <section className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)]">Facilities</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Drag-and-drop untuk ubah urutan fasilitas cabang.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    facilities: [...current.facilities, ""],
                  }))
                }
                className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
              >
                Tambah Facility
              </button>
            </div>

            <div className="space-y-3">
              {draft.facilities.map((facility, index) => (
                <div
                  key={`${facility}-${index}`}
                  draggable
                  onDragStart={() => setDraggedFacilityIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedFacilityIndex === null) {
                      return;
                    }

                    setDraft((current) => ({
                      ...current,
                      facilities: reorderItems(current.facilities, draggedFacilityIndex, index),
                    }));
                    setDraggedFacilityIndex(null);
                  }}
                  onDragEnd={() => setDraggedFacilityIndex(null)}
                  className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4"
                >
                  <div className="cursor-grab rounded-full bg-white p-2 text-[var(--on-surface-variant)]">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <input
                    value={facility}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        facilities: current.facilities.map((currentFacility, currentIndex) =>
                          currentIndex === index ? event.target.value : currentFacility,
                        ),
                      }))
                    }
                    placeholder="Nama fasilitas"
                    className="flex-1 rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        facilities: current.facilities.filter(
                          (_, currentIndex) => currentIndex !== index,
                        ),
                      }))
                    }
                    className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                  >
                    Hapus
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)]">Gallery</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Pilih gambar dari media library dan atur urutannya.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    gallery: [...current.gallery, { imageUrl: "", altText: "" }],
                  }))
                }
                className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
              >
                Tambah Gambar
              </button>
            </div>

            <div className="space-y-4">
              {draft.gallery.map((item, index) => (
                <div
                  key={`${item.imageUrl}-${index}`}
                  draggable
                  onDragStart={() => setDraggedGalleryIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedGalleryIndex === null) {
                      return;
                    }

                    setDraft((current) => ({
                      ...current,
                      gallery: reorderItems(current.gallery, draggedGalleryIndex, index),
                    }));
                    setDraggedGalleryIndex(null);
                  }}
                  onDragEnd={() => setDraggedGalleryIndex(null)}
                  className="space-y-3 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab rounded-full bg-white p-2 text-[var(--on-surface-variant)]">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--on-surface)]">
                        Gambar {index + 1}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          gallery: current.gallery.filter(
                            (_, currentIndex) => currentIndex !== index,
                          ),
                        }))
                      }
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Hapus
                    </button>
                  </div>

                  <MediaUrlField
                    label={`Gallery Image ${index + 1}`}
                    value={item.imageUrl}
                    onChange={(nextValue) =>
                      setDraft((current) => ({
                        ...current,
                        gallery: current.gallery.map((currentItem, currentIndex) =>
                          currentIndex === index
                            ? { ...currentItem, imageUrl: nextValue }
                            : currentItem,
                        ),
                      }))
                    }
                  />

                  <input
                    value={item.altText}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        gallery: current.gallery.map((currentItem, currentIndex) =>
                          currentIndex === index
                            ? { ...currentItem, altText: event.target.value }
                            : currentItem,
                        ),
                      }))
                    }
                    placeholder="Alt text"
                    className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              ))}
            </div>
          </section>

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
            {isSubmitting ? "Menyimpan..." : "Simpan Cabang"}
          </button>
        </form>
      </section>
    </div>
  );
}
