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

type ProductEditorRecord = {
  id?: string;
  slug: string;
  name: string;
  category: string;
  price: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  badge: string;
  seoTitle: string;
  metaDescription: string;
  whatsappMessageTemplate: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  features: string[];
  colors: string[];
  audiences: string[];
  gallery: { imageUrl: string; altText: string }[];
  specs: { label: string; value: string }[];
};

type ProductsAdminClientProps = {
  initialProducts: ProductEditorRecord[];
};

type ProductListKey = "features" | "colors" | "audiences";

function emptyProduct(): ProductEditorRecord {
  return {
    slug: "",
    name: "",
    category: "",
    price: "",
    shortDescription: "",
    description: "",
    imageUrl: "",
    badge: "",
    seoTitle: "",
    metaDescription: "",
    whatsappMessageTemplate: "",
    sortOrder: 0,
    isActive: true,
    isFeatured: false,
    features: [],
    colors: [],
    audiences: [],
    gallery: [],
    specs: [],
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

export function ProductsAdminClient({
  initialProducts,
}: ProductsAdminClientProps) {
  const [products, setProducts] = useState(initialProducts);
  const [selectedId, setSelectedId] = useState<string | "new">(
    initialProducts[0]?.id ?? "new",
  );
  const [draft, setDraft] = useState<ProductEditorRecord>(
    initialProducts[0] ?? emptyProduct(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [draggedListItem, setDraggedListItem] = useState<{
    key: ProductListKey;
    index: number;
  } | null>(null);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);
  const [draggedSpecIndex, setDraggedSpecIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    name: "",
    slug: "",
    category: "",
    price: "",
  });

  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

  const selectedProduct = useMemo(
    () => products.find((item) => item.id === selectedId) ?? null,
    [products, selectedId],
  );

  const filteredProducts = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return products.filter((product) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [product.name, product.slug, product.category]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? product.isActive : !product.isActive);

      return matchesQuery && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  function selectProduct(nextProduct: ProductEditorRecord | null) {
    if (!nextProduct?.id) {
      setSelectedId("new");
      setDraft(emptyProduct());
      return;
    }

    setSelectedId(nextProduct.id);
    setDraft(nextProduct);
  }

  function openCreateModal() {
    setCreateDraft({
      name: "",
      slug: "",
      category: "",
      price: "",
    });
    setIsCreateModalOpen(true);
  }

  function beginCreateProduct() {
    setSelectedId("new");
    setDraft({
      ...emptyProduct(),
      name: createDraft.name,
      slug: createDraft.slug,
      category: createDraft.category,
      price: createDraft.price,
    });
    setMessage(null);
    setErrorMessage(null);
    setIsCreateModalOpen(false);
  }

  function updateTextList(key: ProductListKey, nextItems: string[]) {
    setDraft((current) => ({
      ...current,
      [key]: nextItems,
    }));
  }

  function updateSpecList(nextItems: ProductEditorRecord["specs"]) {
    setDraft((current) => ({
      ...current,
      specs: nextItems,
    }));
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const result = (await response.json()) as { message?: string; id?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Produk belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    const nextProduct = {
      ...draft,
      id: result.id ?? draft.id,
    };

    setProducts((current) => {
      const exists = nextProduct.id
        ? current.some((item) => item.id === nextProduct.id)
        : false;

      if (!exists) {
        return [nextProduct, ...current];
      }

      return current.map((item) => (item.id === nextProduct.id ? nextProduct : item));
    });

    if (nextProduct.id) {
      setSelectedId(nextProduct.id);
    }

    setDraft(nextProduct);
    setMessage(result.message ?? "Produk berhasil disimpan.");
    setIsSubmitting(false);
  }

  async function deleteProduct() {
    if (!draft.id) {
      setDraft(emptyProduct());
      setSelectedId("new");
      return;
    }

    const confirmed = window.confirm(`Hapus produk ${draft.name || draft.slug}?`);
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/products?id=${draft.id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Produk belum berhasil dihapus.");
      setIsSubmitting(false);
      return;
    }

    const nextProducts = products.filter((item) => item.id !== draft.id);
    setProducts(nextProducts);
    selectProduct(nextProducts[0] ?? null);
    setMessage(result.message ?? "Produk berhasil dihapus.");
    setIsSubmitting(false);
  }

  return (
    <>
      <AdminCreateDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Produk"
        description="Isi ringkasan awal produk dulu, lalu lanjutkan detail lengkapnya di editor utama supaya canvas tetap ringkas."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["name", "Nama produk"],
            ["slug", "Slug"],
            ["category", "Kategori"],
            ["price", "Harga"],
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
          <AdminPrimaryButton onClick={beginCreateProduct}>Lanjutkan</AdminPrimaryButton>
        </div>
      </AdminCreateDialog>

      <AdminWorkspaceShell
        sidebar={
          <AdminSidebarPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Produk Supabase</h3>
                <p className="mt-1 text-sm leading-7 text-slate-500">
                  {products.length > 0
                    ? `${products.length} produk ada di database.`
                    : "Belum ada produk di Supabase. Website publik masih fallback ke src/data/site.ts."}
                </p>
              </div>
              <AdminPrimaryButton onClick={openCreateModal}>Produk Baru</AdminPrimaryButton>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama, slug, kategori"
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
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <button
                    key={product.id ?? product.slug}
                    type="button"
                    onClick={() => selectProduct(product)}
                    className={`block w-full rounded-[1.5rem] border px-4 py-4 text-left transition-colors ${
                      selectedProduct?.id === product.id
                        ? "border-[#c8d5ff] bg-[#eef3ff]"
                        : "border-slate-200 bg-[#f7f8fa]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">{product.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          /{product.slug} - {product.category || "No category"}
                        </p>
                      </div>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          product.isActive
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-200 text-slate-700"
                        }`}
                      >
                        {product.isActive ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </button>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-700">
                  Tidak ada produk yang cocok dengan filter.
                </div>
              )}
            </div>
          </AdminSidebarPanel>
        }
      >
        <AdminCanvasPanel>
          <form onSubmit={saveProduct} className="space-y-6">
            <AdminPanelHeading
              eyebrow="Product Editor"
              title={draft.name || "Produk baru"}
              description="Gunakan editor ini untuk mengelola informasi inti produk, SEO, gallery, dan struktur spesifikasi dengan bahasa visual yang sama seperti overview dashboard."
              action={<AdminDangerButton onClick={deleteProduct}>Hapus</AdminDangerButton>}
            />

            {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}
            {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["name", "Nama"],
                ["slug", "Slug"],
                ["category", "Kategori"],
                ["price", "Harga"],
                ["badge", "Badge"],
                ["seoTitle", "SEO Title"],
                ["metaDescription", "Meta Description"],
                ["whatsappMessageTemplate", "WA Template"],
              ].map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-slate-600">{label}</label>
                  <input
                    value={String(draft[key as keyof ProductEditorRecord] ?? "")}
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
                Produk aktif
              </label>

              <label className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-[#f7f8fa] px-4 py-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={draft.isFeatured}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      isFeatured: event.target.checked,
                    }))
                  }
                />
                Featured product
              </label>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Short Description</label>
              <textarea
                rows={3}
                value={draft.shortDescription}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    shortDescription: event.target.value,
                  }))
                }
                className={textareaClassName}
              />
              <AdminRichTextNote />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Description</label>
              <textarea
                rows={5}
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

            {[
              {
                key: "features" as const,
                title: "Features",
                placeholder: "Tulis feature produk",
              },
              {
                key: "colors" as const,
                title: "Colors",
                placeholder: "Tulis warna",
              },
              {
                key: "audiences" as const,
                title: "Audiences",
                placeholder: "Tulis target audience",
              },
            ].map(({ key, title, placeholder }) => (
              <AdminSectionCard
                key={key}
                title={title}
                description="Drag-and-drop untuk ubah urutan item."
                action={
                  <AdminPrimaryButton onClick={() => updateTextList(key, [...draft[key], ""])}>
                    Tambah
                  </AdminPrimaryButton>
                }
              >
                <div className="space-y-3">
                  {draft[key].map((item, index) => (
                    <div
                      key={`${key}-${index}-${item}`}
                      draggable
                      onDragStart={() => setDraggedListItem({ key, index })}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (!draggedListItem || draggedListItem.key !== key) {
                          return;
                        }

                        updateTextList(
                          key,
                          reorderItems(draft[key], draggedListItem.index, index),
                        );
                        setDraggedListItem(null);
                      }}
                      onDragEnd={() => setDraggedListItem(null)}
                      className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4"
                    >
                      <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2 text-slate-500">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <input
                        value={item}
                        onChange={(event) =>
                          updateTextList(
                            key,
                            draft[key].map((currentItem, currentIndex) =>
                              currentIndex === index ? event.target.value : currentItem,
                            ),
                          )
                        }
                        placeholder={placeholder}
                        className={`${inputClassName} flex-1`}
                      />
                      <AdminDangerButton
                        onClick={() =>
                          updateTextList(
                            key,
                            draft[key].filter((_, currentIndex) => currentIndex !== index),
                          )
                        }
                      >
                        Hapus
                      </AdminDangerButton>
                    </div>
                  ))}
                </div>
              </AdminSectionCard>
            ))}

            <AdminSectionCard
              title="Gallery"
              description="Pilih gambar dari media library dan drag-and-drop untuk ubah urutan."
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
                    key={`gallery-${index}-${item.imageUrl}`}
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

            <AdminSectionCard
              title="Specs"
              description="Gunakan label dan value terpisah, lalu drag-and-drop untuk ubah urutan."
              action={
                <AdminPrimaryButton
                  onClick={() => updateSpecList([...draft.specs, { label: "", value: "" }])}
                >
                  Tambah Spec
                </AdminPrimaryButton>
              }
            >
              <div className="space-y-3">
                {draft.specs.map((spec, index) => (
                  <div
                    key={`spec-${index}-${spec.label}`}
                    draggable
                    onDragStart={() => setDraggedSpecIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedSpecIndex === null) {
                        return;
                      }

                      updateSpecList(reorderItems(draft.specs, draggedSpecIndex, index));
                      setDraggedSpecIndex(null);
                    }}
                    onDragEnd={() => setDraggedSpecIndex(null)}
                    className="rounded-[1.5rem] border border-slate-200 bg-white p-5"
                  >
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2 text-slate-500">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <p className="text-sm font-semibold text-slate-950">Spec {index + 1}</p>
                      </div>
                      <AdminDangerButton
                        onClick={() =>
                          updateSpecList(
                            draft.specs.filter((_, currentIndex) => currentIndex !== index),
                          )
                        }
                      >
                        Hapus
                      </AdminDangerButton>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={spec.label}
                        onChange={(event) =>
                          updateSpecList(
                            draft.specs.map((currentSpec, currentIndex) =>
                              currentIndex === index
                                ? { ...currentSpec, label: event.target.value }
                                : currentSpec,
                            ),
                          )
                        }
                        placeholder="Label"
                        className={inputClassName}
                      />
                      <input
                        value={spec.value}
                        onChange={(event) =>
                          updateSpecList(
                            draft.specs.map((currentSpec, currentIndex) =>
                              currentIndex === index
                                ? { ...currentSpec, value: event.target.value }
                                : currentSpec,
                            ),
                          )
                        }
                        placeholder="Value, contoh: Food grade <strong>stainless steel</strong>"
                        className={inputClassName}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <AdminRichTextNote
                title="Notes spec value"
                extraNotes={[
                  "Format teks hanya dipakai di kolom value, bukan label.",
                  "Contoh: Food grade <strong>stainless steel</strong>.",
                ]}
              />
            </AdminSectionCard>

            <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
              {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
            </AdminPrimaryButton>
          </form>
        </AdminCanvasPanel>
      </AdminWorkspaceShell>
    </>
  );
}
