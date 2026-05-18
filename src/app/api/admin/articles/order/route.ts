import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import {
  getArticleOrderConfig,
  getArticleOrderSectionKey,
  normalizeArticleOrderSlugs,
} from "@/lib/content/article-order";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ArticleOrderPayload = {
  slugs?: string[];
};

async function assertAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  return getRoleFromClaims(data?.claims ?? null) === "admin";
}

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ArticleOrderPayload;
    const orderedSlugs = normalizeArticleOrderSlugs(body.slugs);
    const supabase = getSupabaseAdminClient();
    const sectionKey = getArticleOrderSectionKey();
    const existingConfig = await getArticleOrderConfig(supabase);

    if (existingConfig.rowId) {
      const { error } = await supabase
        .from("homepage_sections")
        .update({
          title: "Article Listing Order",
          subtitle: "Admin only",
          description: "Custom urutan artikel untuk halaman listing.",
          extra_json: { orderedSlugs },
          is_active: false,
        })
        .eq("id", existingConfig.rowId);

      if (error) {
        throw error;
      }
    } else {
      const { error } = await supabase.from("homepage_sections").insert({
        section_key: sectionKey,
        title: "Article Listing Order",
        subtitle: "Admin only",
        description: "Custom urutan artikel untuk halaman listing.",
        extra_json: { orderedSlugs },
        is_active: false,
      });

      if (error) {
        throw error;
      }
    }

    revalidatePath("/artikel");
    revalidatePath("/admin/articles");

    return NextResponse.json({ message: "Urutan artikel berhasil disimpan." });
  } catch (error) {
    console.error("Saving article order failed", error);

    return NextResponse.json(
      { message: "Urutan artikel belum berhasil disimpan." },
      { status: 500 },
    );
  }
}
