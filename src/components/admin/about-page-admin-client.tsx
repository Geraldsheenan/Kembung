"use client";

import { GripVertical } from "lucide-react";
import { useState } from "react";
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
      {[
        ["story", "Story Section"],
        ["mission", "Mission Section"],
        ["valuesIntro", "Values Intro"],
        ["final", "Final Section"],
      ].map(([key, label]) => {
        const section = form[key as keyof AboutPageEditorValue] as SectionEditor;
        const missionHighlights = key === "mission" ? getMissionHighlights(section) : [];

        return (
          <section
            key={key}
            className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6"
          >
            <h3 className="text-xl font-bold text-[var(--primary)]">{label}</h3>

            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
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
                  className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
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
                  className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
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
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
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
                className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
            </div>

            {key === "mission" ? (
              <div className="space-y-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="text-lg font-bold text-[var(--on-surface)]">
                      Mission Highlights
                    </h4>
                    <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                      Drag-and-drop untuk ubah urutan highlight.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      updateMissionHighlights([
                        ...missionHighlights,
                        { iconKey: "sparkles", label: "" },
                      ])
                    }
                    className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
                  >
                    Tambah Highlight
                  </button>
                </div>

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
                      className="grid gap-4 rounded-[1.25rem] bg-white p-4 md:grid-cols-[140px_minmax(0,1fr)_auto]"
                    >
                      <div className="flex items-center gap-2 text-[var(--on-surface-variant)] md:col-span-3">
                        <div className="cursor-grab rounded-full bg-[var(--surface-container-low)] p-2">
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
                        className="rounded-[1rem] border border-[var(--outline-variant)]/25 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
                        className="rounded-[1rem] border border-[var(--outline-variant)]/25 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateMissionHighlights(
                            missionHighlights.filter((_, currentIndex) => currentIndex !== index),
                          )
                        }
                        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        );
      })}

      <section className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--primary)]">Value Cards</h3>
            <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
              Drag-and-drop untuk ubah urutan value cards.
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setForm((current) => ({
                ...current,
                values: [
                  ...current.values,
                  { iconKey: "leaf", themeKey: "primary", title: "", description: "" },
                ],
              }))
            }
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
          >
            Tambah Card
          </button>
        </div>

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
                  className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
                  className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
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
                  className="rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="button"
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      values: current.values.filter((_, currentIndex) => currentIndex !== index),
                    }))
                  }
                  className="rounded-full border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                >
                  Hapus Card
                </button>
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
        {isSubmitting ? "Menyimpan..." : "Simpan About Page"}
      </button>
    </form>
  );
}
