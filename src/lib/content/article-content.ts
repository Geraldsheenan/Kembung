import { articles as fallbackArticles, type Article } from "@/data/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseArticleRow = {
  slug: string;
  title: string;
  category: string;
  excerpt: string | null;
  seo_title: string | null;
  meta_description: string | null;
  published_date: string | null;
  read_time: string | null;
  author: string | null;
  author_role: string | null;
  image_url: string | null;
  image_alt: string | null;
  intro: string | null;
  quote: string | null;
  article_tags?: { tag: string; sort_order: number }[];
  article_sections?: {
    heading: string;
    sort_order: number;
    article_section_paragraphs?: { content: string; sort_order: number }[];
  }[];
};

function sortByOrder<T extends { sort_order: number }>(items: T[] = []) {
  return [...items].sort((left, right) => left.sort_order - right.sort_order);
}

function mapArticleRow(row: SupabaseArticleRow): Article {
  const sections = sortByOrder(row.article_sections).map((section) => ({
    heading: section.heading,
    paragraphs: sortByOrder(section.article_section_paragraphs).map(
      (paragraph) => paragraph.content,
    ),
  }));

  return {
    slug: row.slug,
    title: row.title,
    category: row.category,
    excerpt: row.excerpt ?? "",
    seoTitle: row.seo_title ?? row.title,
    metaDescription: row.meta_description ?? row.excerpt ?? "",
    date: row.published_date ?? new Date().toISOString().slice(0, 10),
    readTime: row.read_time ?? "",
    author: row.author ?? "",
    authorRole: row.author_role ?? "",
    image: row.image_url ?? "/logokembung.png",
    imageAlt: row.image_alt ?? row.title,
    intro: row.intro ?? "",
    quote: row.quote ?? undefined,
    tags: sortByOrder(row.article_tags).map((tag) => tag.tag),
    sections,
    content: [row.intro ?? "", ...sections.flatMap((section) => section.paragraphs)].filter(
      Boolean,
    ),
  };
}

async function getSupabaseArticles() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select(
      `
        slug,
        title,
        category,
        excerpt,
        seo_title,
        meta_description,
        published_date,
        read_time,
        author,
        author_role,
        image_url,
        image_alt,
        intro,
        quote,
        article_tags(tag, sort_order),
        article_sections(
          heading,
          sort_order,
          article_section_paragraphs(content, sort_order)
        )
      `,
    )
    .eq("status", "published")
    .order("published_date", { ascending: false });

  if (error || !data || data.length === 0) {
    return null;
  }

  return (data as SupabaseArticleRow[]).map(mapArticleRow);
}

export async function getPublicArticles(): Promise<Article[]> {
  try {
    const data = await getSupabaseArticles();
    return data ?? fallbackArticles;
  } catch {
    return fallbackArticles;
  }
}

export async function getPublicArticleSlugs(): Promise<{ slug: string }[]> {
  const articles = await getPublicArticles();
  return articles.map((article) => ({ slug: article.slug }));
}

export async function getPublicArticleBySlug(slug: string): Promise<Article | null> {
  const articles = await getPublicArticles();
  return articles.find((article) => article.slug === slug) ?? null;
}
