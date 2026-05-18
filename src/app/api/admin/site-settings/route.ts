import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type SiteSettingsPayload = {
  siteName?: string;
  tagline?: string;
  description?: string;
  phoneDisplay?: string;
  phoneInternational?: string;
  siteUrl?: string;
  instagramUrl?: string;
  tiktokUrl?: string;
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
    const body = (await request.json()) as SiteSettingsPayload;
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("site_settings").upsert(
      {
        singleton_key: true,
        site_name: body.siteName?.trim() || "Kembunk",
        tagline: body.tagline?.trim() || null,
        description: body.description?.trim() || null,
        phone_display: body.phoneDisplay?.trim() || null,
        phone_international: body.phoneInternational?.trim() || null,
        site_url: body.siteUrl?.trim() || null,
        instagram_url: body.instagramUrl?.trim() || null,
        tiktok_url: body.tiktokUrl?.trim() || null,
      },
      { onConflict: "singleton_key" },
    );

    if (error) {
      throw error;
    }

    revalidatePath("/", "layout");
    revalidatePath("/admin/site-settings");

    return NextResponse.json({ message: "Site settings berhasil disimpan." });
  } catch (error) {
    console.error("Saving site settings failed", error);

    return NextResponse.json(
      { message: "Site settings belum berhasil disimpan." },
      { status: 500 },
    );
  }
}
