import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

type ProductPayload = {
  id?: string;
  slug?: string;
  name?: string;
  category?: string;
  price?: string | number;
  shortDescription?: string;
  description?: string;
  imageUrl?: string;
  badge?: string;
  seoTitle?: string;
  metaDescription?: string;
  whatsappMessageTemplate?: string;
  sortOrder?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  features?: string[];
  colors?: string[];
  audiences?: string[];
  gallery?: { imageUrl: string; altText: string }[];
  specs?: { label: string; value: string }[];
};

async function assertAdmin() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  return getRoleFromClaims(data?.claims ?? null) === "admin";
}

function normalizeTextList(items: string[] = []) {
  return items.map((item) => item.trim()).filter(Boolean);
}

function normalizePrice(price: string | number | undefined) {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  if (typeof price === "string") {
    const parsed = Number(price.replace(/[^\d]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeSpecs(items: { label: string; value: string }[] = []) {
  return items
    .map((item) => ({
      label: item.label.trim(),
      value: item.value.trim(),
    }))
    .filter((item) => item.label && item.value);
}

function normalizeGallery(items: { imageUrl: string; altText: string }[] = []) {
  return items
    .map((item) => ({
      imageUrl: item.imageUrl.trim(),
      altText: item.altText.trim(),
    }))
    .filter((item) => item.imageUrl);
}

function revalidateProductPaths(slug: string, previousSlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/produk");

  if (previousSlug) {
    revalidatePath(`/produk/${previousSlug}`);
  }

  revalidatePath(`/produk/${slug}`);
  revalidatePath("/admin/products");
}

export async function POST(request: Request) {
  if (!(await assertAdmin())) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as ProductPayload;
    const slug = body.slug?.trim();
    const name = body.name?.trim();

    if (!slug || !name) {
      return NextResponse.json(
        { message: "Slug dan nama produk wajib diisi." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    let previousSlug: string | null = null;

    if (body.id) {
      const { data: existingProduct } = await supabase
        .from("products")
        .select("slug")
        .eq("id", body.id)
        .maybeSingle();
      previousSlug = existingProduct?.slug ?? null;
    }

    const { data: savedProduct, error: productError } = await supabase
      .from("products")
      .upsert(
        {
          id: body.id,
          slug,
          name,
          category: body.category?.trim() || "Uncategorized",
          price: normalizePrice(body.price),
          short_description: body.shortDescription?.trim() || null,
          description: body.description?.trim() || null,
          image_url: body.imageUrl?.trim() || null,
          badge: body.badge?.trim() || null,
          seo_title: body.seoTitle?.trim() || null,
          meta_description: body.metaDescription?.trim() || null,
          wa_template: body.whatsappMessageTemplate?.trim() || null,
          whatsapp_message_template: body.whatsappMessageTemplate?.trim() || null,
          sort_order: Number(body.sortOrder ?? 0),
          is_active: body.isActive ?? true,
          is_featured: body.isFeatured ?? false,
          features: normalizeTextList(body.features),
          colors: normalizeTextList(body.colors),
          audiences: normalizeTextList(body.audiences),
          gallery_urls: normalizeGallery(body.gallery).map((item) => item.imageUrl),
          specs: normalizeSpecs(body.specs),
        },
        { onConflict: "id" },
      )
      .select("id, slug")
      .single();

    if (productError || !savedProduct) {
      throw productError;
    }

    const productId = savedProduct.id;
    const features = normalizeTextList(body.features);
    const colors = normalizeTextList(body.colors);
    const audiences = normalizeTextList(body.audiences);
    const gallery = normalizeGallery(body.gallery);
    const specs = normalizeSpecs(body.specs);

    await Promise.all([
      supabase.from("product_features").delete().eq("product_id", productId),
      supabase.from("product_colors").delete().eq("product_id", productId),
      supabase.from("product_audiences").delete().eq("product_id", productId),
      supabase.from("product_gallery").delete().eq("product_id", productId),
      supabase.from("product_specs").delete().eq("product_id", productId),
    ]);

    if (features.length > 0) {
      const { error } = await supabase.from("product_features").insert(
        features.map((text, index) => ({
          product_id: productId,
          text,
          sort_order: index,
        })),
      );
      if (error) throw error;
    }

    if (colors.length > 0) {
      const { error } = await supabase.from("product_colors").insert(
        colors.map((nameItem, index) => ({
          product_id: productId,
          name: nameItem,
          sort_order: index,
        })),
      );
      if (error) throw error;
    }

    if (audiences.length > 0) {
      const { error } = await supabase.from("product_audiences").insert(
        audiences.map((text, index) => ({
          product_id: productId,
          text,
          sort_order: index,
        })),
      );
      if (error) throw error;
    }

    if (gallery.length > 0) {
      const { error } = await supabase.from("product_gallery").insert(
        gallery.map((item, index) => ({
          product_id: productId,
          image_url: item.imageUrl,
          alt_text: item.altText || name,
          sort_order: index,
        })),
      );
      if (error) throw error;
    }

    if (specs.length > 0) {
      const { error } = await supabase.from("product_specs").insert(
        specs.map((spec, index) => ({
          product_id: productId,
          label: spec.label,
          value: spec.value,
          sort_order: index,
        })),
      );
      if (error) throw error;
    }

    revalidateProductPaths(savedProduct.slug, previousSlug);

    return NextResponse.json({
      message: "Produk berhasil disimpan.",
      id: productId,
    });
  } catch (error) {
    console.error("Saving product failed", error);

    return NextResponse.json(
      { message: "Produk belum berhasil disimpan." },
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
        { message: "ID produk belum dikirim." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdminClient();
    const { data: existingProduct, error: existingError } = await supabase
      .from("products")
      .select("slug")
      .eq("id", id)
      .single();

    if (existingError || !existingProduct) {
      throw existingError;
    }

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      throw error;
    }

    revalidateProductPaths(existingProduct.slug, existingProduct.slug);

    return NextResponse.json({ message: "Produk berhasil dihapus." });
  } catch (error) {
    console.error("Deleting product failed", error);

    return NextResponse.json(
      { message: "Produk belum berhasil dihapus." },
      { status: 500 },
    );
  }
}
