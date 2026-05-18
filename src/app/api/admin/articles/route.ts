import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getArticleOrderConfig } from "@/lib/content/article-order";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ArticlePayload = {
  id?: string;
  slug?: string;
  title?: string;
  category?: string;
  excerpt?: string;
  seoTitle?: string;
  metaDescription?: string;
  publishedDate?: string;
  readTime?: string;
  author?: string;
  authorRole?: string;
  imageUrl?: string;
  imageAlt?: string;
  intro?: string;
  quote?: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  status?: "draft" | "published";
  isFeatured?: boolean;
  tags?: string[];
  sections?: { heading: string; paragraphs: string[] }[];
};

async function assertAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  return getRoleFromClaims(data?.claims ?? null) === "admin";
}

function normalizeTags(items: string[] = []) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function normalizeSections(items: { heading: string; paragraphs: string[] }[] = []) {
  return items
    .map((section) => ({
      heading: section.heading.trim(),
      paragraphs: section.paragraphs.map((paragraph) => paragraph.trim()).filter(Boolean),
    }))
    .filter((section) => section.heading && section.paragraphs.length > 0);
}

function revalidateArticlePaths(slug: string, previousSlug?: string | null) {
  revalidatePath("/artikel");

  if (previousSlug) {
    revalidatePath(`/artikel/${previousSlug}`);
  }

  revalidatePath(`/artikel/${slug}`);
  revalidatePath("/admin/articles");
}

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ArticlePayload;
    const slug = body.slug?.trim();
    const title = body.title?.trim();
    const category = body.category?.trim();

    if (!slug || !title || !category) {
      return NextResponse.json(
        { message: "Slug, judul, dan kategori artikel wajib diisi." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    let previousSlug: string | null = null;

    if (body.id) {
      const { data: existingArticle } = await supabase
        .from("articles")
        .select("slug")
        .eq("id", body.id)
        .maybeSingle();
      previousSlug = existingArticle?.slug ?? null;
    }

    const { data: savedArticle, error } = await supabase
      .from("articles")
      .upsert(
        {
          id: body.id,
          slug,
          title,
          category,
          excerpt: body.excerpt?.trim() || null,
          seo_title: body.seoTitle?.trim() || null,
          meta_description: body.metaDescription?.trim() || null,
          published_date: body.publishedDate?.trim() || null,
          read_time: body.readTime?.trim() || null,
          author: body.author?.trim() || null,
          author_role: body.authorRole?.trim() || null,
          image_url: body.imageUrl?.trim() || null,
          image_alt: body.imageAlt?.trim() || null,
          intro: body.intro?.trim() || null,
          quote: body.quote?.trim() || null,
          canonical_url: body.canonicalUrl?.trim() || null,
          og_image_url: body.ogImageUrl?.trim() || null,
          status: body.status ?? "draft",
          is_featured: body.isFeatured ?? false,
        },
        { onConflict: "id" },
      )
      .select("id, slug")
      .single();

    if (error || !savedArticle) {
      throw error;
    }

    const articleId = savedArticle.id;
    const articleOrderConfig = await getArticleOrderConfig(supabase);
    const tags = normalizeTags(body.tags);
    const sections = normalizeSections(body.sections);

    await supabase.from("article_tags").delete().eq("article_id", articleId);

    const { data: existingSections } = await supabase
      .from("article_sections")
      .select("id")
      .eq("article_id", articleId);

    if (existingSections && existingSections.length > 0) {
      const sectionIds = existingSections.map((section) => section.id);
      await supabase.from("article_section_paragraphs").delete().in("section_id", sectionIds);
    }

    await supabase.from("article_sections").delete().eq("article_id", articleId);

    if (tags.length > 0) {
      const { error: tagsError } = await supabase.from("article_tags").insert(
        tags.map((tag, index) => ({
          article_id: articleId,
          tag,
          sort_order: index,
        })),
      );

      if (tagsError) {
        throw tagsError;
      }
    }

    for (const [sectionIndex, section] of sections.entries()) {
      const { data: savedSection, error: sectionError } = await supabase
        .from("article_sections")
        .insert({
          article_id: articleId,
          heading: section.heading,
          sort_order: sectionIndex,
        })
        .select("id")
        .single();

      if (sectionError || !savedSection) {
        throw sectionError;
      }

      const { error: paragraphsError } = await supabase
        .from("article_section_paragraphs")
        .insert(
          section.paragraphs.map((content, paragraphIndex) => ({
            section_id: savedSection.id,
            content,
            sort_order: paragraphIndex,
          })),
        );

      if (paragraphsError) {
        throw paragraphsError;
      }
    }

    if (
      articleOrderConfig.rowId &&
      previousSlug &&
      previousSlug !== savedArticle.slug &&
      articleOrderConfig.orderedSlugs.includes(previousSlug)
    ) {
      const { error: articleOrderError } = await supabase
        .from("homepage_sections")
        .update({
          extra_json: {
            orderedSlugs: articleOrderConfig.orderedSlugs.map((currentSlug) =>
              currentSlug === previousSlug ? savedArticle.slug : currentSlug,
            ),
          },
        })
        .eq("id", articleOrderConfig.rowId);

      if (articleOrderError) {
        throw articleOrderError;
      }
    }

    revalidateArticlePaths(savedArticle.slug, previousSlug);

    return NextResponse.json({
      message: "Artikel berhasil disimpan.",
      id: articleId,
    });
  } catch (error) {
    console.error("Saving article failed", error);

    return NextResponse.json(
      { message: "Artikel belum berhasil disimpan." },
      { status: 500 },
    );
  }
}

export async function DELETE(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "ID artikel belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: existingArticle, error: existingError } = await supabase
      .from("articles")
      .select("slug")
      .eq("id", id)
      .single();

    if (existingError || !existingArticle) {
      throw existingError;
    }

    const { error } = await supabase.from("articles").delete().eq("id", id);

    if (error) {
      throw error;
    }

    const articleOrderConfig = await getArticleOrderConfig(supabase);

    if (articleOrderConfig.rowId && articleOrderConfig.orderedSlugs.includes(existingArticle.slug)) {
      const { error: articleOrderError } = await supabase
        .from("homepage_sections")
        .update({
          extra_json: {
            orderedSlugs: articleOrderConfig.orderedSlugs.filter(
              (slug) => slug !== existingArticle.slug,
            ),
          },
        })
        .eq("id", articleOrderConfig.rowId);

      if (articleOrderError) {
        throw articleOrderError;
      }
    }

    revalidateArticlePaths(existingArticle.slug, existingArticle.slug);

    return NextResponse.json({ message: "Artikel berhasil dihapus." });
  } catch (error) {
    console.error("Deleting article failed", error);

    return NextResponse.json(
      { message: "Artikel belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
