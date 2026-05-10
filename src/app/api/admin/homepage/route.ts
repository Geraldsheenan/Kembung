import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type SectionEditor = {
  title?: string;
  subtitle?: string;
  description?: string;
  imageUrl?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  extra?: Record<string, unknown>;
};

type ReasonItem = {
  title: string;
  description: string;
  iconKey: string;
  themeKey: string;
};

type HomepagePayload = {
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

function toSectionRow(sectionKey: string, value: SectionEditor) {
  return {
    section_key: sectionKey,
    title: value.title?.trim() || null,
    subtitle: value.subtitle?.trim() || null,
    description: value.description?.trim() || null,
    image_url: value.imageUrl?.trim() || null,
    primary_cta_label: value.primaryCtaLabel?.trim() || null,
    primary_cta_href: value.primaryCtaHref?.trim() || null,
    secondary_cta_label: value.secondaryCtaLabel?.trim() || null,
    secondary_cta_href: value.secondaryCtaHref?.trim() || null,
    extra_json: value.extra ?? {},
    is_active: true,
  };
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as HomepagePayload;
    const supabase = getSupabaseAdminClient();

    const sections = [
      toSectionRow("hero", body.hero),
      toSectionRow("best_sellers_intro", body.bestSellersIntro),
      toSectionRow("reasons_intro", body.reasonsIntro),
      toSectionRow("newsletter_block", body.newsletterBlock),
      toSectionRow("tiktok_block", body.tiktokBlock),
    ];

    const { error: sectionsError } = await supabase
      .from("homepage_sections")
      .upsert(sections, { onConflict: "section_key" });

    if (sectionsError) {
      throw sectionsError;
    }

    const allSlugs = [...body.featuredDesktopSlugs, ...body.featuredMobileSlugs];
    const { data: products, error: productsError } = await supabase
      .from("products")
      .select("id, slug")
      .in("slug", allSlugs.length > 0 ? allSlugs : ["__empty__"]);

    if (productsError) {
      throw productsError;
    }

    const productIdBySlug = new Map((products ?? []).map((product) => [product.slug, product.id]));

    await supabase.from("homepage_featured_products").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const featuredRows = [
      ...body.featuredDesktopSlugs.map((slug, index) => ({
        product_id: productIdBySlug.get(slug),
        device_type: "desktop" as const,
        label: index === 0 ? "Hot Pick" : null,
        sort_order: index,
        is_active: true,
      })),
      ...body.featuredMobileSlugs.map((slug, index) => ({
        product_id: productIdBySlug.get(slug),
        device_type: "mobile" as const,
        label: null,
        sort_order: index,
        is_active: true,
      })),
    ].filter((item) => item.product_id);

    if (featuredRows.length > 0) {
      const { error: featuredError } = await supabase
        .from("homepage_featured_products")
        .insert(featuredRows);

      if (featuredError) {
        throw featuredError;
      }
    }

    await supabase.from("homepage_reason_items").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const reasonsRows = [
      ...body.desktopReasons.map((item, index) => ({
        device_type: "desktop" as const,
        title: item.title.trim(),
        description: item.description.trim(),
        icon_key: item.iconKey.trim(),
        theme_key: item.themeKey.trim(),
        sort_order: index,
        is_active: true,
      })),
      ...body.mobileReasons.map((item, index) => ({
        device_type: "mobile" as const,
        title: item.title.trim(),
        description: item.description.trim(),
        icon_key: item.iconKey.trim(),
        theme_key: item.themeKey.trim(),
        sort_order: index,
        is_active: true,
      })),
    ].filter((item) => item.title);

    if (reasonsRows.length > 0) {
      const { error: reasonsError } = await supabase
        .from("homepage_reason_items")
        .insert(reasonsRows);

      if (reasonsError) {
        throw reasonsError;
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/homepage");

    return NextResponse.json({ message: "Homepage berhasil disimpan." });
  } catch (error) {
    console.error("Saving homepage failed", error);

    return NextResponse.json(
      { message: "Homepage belum berhasil disimpan." },
      { status: 500 },
    );
  }
}
