import { ArticlesAdminClient } from "@/components/admin/articles-admin-client";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { applyArticleOrder, getArticleOrderConfig } from "@/lib/content/article-order";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type ArticleRow = {
  id: string;
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
  canonical_url: string | null;
  og_image_url: string | null;
  status: "draft" | "published";
  is_featured: boolean;
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

async function getAdminArticles() {
  const supabase = getSupabaseAdminClient();
  const [{ data }, articleOrderConfig] = await Promise.all([
    supabase
      .from("articles")
      .select(
        `
          id,
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
          canonical_url,
          og_image_url,
          status,
          is_featured,
          article_tags(tag, sort_order),
          article_sections(
            heading,
            sort_order,
            article_section_paragraphs(content, sort_order)
          )
        `,
      )
      .order("published_date", { ascending: false, nullsFirst: false }),
    getArticleOrderConfig(supabase),
  ]);

  const mappedArticles = ((data as ArticleRow[] | null) ?? []).map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    category: item.category,
    excerpt: item.excerpt ?? "",
    seoTitle: item.seo_title ?? "",
    metaDescription: item.meta_description ?? "",
    publishedDate: item.published_date ?? "",
    readTime: item.read_time ?? "",
    author: item.author ?? "",
    authorRole: item.author_role ?? "",
    imageUrl: item.image_url ?? "",
    imageAlt: item.image_alt ?? "",
    intro: item.intro ?? "",
    quote: item.quote ?? "",
    canonicalUrl: item.canonical_url ?? "",
    ogImageUrl: item.og_image_url ?? "",
    status: item.status,
    isFeatured: item.is_featured ?? false,
    tags: sortByOrder(item.article_tags).map((tag) => tag.tag),
    sections: sortByOrder(item.article_sections).map((section) => ({
      heading: section.heading,
      paragraphs: sortByOrder(section.article_section_paragraphs).map(
        (paragraph) => paragraph.content,
      ),
    })),
  }));

  return applyArticleOrder(
    mappedArticles,
    articleOrderConfig.orderedSlugs,
    (article) => article.publishedDate,
  );
}

export default async function AdminArticlesPage() {
  const articles = await getAdminArticles();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="Dashboard Foundation"
        title="Articles"
        description="Modul artikel ini sudah menangani status draft atau published, tag, section, paragraf berurutan, dan field SEO penting untuk halaman detail."
      />

      <ArticlesAdminClient initialArticles={articles} />
    </section>
  );
}
