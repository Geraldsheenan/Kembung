import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAuthenticatedAdmin } from "@/lib/admin/authorization";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type SectionEditor = {
  eyebrow?: string;
  title?: string;
  description?: string;
  imageUrl?: string;
  quoteText?: string;
  extra?: Record<string, unknown>;
};

type ValueItem = {
  title: string;
  description: string;
  iconKey: string;
  themeKey: string;
};

type AboutPagePayload = {
  story: SectionEditor;
  mission: SectionEditor;
  valuesIntro: SectionEditor;
  final: SectionEditor;
  values: ValueItem[];
};

function toSectionRow(sectionKey: string, sortOrder: number, value: SectionEditor) {
  return {
    section_key: sectionKey,
    eyebrow: value.eyebrow?.trim() || null,
    title: value.title?.trim() || null,
    description: value.description?.trim() || null,
    image_url: value.imageUrl?.trim() || null,
    quote_text: value.quoteText?.trim() || null,
    extra_json: value.extra ?? {},
    sort_order: sortOrder,
    is_active: true,
  };
}

export async function POST(request: Request) {
  if (!(await isAuthenticatedAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as AboutPagePayload;
    const supabase = getSupabaseAdminClient();

    const sections = [
      toSectionRow("story", 0, body.story),
      toSectionRow("mission", 1, body.mission),
      toSectionRow("values_intro", 2, body.valuesIntro),
      toSectionRow("final", 3, body.final),
    ];

    const { error: sectionError } = await supabase
      .from("about_page_sections")
      .upsert(sections, { onConflict: "section_key" });

    if (sectionError) {
      throw sectionError;
    }

    await supabase.from("about_values").delete().neq("id", "00000000-0000-0000-0000-000000000000");

    const valuesRows = body.values
      .map((item, index) => ({
        title: item.title.trim(),
        description: item.description.trim(),
        icon_key: item.iconKey.trim(),
        theme_key: item.themeKey.trim(),
        sort_order: index,
        is_active: true,
      }))
      .filter((item) => item.title);

    if (valuesRows.length > 0) {
      const { error: valuesError } = await supabase.from("about_values").insert(valuesRows);

      if (valuesError) {
        throw valuesError;
      }
    }

    revalidatePath("/tentang-kami");
    revalidatePath("/admin/about-page");

    return NextResponse.json({ message: "About page berhasil disimpan." });
  } catch (error) {
    console.error("Saving about page failed", error);

    return NextResponse.json(
      { message: "About page belum berhasil disimpan." },
      { status: 500 },
    );
  }
}
