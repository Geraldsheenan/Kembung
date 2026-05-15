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
  AdminSectionCard,
  AdminSidebarPanel,
  AdminTextareaClassName,
  AdminWorkspaceShell,
} from "./admin-workspace";
import { AdminRichTextNote } from "./admin-rich-text-note";
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
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    name: "",
    slug: "",
    area: "",
  });

  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

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

  function openCreateModal() {
    setCreateDraft({
      name: "",
      slug: "",
      area: "",
    });
    setIsCreateModalOpen(true);
  }

  function beginCreateBranch() {
    setSelectedId("new");
    setDraft({
      ...emptyBranch(),
      name: createDraft.name,
      slug: createDraft.slug,
      area: createDraft.area,
    });
    setMessage(null);
    setErrorMessage(null);
    setIsCreateModalOpen(false);
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
    <>
      <AdminCreateDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Cabang"
        description="Mulai dari identitas cabang dulu, lalu lanjutkan pengisian koordinat, jam operasional, map, dan gallery di editor utama."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["name", "Nama cabang"],
            ["slug", "Slug"],
            ["area", "Area"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">{label}</label>
              <input
                value={createDraft[key as keyof typeof createDraft]}
                onChange={(event) =>
                  setCreateDraft((current) => ({
                    ...current,
                    [key]: event.target.value,
                  }))
                }
                className={inputClassName}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <AdminGhostButton onClick={() => setIsCreateModalOpen(false)}>Batal</AdminGhostButton>
          <AdminPrimaryButton onClick={beginCreateBranch}>Lanjutkan</AdminPrimaryButton>
        </div>
      </AdminCreateDialog>

      <AdminWorkspaceShell
        sidebar={
          <AdminSidebarPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Cabang Supabase</h3>
                <p className="mt-1 text-sm leading-7 text-slate-500">
                  {branches.length > 0
                    ? `${branches.length} cabang ada di database.`
                    : "Belum ada cabang di Supabase."}
                </p>
              </div>
              <AdminPrimaryButton onClick={openCreateModal}>Cabang Baru</AdminPrimaryButton>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama, slug, area"
                className={inputClassName}
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | "active" | "inactive")
                }
                className={inputClassName}
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
                    className={`block w-full rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                      selectedBranch?.id === branch.id
                        ? "border-[#c8d5ff] bg-[#eef3ff]"
                        : "border-slate-200 bg-[#f7f8fa]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{branch.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          /{branch.slug} - {branch.area || "No area"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          branch.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {branch.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-700">
                  Tidak ada cabang yang cocok dengan filter.
                </div>
              )}
            </div>
          </AdminSidebarPanel>
        }
      >
        <AdminCanvasPanel>
          <form onSubmit={saveBranch} className="space-y-6">
            <AdminPanelHeading
              eyebrow="Branch Editor"
              title={draft.name || "Cabang baru"}
              description="Editor cabang sekarang memakai pola visual yang sama dengan overview dashboard, jadi pengelolaan alamat, map, fasilitas, dan gallery terasa lebih rapi dan stabil."
              action={<AdminDangerButton onClick={deleteBranch}>Hapus</AdminDangerButton>}
            />

            {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}
            {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}
            <AdminRichTextNote
              extraNotes={[
                "Gunakan formatting ini terutama untuk description dan fasilitas cabang.",
              ]}
            />

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
                  <label className="ml-1 text-sm font-semibold text-slate-600">{label}</label>
                  <input
                    value={String(draft[key as keyof BranchEditorRecord] ?? "")}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        [key]: event.target.value,
                      }))
                    }
                    className={inputClassName}
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
                <label className="ml-1 text-sm font-semibold text-slate-600">Latitude</label>
                <input
                  value={draft.latitude}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      latitude: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">Longitude</label>
                <input
                  value={draft.longitude}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      longitude: event.target.value,
                    }))
                  }
                  className={inputClassName}
                />
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
              Cabang aktif
            </label>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Description</label>
              <textarea
                rows={4}
                value={draft.description}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className={textareaClassName}
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Map Embed</label>
              <textarea
                rows={4}
                value={draft.mapEmbed}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    mapEmbed: event.target.value,
                  }))
                }
                className={textareaClassName}
              />
            </div>

            <AdminSectionCard
              title="Facilities"
              description="Drag-and-drop untuk ubah urutan fasilitas cabang."
              action={
                <AdminPrimaryButton
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      facilities: [...current.facilities, ""],
                    }))
                  }
                >
                  Tambah Facility
                </AdminPrimaryButton>
              }
            >
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
                    className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4"
                  >
                    <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2 text-slate-500">
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
                      className={`${inputClassName} flex-1`}
                    />
                    <AdminDangerButton
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          facilities: current.facilities.filter(
                            (_, currentIndex) => currentIndex !== index,
                          ),
                        }))
                      }
                    >
                      Hapus
                    </AdminDangerButton>
                  </div>
                ))}
              </div>
            </AdminSectionCard>

            <AdminSectionCard
              title="Gallery"
              description="Pilih gambar dari media library dan atur urutannya."
              action={
                <AdminPrimaryButton
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      gallery: [...current.gallery, { imageUrl: "", altText: "" }],
                    }))
                  }
                >
                  Tambah Gambar
                </AdminPrimaryButton>
              }
            >
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
                    className="space-y-3 rounded-[1.5rem] border border-slate-200 bg-white p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2 text-slate-500">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold text-slate-950">Gambar {index + 1}</p>
                      </div>
                      <AdminDangerButton
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            gallery: current.gallery.filter(
                              (_, currentIndex) => currentIndex !== index,
                            ),
                          }))
                        }
                      >
                        Hapus
                      </AdminDangerButton>
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
                      className={inputClassName}
                    />
                  </div>
                ))}
              </div>
            </AdminSectionCard>

            <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
              {isSubmitting ? "Menyimpan..." : "Simpan Cabang"}
            </AdminPrimaryButton>
          </form>
        </AdminCanvasPanel>
      </AdminWorkspaceShell>
    </>
  );
}
