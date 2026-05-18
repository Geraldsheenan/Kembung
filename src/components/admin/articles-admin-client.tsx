"use client";

import { ArrowDown, ArrowUp, ChevronsUp, GripVertical } from "lucide-react";
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
  const [draggedArticleId, setDraggedArticleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createDraft, setCreateDraft] = useState({
    title: "",
    slug: "",
    category: "",
    status: "draft" as "draft" | "published",
  });

  const inputClassName = AdminInputClassName();
  const textareaClassName = AdminTextareaClassName();

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

  function openCreateModal() {
    setCreateDraft({
      title: "",
      slug: "",
      category: "",
      status: "draft",
    });
    setIsCreateModalOpen(true);
  }

  function beginCreateArticle() {
    setSelectedId("new");
    setDraft({
      ...emptyArticle(),
      title: createDraft.title,
      slug: createDraft.slug,
      category: createDraft.category,
      status: createDraft.status,
    });
    setMessage(null);
    setErrorMessage(null);
    setIsCreateModalOpen(false);
  }

  async function saveArticleOrder(nextArticles: ArticleEditorRecord[], successMessage: string) {
    setIsSavingOrder(true);
    setMessage(null);
    setErrorMessage(null);

    const response = await fetch("/api/admin/articles/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        slugs: nextArticles
          .filter((article) => article.id)
          .map((article) => article.slug)
          .filter(Boolean),
      }),
    });

    const result = (await response.json()) as { message?: string };

    if (!response.ok) {
      setErrorMessage(result.message ?? "Urutan artikel belum berhasil disimpan.");
      setIsSavingOrder(false);
      return;
    }

    setArticles(nextArticles);
    setMessage(result.message ?? successMessage);
    setIsSavingOrder(false);
  }

  function moveArticlePosition(articleId: string, direction: "top" | "up" | "down") {
    const currentIndex = articles.findIndex((article) => article.id === articleId);

    if (currentIndex === -1) {
      return;
    }

    const targetIndex =
      direction === "top"
        ? 0
        : direction === "up"
          ? currentIndex - 1
          : currentIndex + 1;
    const nextArticles = moveItem(articles, currentIndex, targetIndex);

    if (nextArticles === articles) {
      return;
    }

    void saveArticleOrder(nextArticles, "Urutan artikel berhasil diperbarui.");
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
    <>
      <AdminCreateDialog
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Tambah Artikel"
        description="Mulai dari identitas artikel dulu, lalu lengkapi seluruh isi, section, dan SEO di editor utama."
      >
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ["title", "Judul"],
            ["slug", "Slug"],
            ["category", "Kategori"],
          ].map(([key, label]) => (
            <div key={key} className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">{label}</label>
              <input
                value={createDraft[key as keyof typeof createDraft] as string}
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
          <div className="space-y-2">
            <label className="ml-1 text-sm font-semibold text-slate-600">Status</label>
            <select
              value={createDraft.status}
              onChange={(event) =>
                setCreateDraft((current) => ({
                  ...current,
                  status: event.target.value as "draft" | "published",
                }))
              }
              className={inputClassName}
            >
              <option value="draft">draft</option>
              <option value="published">published</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <AdminGhostButton onClick={() => setIsCreateModalOpen(false)}>Batal</AdminGhostButton>
          <AdminPrimaryButton onClick={beginCreateArticle}>Lanjutkan</AdminPrimaryButton>
        </div>
      </AdminCreateDialog>

      <AdminWorkspaceShell
        sidebar={
          <AdminSidebarPanel>
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Artikel Supabase</h3>
                <p className="mt-1 text-sm leading-7 text-slate-500">
                  {articles.length > 0
                    ? `${articles.length} artikel ada di database.`
                    : "Belum ada artikel di Supabase."}
                </p>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Geser kartu artikel atau pakai tombol panah untuk menentukan artikel pertama,
                  kedua, dan seterusnya di halaman publik.
                </p>
              </div>
              <AdminPrimaryButton onClick={openCreateModal}>Artikel Baru</AdminPrimaryButton>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari judul, slug, kategori"
                className={inputClassName}
              />
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value as "all" | "draft" | "published")
                }
                className={inputClassName}
              >
                <option value="all">Semua status</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div className="mt-6 space-y-3">
              {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <div
                    key={article.id ?? article.slug}
                    draggable={Boolean(article.id)}
                    onDragStart={() => setDraggedArticleId(article.id ?? null)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (!draggedArticleId || !article.id || draggedArticleId === article.id) {
                        return;
                      }

                      const fromIndex = articles.findIndex(
                        (currentArticle) => currentArticle.id === draggedArticleId,
                      );
                      const toIndex = articles.findIndex(
                        (currentArticle) => currentArticle.id === article.id,
                      );

                      if (fromIndex === -1 || toIndex === -1) {
                        return;
                      }

                      void saveArticleOrder(
                        moveItem(articles, fromIndex, toIndex),
                        "Urutan artikel berhasil diperbarui.",
                      );
                      setDraggedArticleId(null);
                    }}
                    onDragEnd={() => setDraggedArticleId(null)}
                    className={`rounded-[1.5rem] border px-4 py-4 transition-colors ${
                      selectedArticle?.id === article.id
                        ? "border-[#c8d5ff] bg-[#eef3ff]"
                        : "border-slate-200 bg-[#f7f8fa]"
                    } ${draggedArticleId === article.id ? "opacity-70" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 cursor-grab rounded-full bg-white/80 p-2 text-slate-400 shadow-sm">
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <button
                        type="button"
                        onClick={() => selectArticle(article)}
                        className="block min-w-0 flex-1 text-left"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-950">{article.title}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              /{article.slug} - {article.status}
                            </p>
                          </div>
                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                              article.status === "published"
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {article.status}
                          </span>
                        </div>
                      </button>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center gap-2 pl-11">
                      <AdminGhostButton
                        className="px-3 py-2 text-xs"
                        disabled={isSavingOrder}
                        onClick={() => article.id && moveArticlePosition(article.id, "top")}
                      >
                        <ChevronsUp className="h-4 w-4" />
                        Paling Atas
                      </AdminGhostButton>
                      <AdminGhostButton
                        className="px-3 py-2 text-xs"
                        disabled={isSavingOrder}
                        onClick={() => article.id && moveArticlePosition(article.id, "up")}
                      >
                        <ArrowUp className="h-4 w-4" />
                        Naik
                      </AdminGhostButton>
                      <AdminGhostButton
                        className="px-3 py-2 text-xs"
                        disabled={isSavingOrder}
                        onClick={() => article.id && moveArticlePosition(article.id, "down")}
                      >
                        <ArrowDown className="h-4 w-4" />
                        Turun
                      </AdminGhostButton>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-dashed border-amber-200 bg-amber-50/70 px-4 py-4 text-sm text-amber-700">
                  Tidak ada artikel yang cocok dengan filter.
                </div>
              )}
            </div>
          </AdminSidebarPanel>
        }
      >
        <AdminCanvasPanel>
          <form onSubmit={saveArticle} className="space-y-6">
            <AdminPanelHeading
              eyebrow="Article Editor"
              title={draft.title || "Artikel baru"}
              description="Editor artikel ini sekarang mengikuti bahasa visual dashboard overview agar pengalaman menulis konten, mengatur status, dan merapikan SEO terasa lebih konsisten."
              action={<AdminDangerButton onClick={deleteArticle}>Hapus</AdminDangerButton>}
            />

            {message ? <AdminFlashMessage tone="success">{message}</AdminFlashMessage> : null}
            {errorMessage ? <AdminFlashMessage tone="error">{errorMessage}</AdminFlashMessage> : null}
            <AdminRichTextNote
              extraNotes={[
                "Sangat cocok untuk excerpt, intro, quote, heading section, dan paragraph artikel.",
                "SEO Title dan Meta Description sebaiknya tetap plain text karena akan dibersihkan saat dipakai untuk metadata.",
                "Urutan artikel publik sekarang bisa diatur dari panel kiri dengan drag-and-drop atau tombol paling atas, naik, dan turun.",
              ]}
            />

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
                  <label className="ml-1 text-sm font-semibold text-slate-600">{label}</label>
                  <input
                    value={String(draft[key as keyof ArticleEditorRecord] ?? "")}
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
                <label className="ml-1 text-sm font-semibold text-slate-600">Status</label>
                <select
                  value={draft.status}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      status: event.target.value as "draft" | "published",
                    }))
                  }
                  className={inputClassName}
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </div>

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
                Featured article
              </label>
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Excerpt</label>
              <textarea
                rows={3}
                value={draft.excerpt}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    excerpt: event.target.value,
                  }))
                }
                className={textareaClassName}
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Intro</label>
              <textarea
                rows={4}
                value={draft.intro}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    intro: event.target.value,
                  }))
                }
                className={textareaClassName}
              />
            </div>

            <div className="space-y-2">
              <label className="ml-1 text-sm font-semibold text-slate-600">Quote</label>
              <textarea
                rows={3}
                value={draft.quote}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    quote: event.target.value,
                  }))
                }
                className={textareaClassName}
              />
            </div>

            <AdminSectionCard
              title="Tags"
              description="Gunakan chip editor dan drag-and-drop untuk ubah urutan tag."
              action={
                <AdminPrimaryButton
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      tags: [...current.tags, ""],
                    }))
                  }
                >
                  Tambah Tag
                </AdminPrimaryButton>
              }
            >
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
                    className="flex items-center gap-3 rounded-[1.25rem] border border-slate-200 bg-white p-4"
                  >
                    <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2 text-slate-500">
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
                      className={`${inputClassName} flex-1`}
                    />
                    <AdminDangerButton
                      onClick={() =>
                        setDraft((current) => ({
                          ...current,
                          tags: current.tags.filter((_, currentIndex) => currentIndex !== index),
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
              title="Sections"
              description="Drag-and-drop untuk ubah urutan section artikel."
              action={
                <AdminPrimaryButton
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      sections: [...current.sections, { heading: "", paragraphs: [""] }],
                    }))
                  }
                >
                  Tambah Section
                </AdminPrimaryButton>
              }
            >
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
                    className="space-y-4 rounded-[1.5rem] border border-slate-200 bg-white p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-[240px] flex-1 items-center gap-3">
                        <div className="cursor-grab rounded-full bg-[#f7f8fa] p-2 text-slate-500">
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
                          className={`${inputClassName} min-w-[180px] flex-1`}
                        />
                      </div>
                      <AdminDangerButton
                        onClick={() =>
                          setDraft((current) => ({
                            ...current,
                            sections: current.sections.filter(
                              (_, currentIndex) => currentIndex !== sectionIndex,
                            ),
                          }))
                        }
                      >
                        Hapus Section
                      </AdminDangerButton>
                    </div>
                    <div className="space-y-3">
                      {section.paragraphs.map((paragraph, paragraphIndex) => (
                        <div
                          key={`${paragraphIndex}-${paragraph.slice(0, 10)}`}
                          className="space-y-2 rounded-[1rem] border border-slate-200 bg-[#fbfcfe] p-4"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-slate-950">
                              Paragraph {paragraphIndex + 1}
                            </p>
                            <AdminDangerButton
                              className="px-3 py-2 text-xs"
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
                            >
                              Hapus
                            </AdminDangerButton>
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
                            className={textareaClassName}
                          />
                        </div>
                      ))}
                    </div>

                    <AdminGhostButton
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
                    >
                      Tambah Paragraph
                    </AdminGhostButton>
                  </div>
                ))}
              </div>
            </AdminSectionCard>

            <AdminPrimaryButton type="submit" disabled={isSubmitting} className="px-6 py-3">
              {isSubmitting ? "Menyimpan..." : "Simpan Artikel"}
            </AdminPrimaryButton>
          </form>
        </AdminCanvasPanel>
      </AdminWorkspaceShell>
    </>
  );
}
