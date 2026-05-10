"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
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
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--on-surface)]">Produk Supabase</h3>
            <p className="mt-1 text-sm leading-7 text-[var(--on-surface-variant)]">
              {products.length > 0
                ? `${products.length} produk ada di database.`
                : "Belum ada produk di Supabase. Website publik masih fallback ke src/data/site.ts."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectProduct(null)}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
          >
            Produk Baru
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari nama, slug, kategori"
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
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <button
                key={product.id ?? product.slug}
                type="button"
                onClick={() => selectProduct(product)}
                className={`block w-full rounded-[1.5rem] px-4 py-4 text-left transition-colors ${
                  selectedProduct?.id === product.id
                    ? "bg-[var(--primary-container)]/45"
                    : "bg-[var(--surface-container-low)]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--on-surface)]">{product.name}</p>
                <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                  /{product.slug} - {product.category || "No category"}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
              Tidak ada produk yang cocok dengan filter.
            </div>
          )}
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <form onSubmit={saveProduct} className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                Product Editor
              </p>
              <h3 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
                {draft.name || "Produk baru"}
              </h3>
            </div>

            <button
              type="button"
              onClick={deleteProduct}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Hapus
            </button>
          </div>

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
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                  {label}
                </label>
                <input
                  value={String(draft[key as keyof ProductEditorRecord] ?? "")}
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
              Produk aktif
            </label>

            <label className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--surface-container-low)] px-4 py-3 text-sm font-semibold text-[var(--on-surface)]">
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
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Short Description
            </label>
            <textarea
              rows={3}
              value={draft.shortDescription}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  shortDescription: event.target.value,
                }))
              }
              className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Description
            </label>
            <textarea
              rows={5}
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
            <section
              key={key}
              className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--primary)]">{title}</h3>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Drag-and-drop untuk ubah urutan item.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => updateTextList(key, [...draft[key], ""])}
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
                >
                  Tambah
                </button>
              </div>

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
                    className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4"
                  >
                    <div className="cursor-grab rounded-full bg-white p-2 text-[var(--on-surface-variant)]">
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
                      className="flex-1 rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        updateTextList(
                          key,
                          draft[key].filter((_, currentIndex) => currentIndex !== index),
                        )
                      }
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Hapus
                    </button>
                  </div>
                ))}
              </div>
            </section>
          ))}

          <section className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)]">Gallery</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Pilih gambar dari media library dan drag-and-drop untuk ubah urutan.
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

          <section className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)]">Specs</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Gunakan label dan value terpisah, lalu drag-and-drop untuk ubah urutan.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSpecList([...draft.specs, { label: "", value: "" }])
                }
                className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
              >
                Tambah Spec
              </button>
            </div>

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
                  className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-5"
                >
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="cursor-grab rounded-full bg-white p-2 text-[var(--on-surface-variant)]">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <p className="text-sm font-semibold text-[var(--on-surface)]">
                        Spec {index + 1}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateSpecList(
                          draft.specs.filter((_, currentIndex) => currentIndex !== index),
                        )
                      }
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Hapus
                    </button>
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
                      className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
                      placeholder="Value"
                      className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
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
            {isSubmitting ? "Menyimpan..." : "Simpan Produk"}
          </button>
        </form>
      </section>
    </div>
  );
}
