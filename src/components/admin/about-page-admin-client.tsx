"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";
import {
  AdminDangerButton,
  AdminFlashMessage,
  AdminInputClassName,
  AdminPrimaryButton,
  AdminSectionCard,
  AdminTextareaClassName,
} from "./admin-workspace";
import { AdminRichTextNote } from "./admin-rich-text-note";
import { MediaUrlField } from "./media-url-field";

type HighlightItem = {
  iconKey: string;
  label: string;
};

type SectionEditor = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  quoteText: string;
  extra: Record<string, unknown>;
};

type ValueItem = {
  title: string;
  description: string;
  iconKey: string;
  themeKey: string;
};

type AboutPageEditorValue = {
  story: SectionEditor;
  mission: SectionEditor;
  valuesIntro: SectionEditor;
  final: SectionEditor;
  values: ValueItem[];
};

type AboutPageAdminClientProps = {
  initialValue: AboutPageEditorValue;
};

function moveItem<T>(items: T[], fromIndex: number, toIndex: number) {
  if (toIndex < 0 || toIndex >= items.length || fromIndex === toIndex) {
    return items;
  }

  const nextItems = [...items];
  const [item] = nextItems.splice(fromIndex, 1);
  nextItems.splice(toIndex, 0, item);
  return nextItems;
}

function getMissionHighlights(section: SectionEditor) {
  const highlights = (section.extra.highlights as HighlightItem[] | undefined) ?? [];
  return Array.isArray(highlights) ? highlights : [];
}

export function AboutPageAdminClient({
  initialValue,
}: AboutPageAdminClientProps) {
  const [form, setForm] = useState(initialValue);
  const [draggedValueIndex, setDraggedValueIndex] = useState<number | null>(null);
  const [draggedHighlightIndex, setDraggedHighlightIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

  function updateMissionHighlights(nextHighlights: HighlightItem[]) {
    setForm((current) => ({
      ...current,
      mission: {
        ...current.mission,
        extra: {
          ...current.mission.extra,
          highlights: nextHighlights,
        },
      },
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/about-page", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "About page belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    setMessage(result.message ?? "About page berhasil disimpan.");
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <AdminRichTextNote />

      {[
        ["story", "Story Section"],
        ["mission", "Mission Section"],
        ["valuesIntro", "Values Intro"],
        ["final", "Final Section"],
      ].map(([key, label]) => {
        const section = form[key as keyof AboutPageEditorValue] as SectionEditor;
        const missionHighlights = key === "mission" ? getMissionHighlights(section) : [];

        return (
          <AdminSectionCard
            key={key}
            title={label}
            description="Edit struktur section ini dengan visual dan spacing yang sama seperti modul admin lain."
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">
                  Eyebrow
                </label>
                <input
                  value={section.eyebrow}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: {
                        ...current[key as keyof AboutPageEditorValue],
                        eyebrow: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-slate-600">
                  Quote Text
                </label>
                <input
                  value={section.quoteText}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [key]: {
                        ...current[key as keyof AboutPageEditorValue],
                        quoteText: event.target.value,
                      },
                    }))
                  }
                  className={inputClassName}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">
                Title
              </label>
              <input
                value={section.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: {
                      ...current[key as keyof AboutPageEditorValue],
                      title: event.target.value,
                    },
                  }))
                }
                className={inputClassName}
              />
            </div>

            <MediaUrlField
              label="Image"
              value={section.imageUrl}
              onChange={(nextValue) =>
                setForm((current) => ({
                  ...current,
                  [key]: {
                    ...current[key as keyof AboutPageEditorValue],
                    imageUrl: nextValue,
                  },
                }))
              }
            />

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">
                Description
              </label>
              <textarea
                rows={4}
                value={section.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    [key]: {
                      ...current[key as keyof AboutPageEditorValue],
                      description: event.target.value,
                    },
                  }))
                }
                className={textareaClassName}
              />
            </div>

            {key === "mission" ? (
              <AdminSectionCard
                title="Mission Highlights"
                description="Drag-and-drop untuk ubah urutan highlight."
                action={
                  <AdminPrimaryButton
                    onClick={() =>
                      updateMissionHighlights([
                        ...missionHighlights,
                        { iconKey: "sparkles", label: "" },
                      ])
                    }
                  >
                    Tambah Highlight
                  </AdminPrimaryButton>
                }
              >
                <div className="space-y-3">
                  {missionHighlights.map((item, index) => (
                    <div
                      key={`${item.iconKey}-${index}`}
                      draggable
                      onDragStart={() => setDraggedHighlightIndex(index)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => {
                        if (draggedHighlightIndex === null) {
                          return;
                        }

                        updateMissionHighlights(
                          moveItem(missionHighlights, draggedHighlightIndex, index),
                        );
                        setDraggedHighlightIndex(null);
                      }}
                      onDragEnd={() => setDraggedHighlightIndex(null)}
                      className="grid gap-4 rounded-[1.25rem] border border-slate-200 bg-white p-4 md:grid-cols-[140px_minmax(0,1fr)_auto]"
                    >
                      <div className="flex items-center gap-2 text-slate-500 md:col-span-3">
                        <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2">
                          <GripVertical className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-semibold uppercase tracking-[0.12em]">
                          Drag untuk ubah urutan
                        </span>
                      </div>
                      <input
                        value={item.iconKey}
                        onChange={(event) =>
                          updateMissionHighlights(
                            missionHighlights.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? { ...currentItem, iconKey: event.target.value }
                                : currentItem,
                            ),
                          )
                        }
                        placeholder="iconKey"
                        className={inputClassName}
                      />
                      <input
                        value={item.label}
                        onChange={(event) =>
                          updateMissionHighlights(
                            missionHighlights.map((currentItem, currentIndex) =>
                              currentIndex === index
                                ? { ...currentItem, label: event.target.value }
                                : currentItem,
                            ),
                          )
                        }
                        placeholder="Label"
                        className={inputClassName}
                      />
                      <AdminDangerButton
                        onClick={() =>
                          updateMissionHighlights(
                            missionHighlights.filter((_, currentIndex) => currentIndex !== index),
                          )
                        }
                      >
                        Hapus
                      </AdminDangerButton>
                    </div>
                  ))}
                </div>
              </AdminSectionCard>
            ) : null}
          </AdminSectionCard>
        );
      })}

      <AdminSectionCard
        title="Value Cards"
        description="Drag-and-drop untuk ubah urutan value cards."
        action={
          <AdminPrimaryButton
            onClick={() =>
              setForm((current) => ({
                ...current,
                values: [
                  ...current.values,
                  { iconKey: "leaf", themeKey: "primary", title: "", description: "" },
                ],
              }))
            }
          >
            Tambah Card
          </AdminPrimaryButton>
        }
      >
        <div className="space-y-4">
          {form.values.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              draggable
              onDragStart={() => setDraggedValueIndex(index)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => {
                if (draggedValueIndex === null) {
                  return;
                }

                setForm((current) => ({
                  ...current,
                  values: moveItem(current.values, draggedValueIndex, index),
                }));
                setDraggedValueIndex(null);
              }}
              onDragEnd={() => setDraggedValueIndex(null)}
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
                    setForm((current) => ({
                      ...current,
                      values: current.values.map((currentItem, currentIndex) =>
                        currentIndex === index
                          ? { ...currentItem, title: event.target.value }
                          : currentItem,
                      ),
                    }))
                  }
                  placeholder="Title"
                  className={inputClassName}
                />
                <input
                  value={item.iconKey}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      values: current.values.map((currentItem, currentIndex) =>
                        currentIndex === index
                          ? { ...currentItem, iconKey: event.target.value }
                          : currentItem,
                      ),
                    }))
                  }
                  placeholder="Icon key"
                  className={inputClassName}
                />
                <input
                  value={item.themeKey}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      values: current.values.map((currentItem, currentIndex) =>
                        currentIndex === index
                          ? { ...currentItem, themeKey: event.target.value }
                          : currentItem,
                      ),
                    }))
                  }
                  placeholder="Theme key"
                  className={inputClassName}
                />
                <AdminDangerButton
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      values: current.values.filter((_, currentIndex) => currentIndex !== index),
                    }))
                  }
                >
                  Hapus Card
                </AdminDangerButton>
              </div>

              <textarea
                rows={3}
                value={item.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    values: current.values.map((currentItem, currentIndex) =>
                      currentIndex === index
                        ? { ...currentItem, description: event.target.value }
                        : currentItem,
                    ),
                  }))
                }
                placeholder="Description"
                className={textareaClassName}
              />
            </div>
          ))}
        </div>
      </AdminSectionCard>

      {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}

      {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}

      <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
        {isSubmitting ? "Menyimpan..." : "Simpan About Page"}
      </AdminPrimaryButton>
    </form>
  );
}
