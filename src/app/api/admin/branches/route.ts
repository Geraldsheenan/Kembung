import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type BranchPayload = {
  id?: string;
  slug?: string;
  name?: string;
  area?: string;
  badge?: string;
  address?: string;
  shortAddress?: string;
  latitude?: string;
  longitude?: string;
  hours?: string;
  mobileHours?: string;
  description?: string;
  amenity?: string;
  amenityIcon?: string;
  theme?: string;
  mobileSubtitle?: string;
  mobileAddressLine?: string;
  mobileStatus?: string;
  mobileStatusTone?: string;
  mobileFeatureIcon?: string;
  mapUrl?: string;
  mapEmbed?: string;
  imageUrl?: string;
  imageClassName?: string;
  facilities?: string[];
  gallery?: { imageUrl: string; altText: string }[];
  sortOrder?: number;
  isActive?: boolean;
};

async function assertAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  return getRoleFromClaims(data?.claims ?? null) === "admin";
}

function parseCoordinate(value?: string) {
  const trimmed = value?.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeTextList(items: string[] = []) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function normalizeGallery(items: { imageUrl: string; altText: string }[] = []) {
  return items
    .map((item) => ({
      imageUrl: item.imageUrl.trim(),
      altText: item.altText.trim(),
    }))
    .filter((item) => item.imageUrl);
}

function revalidateBranchPaths(slug: string, previousSlug?: string | null) {
  revalidatePath("/cabang");

  if (previousSlug) {
    revalidatePath(`/cabang/${previousSlug}`);
  }

  revalidatePath(`/cabang/${slug}`);
  revalidatePath("/admin/branches");
}

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as BranchPayload;
    const slug = body.slug?.trim();
    const name = body.name?.trim();
    const area = body.area?.trim();
    const address = body.address?.trim();

    if (!slug || !name || !area || !address) {
      return NextResponse.json(
        { message: "Slug, nama, area, dan alamat cabang wajib diisi." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    let previousSlug: string | null = null;

    if (body.id) {
      const { data: existingBranch } = await supabase
        .from("branches")
        .select("slug")
        .eq("id", body.id)
        .maybeSingle();
      previousSlug = existingBranch?.slug ?? null;
    }

    const { data: savedBranch, error } = await supabase
      .from("branches")
      .upsert(
        {
          id: body.id,
          slug,
          name,
          area,
          badge: body.badge?.trim() || null,
          address,
          short_address: body.shortAddress?.trim() || null,
          latitude: parseCoordinate(body.latitude),
          longitude: parseCoordinate(body.longitude),
          hours: body.hours?.trim() || null,
          mobile_hours: body.mobileHours?.trim() || null,
          description: body.description?.trim() || null,
          amenity: body.amenity?.trim() || null,
          amenity_icon: body.amenityIcon?.trim() || null,
          theme: body.theme?.trim() || null,
          mobile_subtitle: body.mobileSubtitle?.trim() || null,
          mobile_address_line: body.mobileAddressLine?.trim() || null,
          mobile_status: body.mobileStatus?.trim() || null,
          mobile_status_tone: body.mobileStatusTone?.trim() || null,
          mobile_feature_icon: body.mobileFeatureIcon?.trim() || null,
          map_url: body.mapUrl?.trim() || null,
          map_embed: body.mapEmbed?.trim() || null,
          image_url: body.imageUrl?.trim() || null,
          image_class_name: body.imageClassName?.trim() || null,
          sort_order: Number(body.sortOrder ?? 0),
          is_active: body.isActive ?? true,
        },
        { onConflict: "id" },
      )
      .select("id, slug")
      .single();

    if (error || !savedBranch) {
      throw error;
    }

    const branchId = savedBranch.id;
    const facilities = normalizeTextList(body.facilities);
    const gallery = normalizeGallery(body.gallery);

    await Promise.all([
      supabase.from("branch_facilities").delete().eq("branch_id", branchId),
      supabase.from("branch_gallery").delete().eq("branch_id", branchId),
    ]);

    if (facilities.length > 0) {
      const { error: facilitiesError } = await supabase.from("branch_facilities").insert(
        facilities.map((text, index) => ({
          branch_id: branchId,
          text,
          sort_order: index,
        })),
      );
      if (facilitiesError) throw facilitiesError;
    }

    if (gallery.length > 0) {
      const { error: galleryError } = await supabase.from("branch_gallery").insert(
        gallery.map((item, index) => ({
          branch_id: branchId,
          image_url: item.imageUrl,
          alt_text: item.altText || name,
          sort_order: index,
        })),
      );
      if (galleryError) throw galleryError;
    }

    revalidateBranchPaths(savedBranch.slug, previousSlug);

    return NextResponse.json({
      message: "Cabang berhasil disimpan.",
      id: savedBranch.id,
    });
  } catch (error) {
    console.error("Saving branch failed", error);

    return NextResponse.json(
      { message: "Cabang belum berhasil disimpan." },
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
        { message: "ID cabang belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: existingBranch, error: existingError } = await supabase
      .from("branches")
      .select("slug")
      .eq("id", id)
      .single();

    if (existingError || !existingBranch) {
      throw existingError;
    }

    const { error } = await supabase.from("branches").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidateBranchPaths(existingBranch.slug, existingBranch.slug);

    return NextResponse.json({ message: "Cabang berhasil dihapus." });
  } catch (error) {
    console.error("Deleting branch failed", error);

    return NextResponse.json(
      { message: "Cabang belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
