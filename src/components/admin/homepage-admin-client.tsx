"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";
import {
  AdminDangerButton,
  AdminFlashMessage,
  AdminGhostButton,
  AdminInputClassName,
  AdminPrimaryButton,
  AdminSectionCard,
  AdminTextareaClassName,
} from "./admin-workspace";
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
  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

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
      <div className="rounded-[1.5rem] border border-slate-200 bg-[#f7f8fa] px-5 py-4 text-sm leading-7 text-slate-500">
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
          <AdminSectionCard
            key={key}
            title={label}
            description="Atur konten section ini dengan struktur yang konsisten untuk desktop dan mobile."
          >
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
                  <label className="ml-1 text-sm font-semibold text-slate-600">
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
                    className={inputClassName}
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
              <label className="ml-1 text-sm font-semibold text-slate-600">
                Description
              </label>
              <textarea
                rows={4}
                value={section.description}
                onChange={(event) =>
                  updateSectionField(sectionKey, "description", event.target.value)
                }
                className={textareaClassName}
              />
            </div>

            {sectionKey === "hero" ? (
              <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[#fbfcfe] p-5">
                <h4 className="text-lg font-bold text-slate-950">Hero Mobile Variant</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["mobileBadge", "Mobile Badge"],
                    ["mobileTitle", "Mobile Title"],
                    ["mobilePrimaryCtaLabel", "Mobile CTA Label"],
                    ["mobilePrimaryCtaHref", "Mobile CTA Href"],
                  ].map(([extraKey, extraLabel]) => (
                    <div key={extraKey} className="space-y-2">
                      <label className="ml-1 text-sm font-semibold text-slate-600">
                        {extraLabel}
                      </label>
                      <input
                        value={getExtraText(section, extraKey)}
                        onChange={(event) =>
                          updateExtraField(sectionKey, extraKey, event.target.value)
                        }
                        className={inputClassName}
                      />
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-slate-600">
                    Mobile Description
                  </label>
                  <textarea
                    rows={3}
                    value={getExtraText(section, "mobileDescription")}
                    onChange={(event) =>
                      updateExtraField(sectionKey, "mobileDescription", event.target.value)
                    }
                    className={textareaClassName}
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
              <div className="space-y-2 rounded-[1.5rem] border border-slate-200 bg-[#fbfcfe] p-5">
                <label className="ml-1 text-sm font-semibold text-slate-600">
                  Mobile CTA Label
                </label>
                <input
                  value={getExtraText(section, "mobileCtaLabel")}
                  onChange={(event) =>
                    updateExtraField(sectionKey, "mobileCtaLabel", event.target.value)
                  }
                  className={inputClassName}
                />
              </div>
            ) : null}

            {sectionKey === "newsletterBlock" ? (
              <div className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[#fbfcfe] p-5">
                <h4 className="text-lg font-bold text-slate-950">
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
                      <label className="ml-1 text-sm font-semibold text-slate-600">
                        {extraLabel}
                      </label>
                      <input
                        value={getExtraText(section, extraKey)}
                        onChange={(event) =>
                          updateExtraField(sectionKey, extraKey, event.target.value)
                        }
                        className={inputClassName}
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <label className="ml-1 text-sm font-semibold text-slate-600">
                    Mobile Description
                  </label>
                  <textarea
                    rows={3}
                    value={getExtraText(section, "mobileDescription")}
                    onChange={(event) =>
                      updateExtraField(sectionKey, "mobileDescription", event.target.value)
                    }
                    className={textareaClassName}
                  />
                </div>
              </div>
            ) : null}
          </AdminSectionCard>
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
            <AdminSectionCard
              key={key}
              title={label}
              description="Pilih produk unggulan lalu atur urutannya untuk tiap device."
              action={
                <AdminPrimaryButton onClick={() => addFeaturedSlot(featuredKey)}>
                  Tambah Slot
                </AdminPrimaryButton>
              }
            >
              <div className="space-y-3">
                {items.length > 0 ? (
                  items.map((slug, index) => (
                    <div
                      key={`${featuredKey}-${index}-${slug || "empty"}`}
                      className="rounded-[1.5rem] border border-slate-200 bg-[#fbfcfe] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-slate-950">
                          Slot {index + 1}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <AdminGhostButton
                            onClick={() => moveFeaturedSlot(featuredKey, index, -1)}
                            disabled={index === 0}
                            className="px-3 py-2 text-xs disabled:opacity-40"
                          >
                            Naik
                          </AdminGhostButton>
                          <AdminGhostButton
                            onClick={() => moveFeaturedSlot(featuredKey, index, 1)}
                            disabled={index === items.length - 1}
                            className="px-3 py-2 text-xs disabled:opacity-40"
                          >
                            Turun
                          </AdminGhostButton>
                          <AdminDangerButton
                            onClick={() => removeFeaturedSlot(featuredKey, index)}
                            className="px-3 py-2 text-xs"
                          >
                            Hapus
                          </AdminDangerButton>
                        </div>
                      </div>

                      <select
                        value={slug}
                        onChange={(event) =>
                          updateFeaturedSlot(featuredKey, index, event.target.value)
                        }
                        className={`mt-3 ${inputClassName}`}
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
                  <div className="rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-700">
                    Belum ada slot featured product.
                  </div>
                )}
              </div>
            </AdminSectionCard>
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
            <AdminSectionCard
              key={key}
              title={label}
              description="Kelola daftar reason untuk desktop dan mobile dengan urutan yang bisa dipindah."
              action={
                <AdminPrimaryButton
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
                >
                  Tambah Reason
                </AdminPrimaryButton>
              }
            >
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
                      className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-[#fbfcfe] p-5"
                    >
                      <div className="flex items-center gap-2 text-slate-500">
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
                        className={inputClassName}
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
                        className={inputClassName}
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
                        className={inputClassName}
                      />
                      <AdminDangerButton
                        onClick={() =>
                          updateReasons(
                            reasonKey,
                            items.filter((_, currentIndex) => currentIndex !== index),
                          )
                        }
                      >
                        Hapus Reason
                      </AdminDangerButton>
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
                      className={textareaClassName}
                    />
                  </div>
                ))}
              </div>
            </AdminSectionCard>
          );
        })}
      </div>

      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
        {isSubmitting ? "Menyimpan..." : "Simpan Homepage"}
      </AdminPrimaryButton>
    </form>
  );
}
