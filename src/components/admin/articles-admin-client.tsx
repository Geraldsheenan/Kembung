"use client";

import { GripVertical } from "lucide-react";
import { useMemo, useState } from "react";
import { MediaUrlField } from "./media-url-field";

type ArticleSectionRecord = {
  heading: string;
  paragraphs: string[];
};

type ArticleEditorRecord = {
  id?: string;
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  seoTitle: string;
  metaDescription: string;
  publishedDate: string;
  readTime: string;
  author: string;
  authorRole: string;
  imageUrl: string;
  imageAlt: string;
  intro: string;
  quote: string;
  canonicalUrl: string;
  ogImageUrl: string;
  status: "draft" | "published";
  isFeatured: boolean;
  tags: string[];
  sections: ArticleSectionRecord[];
};

type ArticlesAdminClientProps = {
  initialArticles: ArticleEditorRecord[];
};

function emptyArticle(): ArticleEditorRecord {
  return {
    slug: "",
    title: "",
    category: "",
    excerpt: "",
    seoTitle: "",
    metaDescription: "",
    publishedDate: "",
    readTime: "",
    author: "",
    authorRole: "",
    imageUrl: "",
    imageAlt: "",
    intro: "",
    quote: "",
    canonicalUrl: "",
    ogImageUrl: "",
    status: "draft",
    isFeatured: false,
    tags: [],
    sections: [],
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

export function ArticlesAdminClient({
  initialArticles,
}: ArticlesAdminClientProps) {
  const [articles, setArticles] = useState(initialArticles);
  const [selectedId, setSelectedId] = useState<string | "new">(
    initialArticles[0]?.id ?? "new",
  );
  const [draft, setDraft] = useState<ArticleEditorRecord>(
    initialArticles[0] ?? emptyArticle(),
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "draft" | "published">("all");
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [draggedTagIndex, setDraggedTagIndex] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedArticle = useMemo(
    () => articles.find((item) => item.id === selectedId) ?? null,
    [articles, selectedId],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return articles.filter((article) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [article.title, article.slug, article.category, article.author]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesStatus = statusFilter === "all" || article.status === statusFilter;

      return matchesQuery && matchesStatus;
    });
  }, [articles, searchQuery, statusFilter]);

  function selectArticle(nextArticle: ArticleEditorRecord | null) {
    if (!nextArticle?.id) {
      setSelectedId("new");
      setDraft(emptyArticle());
      return;
    }

    setSelectedId(nextArticle.id);
    setDraft(nextArticle);
  }

  async function saveArticle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/articles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    const result = (await response.json()) as { message?: string; id?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Artikel belum berhasil disimpan.");
      setIsSubmitting(false);
      return;
    }

    const nextArticle = {
      ...draft,
      id: result.id ?? draft.id,
    };

    setArticles((current) => {
      const exists = nextArticle.id
        ? current.some((item) => item.id === nextArticle.id)
        : false;

      if (!exists) {
        return [nextArticle, ...current];
      }

      return current.map((item) => (item.id === nextArticle.id ? nextArticle : item));
    });

    if (nextArticle.id) {
      setSelectedId(nextArticle.id);
    }

    setDraft(nextArticle);
    setMessage(result.message ?? "Artikel berhasil disimpan.");
    setIsSubmitting(false);
  }

  async function deleteArticle() {
    if (!draft.id) {
      setDraft(emptyArticle());
      setSelectedId("new");
      return;
    }

    const confirmed = window.confirm(`Hapus artikel ${draft.title || draft.slug}?`);
    if (!confirmed) {
      return;
    }

    setIsSubmitting(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch(`/api/admin/articles?id=${draft.id}`, {
      method: "DELETE",
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Artikel belum berhasil dihapus.");
      setIsSubmitting(false);
      return;
    }

    const nextArticles = articles.filter((item) => item.id !== draft.id);
    setArticles(nextArticles);
    selectArticle(nextArticles[0] ?? null);
    setMessage(result.message ?? "Artikel berhasil dihapus.");
    setIsSubmitting(false);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <aside className="rounded-[2rem] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-bold text-[var(--on-surface)]">Artikel Supabase</h3>
            <p className="mt-1 text-sm leading-7 text-[var(--on-surface-variant)]">
              {articles.length > 0
                ? `${articles.length} artikel ada di database.`
                : "Belum ada artikel di Supabase."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => selectArticle(null)}
            className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
          >
            Artikel Baru
          </button>
        </div>

        <div className="mt-5 grid gap-3">
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Cari judul, slug, kategori"
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          />
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | "draft" | "published")
            }
            className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          >
            <option value="all">Semua status</option>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="mt-6 space-y-3">
          {filteredArticles.length > 0 ? (
            filteredArticles.map((article) => (
              <button
                key={article.id ?? article.slug}
                type="button"
                onClick={() => selectArticle(article)}
                className={`block w-full rounded-[1.5rem] px-4 py-4 text-left transition-colors ${
                  selectedArticle?.id === article.id
                    ? "bg-[var(--primary-container)]/45"
                    : "bg-[var(--surface-container-low)]"
                }`}
              >
                <p className="text-sm font-semibold text-[var(--on-surface)]">{article.title}</p>
                <p className="mt-1 text-xs text-[var(--on-surface-variant)]">
                  /{article.slug} - {article.status}
                </p>
              </button>
            ))
          ) : (
            <div className="rounded-[1.5rem] bg-[var(--surface-container-low)] px-4 py-4 text-sm text-[var(--on-surface-variant)]">
              Tidak ada artikel yang cocok dengan filter.
            </div>
          )}
        </div>
      </aside>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <form onSubmit={saveArticle} className="space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                Article Editor
              </p>
              <h3 className="mt-3 text-[2.2rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
                {draft.title || "Artikel baru"}
              </h3>
            </div>

            <button
              type="button"
              onClick={deleteArticle}
              className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
            >
              Hapus
            </button>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {[
              ["title", "Judul"],
              ["slug", "Slug"],
              ["category", "Kategori"],
              ["publishedDate", "Tanggal Publish"],
              ["readTime", "Read Time"],
              ["author", "Author"],
              ["authorRole", "Author Role"],
              ["imageAlt", "Image Alt"],
              ["seoTitle", "SEO Title"],
              ["metaDescription", "Meta Description"],
              ["canonicalUrl", "Canonical URL"],
            ].map(([key, label]) => (
              <div key={key} className="space-y-2">
                <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                  {label}
                </label>
                <input
                  value={String(draft[key as keyof ArticleEditorRecord] ?? "")}
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
            label="Gambar Artikel"
            value={draft.imageUrl}
            onChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                imageUrl: nextValue,
              }))
            }
            placeholder="/artikel/artikel-1.png"
            helpText="Bisa isi path lokal seperti /artikel/artikel-1.png atau upload langsung dari file explorer."
            uploadTag="artikel"
            uploadAltText={draft.imageAlt || draft.title}
          />

          <MediaUrlField
            label="Gambar OG"
            value={draft.ogImageUrl}
            onChange={(nextValue) =>
              setDraft((current) => ({
                ...current,
                ogImageUrl: nextValue,
              }))
            }
            placeholder="/artikel/artikel-1.png"
            helpText="Opsional. Bisa pakai gambar yang sama atau upload file khusus untuk preview sosial media."
            uploadTag="artikel"
            uploadAltText={draft.imageAlt || draft.title}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
                Status
              </label>
              <select
                value={draft.status}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    status: event.target.value as "draft" | "published",
                  }))
                }
                className="w-full rounded-[1.25rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              >
                <option value="draft">draft</option>
                <option value="published">published</option>
              </select>
            </div>

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
              Featured article
            </label>
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Excerpt
            </label>
            <textarea
              rows={3}
              value={draft.excerpt}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  excerpt: event.target.value,
                }))
              }
              className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Intro
            </label>
            <textarea
              rows={4}
              value={draft.intro}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  intro: event.target.value,
                }))
              }
              className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-[var(--on-surface-variant)]">
              Quote
            </label>
            <textarea
              rows={3}
              value={draft.quote}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  quote: event.target.value,
                }))
              }
              className="w-full rounded-[1.5rem] border border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
            />
          </div>

          <section className="space-y-4 rounded-[1.75rem] border border-[var(--outline-variant)]/25 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-[var(--primary)]">Tags</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Gunakan chip editor dan drag-and-drop untuk ubah urutan tag.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    tags: [...current.tags, ""],
                  }))
                }
                className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
              >
                Tambah Tag
              </button>
            </div>

            <div className="space-y-3">
              {draft.tags.map((tag, index) => (
                <div
                  key={`${tag}-${index}`}
                  draggable
                  onDragStart={() => setDraggedTagIndex(index)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedTagIndex === null) {
                      return;
                    }

                    setDraft((current) => ({
                      ...current,
                      tags: moveItem(current.tags, draggedTagIndex, index),
                    }));
                    setDraggedTagIndex(null);
                  }}
                  onDragEnd={() => setDraggedTagIndex(null)}
                  className="flex items-center gap-3 rounded-[1.25rem] bg-[var(--surface-container-low)] p-4"
                >
                  <div className="cursor-grab rounded-full bg-white p-2 text-[var(--on-surface-variant)]">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <input
                    value={tag}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        tags: current.tags.map((currentTag, currentIndex) =>
                          currentIndex === index ? event.target.value : currentTag,
                        ),
                      }))
                    }
                    placeholder="Tag artikel"
                    className="flex-1 rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        tags: current.tags.filter((_, currentIndex) => currentIndex !== index),
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
                <h3 className="text-lg font-bold text-[var(--primary)]">Sections</h3>
                <p className="mt-1 text-sm text-[var(--on-surface-variant)]">
                  Drag-and-drop untuk ubah urutan section artikel.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  setDraft((current) => ({
                    ...current,
                    sections: [...current.sections, { heading: "", paragraphs: [""] }],
                  }))
                }
                className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--on-primary)]"
              >
                Tambah Section
              </button>
            </div>

            <div className="space-y-4">
              {draft.sections.map((section, sectionIndex) => (
                <div
                  key={`${section.heading}-${sectionIndex}`}
                  draggable
                  onDragStart={() => setDraggedSectionIndex(sectionIndex)}
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={() => {
                    if (draggedSectionIndex === null) {
                      return;
                    }

                    setDraft((current) => ({
                      ...current,
                      sections: moveItem(current.sections, draggedSectionIndex, sectionIndex),
                    }));
                    setDraggedSectionIndex(null);
                  }}
                  onDragEnd={() => setDraggedSectionIndex(null)}
                  className="space-y-4 rounded-[1.5rem] bg-[var(--surface-container-low)] p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex min-w-[240px] flex-1 items-center gap-3">
                      <div className="cursor-grab rounded-full bg-white p-2 text-[var(--on-surface-variant)]">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <input
                        value={section.heading}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            sections: current.sections.map((currentSection, currentIndex) =>
                              currentIndex === sectionIndex
                                ? { ...currentSection, heading: event.target.value }
                                : currentSection,
                            ),
                          }))
                        }
                        placeholder="Section heading"
                        className="min-w-[180px] flex-1 rounded-[1rem] border border-[var(--outline-variant)]/25 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          sections: current.sections.filter(
                            (_, currentIndex) => currentIndex !== sectionIndex,
                          ),
                        }))
                      }
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600"
                    >
                      Hapus Section
                    </button>
                  </div>

                  <div className="space-y-3">
                    {section.paragraphs.map((paragraph, paragraphIndex) => (
                      <div
                        key={`${paragraphIndex}-${paragraph.slice(0, 10)}`}
                        className="space-y-2 rounded-[1rem] bg-white p-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-semibold text-[var(--on-surface)]">
                            Paragraph {paragraphIndex + 1}
                          </p>
                          <button
                            type="button"
                            onClick={() =>
                              setDraft((current) => ({
                                ...current,
                                sections: current.sections.map((currentSection, currentIndex) =>
                                  currentIndex === sectionIndex
                                    ? {
                                        ...currentSection,
                                        paragraphs: currentSection.paragraphs.filter(
                                          (_, currentParagraphIndex) =>
                                            currentParagraphIndex !== paragraphIndex,
                                        ),
                                      }
                                    : currentSection,
                                ),
                              }))
                            }
                            className="rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-600"
                          >
                            Hapus
                          </button>
                        </div>
                        <textarea
                          rows={4}
                          value={paragraph}
                          onChange={(event) =>
                            setDraft((current) => ({
                              ...current,
                              sections: current.sections.map((currentSection, currentIndex) =>
                                currentIndex === sectionIndex
                                  ? {
                                      ...currentSection,
                                      paragraphs: currentSection.paragraphs.map(
                                        (currentParagraph, currentParagraphIndex) =>
                                          currentParagraphIndex === paragraphIndex
                                            ? event.target.value
                                            : currentParagraph,
                                      ),
                                    }
                                  : currentSection,
                              ),
                            }))
                          }
                          className="w-full rounded-[1rem] border border-[var(--outline-variant)]/20 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDraft((current) => ({
                        ...current,
                        sections: current.sections.map((currentSection, currentIndex) =>
                          currentIndex === sectionIndex
                            ? {
                                ...currentSection,
                                paragraphs: [...currentSection.paragraphs, ""],
                              }
                            : currentSection,
                        ),
                      }))
                    }
                    className="rounded-full border border-[var(--outline-variant)]/30 px-4 py-2 text-sm font-semibold text-[var(--on-surface)]"
                  >
                    Tambah Paragraph
                  </button>
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
            {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
          </button>
        </form>
      </section>
    </div>
  );
}
