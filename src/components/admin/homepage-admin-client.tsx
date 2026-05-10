"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";
import { MediaUrlField } from "./media-url-field";

type SectionEditor = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  extra: Record<string, unknown>;
};

type ReasonItem = {
  title: string;
  description: string;
  iconKey: string;
  themeKey: string;
};

type HomepageEditorValue = {
  hero: SectionEditor;
  bestSellersIntro: SectionEditor;
  reasonsIntro: SectionEditor;
  newsletterBlock: SectionEditor;
  tiktokBlock: SectionEditor;
  featuredDesktopSlugs: string[];
  featuredMobileSlugs: string[];
  desktopReasons: ReasonItem[];
  mobileReasons: ReasonItem[];
};

type HomepageAdminClientProps = {
  initialValue: HomepageEditorValue;
  availableProducts: { slug: string; name: string }[];
};

type FeaturedDevice = "featuredDesktopSlugs" | "featuredMobileSlugs";
type ReasonDevice = "desktopReasons" | "mobileReasons";

function reorderItems<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

function getExtraText(section: SectionEditor, key: string) {
  const value = section.extra[key];
  return typeof value === "string" ? value : "";
}

export function HomepageAdminClient({
  initialValue,
  availableProducts,
}: HomepageAdminClientProps) {
  const [form, setForm] = useState(initialValue);
  const [draggedDesktopReasonIndex, setDraggedDesktopReasonIndex] = useState<number | null>(null);
  const [draggedMobileReasonIndex, setDraggedMobileReasonIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateFeaturedProducts(key: FeaturedDevice, nextItems: string[]) {
    setForm((current) => ({
      ...current,
      [key]: nextItems,
    }));
  }

  function addFeaturedSlot(key: FeaturedDevice) {
    updateFeaturedProducts(key, [...form[key], ""]);
  }

  function updateFeaturedSlot(key: FeaturedDevice, index: number, slug: string) {
    updateFeaturedProducts(
      key,
      form[key].map((currentSlug, currentIndex) =>
        currentIndex === index ? slug : currentSlug,
      ),
    );
  }

  function removeFeaturedSlot(key: FeaturedDevice, index: number) {
    updateFeaturedProducts(
      key,
      form[key].filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function moveFeaturedSlot(key: FeaturedDevice, index: number, direction: -1 | 1) {
    updateFeaturedProducts(key, reorderItems(form[key], index, index + direction));
  }

  function updateSectionField(
    key: keyof Pick<
      HomepageEditorValue,
      "hero" | "bestSellersIntro" | "reasonsIntro" | "newsletterBlock" | "tiktokBlock"
    >,
    field: keyof SectionEditor,
    value: string | Record<string, unknown>,
  ) {
    setForm((current) => ({
      ...current,
      [key]: {
        ...current[key],
        [field]: value,
      },
    }));
  }

  function updateExtraField(
    key: keyof Pick<
      HomepageEditorValue,
      "hero" | "bestSellersIntro" | "reasonsIntro" | "newsletterBlock" | "tiktokBlock"
    >,
    extraKey: string,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [key]: {
        ...current[key],
        extra: {
          ...current[key].extra,
          [extraKey]: value,
        },
      },
    }));
  }

  function updateReasons(key: ReasonDevice, nextItems: ReasonItem[]) {
    setForm((current) => ({
      ...current,
      [key]: nextItems,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/homepage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        featuredDesktopSlugs: form.featuredDesktopSlugs.filter(Boolean),
        featuredMobileSlugs: form.featuredMobileSlugs.filter(Boolean),
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Homepage belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message ?? "Homepage berhasil disimpan.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-5 py-4 text-sm leading-7 text-[var(--on-surface-variant)]">
        Produk yang tersedia saat ini:{" "}
        {availableProducts.length > 0
          ? availableProducts.map((product) => `${product.slug} (${product.name})`).join(", ")
          : "Belum ada produk aktif di Supabase."}
      </div>

      {[
        ["hero", "Hero"],
        ["bestSellersIntro", "Best Sellers Intro"],
        ["reasonsIntro", "Reasons Intro"],
        ["newsletterBlock", "Newsletter Block"],
        ["tiktokBlock", "TikTok Block"],
      ].map(([key, label]) => {
        const sectionKey = key as keyof Pick<
          HomepageEditorValue,
          "hero" | "bestSellersIntro" | "reasonsIntro" | "newsletterBlock" | "tiktokBlock"
        >;
        const section = form[sectionKey];

        return (
          <section
            key={key}
            className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6"
          >
            <h3 className="text-xl font-bold text-[var(--primary)]">{label}</h3>

            <div className="grid gap-5 md:grid-cols-2">
              {[
                ["title", "Title"],
                ["subtitle", "Subtitle"],
                ["primaryCtaLabel", "Primary CTA Label"],
                ["primaryCtaHref", "Primary CTA Href"],
                ["secondaryCtaLabel", "Secondary CTA Label"],
                ["secondaryCtaHref", "Secondary CTA Href"],
              ].map(([field, fieldLabel]) => (
                <div key={field} className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                    {fieldLabel}
                  </label>
                  <input
                    value={String(section[field as keyof SectionEditor] ?? "")}
                    onChange={(event) =>
                      updateSectionField(
                        sectionKey,
                        field as keyof SectionEditor,
                        event.target.value,
                      )
                    }
                    className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              ))}
            </div>

            <MediaUrlField
              label="Image"
              value={section.imageUrl}
              onChange={(nextValue) => updateSectionField(sectionKey, "imageUrl", nextValue)}
            />

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Description
              </label>
              <textarea
                rows={4}
                value={section.description}
                onChange={(event) =>
                  updateSectionField(sectionKey, "description", event.target.value)
                }
                className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {sectionKey === "hero" ? (
              <div className="space-y-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                <h4 className="text-lg font-bold text-[var(--on-surface)]">Hero Mobile Variant</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["mobileBadge", "Mobile Badge"],
                    ["mobileTitle", "Mobile Title"],
                    ["mobilePrimaryCtaLabel", "Mobile CTA Label"],
                    ["mobilePrimaryCtaHref", "Mobile CTA Href"],
                  ].map(([extraKey, extraLabel]) => (
                    <div key={extraKey} className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                        {extraLabel}
                      </label>
                      <input
                        value={getExtraText(section, extraKey)}
                        onChange={(event) =>
                          updateExtraField(sectionKey, extraKey, event.target.value)
                        }
                        className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                    Mobile Description
                  </label>
                  <textarea
                    rows={3}
                    value={getExtraText(section, "mobileDescription")}
                    onChange={(event) =>
                      updateExtraField(sectionKey, "mobileDescription", event.target.value)
                    }
                    className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                <MediaUrlField
                  label="Mobile Image"
                  value={getExtraText(section, "mobileImageUrl")}
                  onChange={(nextValue) => updateExtraField(sectionKey, "mobileImageUrl", nextValue)}
                />
              </div>
            ) : null}

            {sectionKey === "bestSellersIntro" ? (
              <div className="space-y-2 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                  Mobile CTA Label
                </label>
                <input
                  value={getExtraText(section, "mobileCtaLabel")}
                  onChange={(event) =>
                    updateExtraField(sectionKey, "mobileCtaLabel", event.target.value)
                  }
                  className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            ) : null}

            {sectionKey === "newsletterBlock" ? (
              <div className="space-y-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                <h4 className="text-lg font-bold text-[var(--on-surface)]">
                  Newsletter Variant Fields
                </h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["mobileTitle", "Mobile Title"],
                    ["mobileInputPlaceholder", "Mobile Input Placeholder"],
                    ["mobileButtonLabel", "Mobile Button Label"],
                    ["desktopInputPlaceholder", "Desktop Input Placeholder"],
                    ["desktopButtonLabel", "Desktop Button Label"],
                  ].map(([extraKey, extraLabel]) => (
                    <div key={extraKey} className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                        {extraLabel}
                      </label>
                      <input
                        value={getExtraText(section, extraKey)}
                        onChange={(event) =>
                          updateExtraField(sectionKey, extraKey, event.target.value)
                        }
                        className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                    Mobile Description
                  </label>
                  <textarea
                    rows={3}
                    value={getExtraText(section, "mobileDescription")}
                    onChange={(event) =>
                      updateExtraField(sectionKey, "mobileDescription", event.target.value)
                    }
                    className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>
              </div>
            ) : null}
          </section>
        );
      })}

      <div className="grid gap-6 xl:grid-cols-2">
        {[
          ["featuredDesktopSlugs", "Featured Desktop Products"],
          ["featuredMobileSlugs", "Featured Mobile Products"],
        ].map(([key, label]) => {
          const featuredKey = key as FeaturedDevice;
          const items = form[featuredKey];

          return (
            <section
              key={key}
              className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--primary)]">{label}</h3>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Pilih produk dari dropdown, lalu atur urutannya.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => addFeaturedSlot(featuredKey)}
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
                >
                  Tambah Slot
                </button>
              </div>

              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((slug, index) => (
                    <div
                      key={`${featuredKey}-${index}-${slug || "empty"}`}
                      className="rounded-[1.5rem] bg-[var(--surface-container-low)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-[var(--on-surface)]">
                          Slot {index + 1}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => moveFeaturedSlot(featuredKey, index, -1)}
                            disabled={index === 0}
                            className="rounded-full border border-[var(--outline-variant)]/30 px-3 py-2 text-xs font-semibold text-[var(--on-surface)] disabled:opacity-40"
                          >
                            Naik
                          </button>
                          <button
                            type="button"
                            onClick={() => moveFeaturedSlot(featuredKey, index, 1)}
                            disabled={index === items.length - 1}
                            className="rounded-full border border-[var(--outline-variant)]/30 px-3 py-2 text-xs font-semibold text-[var(--on-surface)] disabled:opacity-40"
                          >
                            Turun
                          </button>
                          <button
                            type="button"
                            onClick={() => removeFeaturedSlot(featuredKey, index)}
                            className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>

                      <select
                        value={slug}
                        onChange={(event) =>
                          updateFeaturedSlot(featuredKey, index, event.target.value)
                        }
                        className="mt-3 w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      >
                        <option value="">Pilih produk</option>
                        {availableProducts.map((product) => (
                          <option key={product.slug} value={product.slug}>
                            {product.name} ({product.slug})
                          </option>
                        ))}
                      </select>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
                    Belum ada slot featured product.
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        {[
          {
            key: "desktopReasons" as const,
            label: "Desktop Reasons",
            draggedIndex: draggedDesktopReasonIndex,
            setDraggedIndex: setDraggedDesktopReasonIndex,
          },
          {
            key: "mobileReasons" as const,
            label: "Mobile Reasons",
            draggedIndex: draggedMobileReasonIndex,
            setDraggedIndex: setDraggedMobileReasonIndex,
          },
        ].map(({ key, label, draggedIndex, setDraggedIndex }) => {
          const reasonKey = key as ReasonDevice;
          const items = form[reasonKey];

          return (
            <section
              key={key}
              className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-[var(--primary)]">{label}</h3>
                  <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                    Drag-and-drop untuk ubah urutan reasons.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    updateReasons(reasonKey, [
                      ...items,
                      {
                        title: "",
                        description: "",
                        iconKey: "sparkles",
                        themeKey: "primary",
                      },
                    ])
                  }
                  className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
                >
                  Tambah Reason
                </button>
              </div>

              <div className="space-y-4">
                {items.map((item, index) => (
                    <div
                      key={`${item.title}-${index}`}
                      draggable
                      onDragStart={() => setDraggedIndex(index)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (typeof draggedIndex !== "number") {
                          return;
                        }

                        updateReasons(reasonKey, reorderItems(items, draggedIndex, index));
                        setDraggedIndex(null);
                      }}
                      onDragEnd={() => setDraggedIndex(null)}
                      className="space-y-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5"
                    >
                      <div className="flex items-center gap-2 text-[var(--on-surface-variant)]">
                        <div className="cursor-grab rounded-full bg-white p-2">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                          Drag untuk ubah urutan
                        </span>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                      <input
                        value={item.title}
                        onChange={(event) =>
                          updateReasons(
                            reasonKey,
                            items.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? { ...currentItem, title: event.target.value }
                                : currentItem,
                            ),
                          )
                        }
                        placeholder="Title"
                        className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        value={item.iconKey}
                        onChange={(event) =>
                          updateReasons(
                            reasonKey,
                            items.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? { ...currentItem, iconKey: event.target.value }
                                : currentItem,
                            ),
                          )
                        }
                        placeholder="Icon key"
                        className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <input
                        value={item.themeKey}
                        onChange={(event) =>
                          updateReasons(
                            reasonKey,
                            items.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? { ...currentItem, themeKey: event.target.value }
                                : currentItem,
                            ),
                          )
                        }
                        placeholder="Theme key"
                        className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateReasons(
                            reasonKey,
                            items.filter((_, currentIndex) => currentIndex !== index),
                          )
                        }
                        className="rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                      >
                        Hapus Reason
                      </button>
                    </div>

                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(event) =>
                        updateReasons(
                          reasonKey,
                          items.map((currentItem, currentIndex) =>
                            currentIndex === index
                              ? { ...currentItem, description: event.target.value }
                              : currentItem,
                          ),
                        )
                      }
                      placeholder="Description"
                      className="w-full rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                ))}
              </div>
            </section>
          );
        })}
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
        {isSubmitting ? "Menyimpan..." : "Simpan Homepage"}
      </button>
    </form>
  );
}
