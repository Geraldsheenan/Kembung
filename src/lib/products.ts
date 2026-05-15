import { createClient } from "@supabase/supabase-js";
import { getSupabaseBrowserClient } from "@/lib/supabase/browser";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductGalleryItem = {
  imageUrl: string;
  altText: string;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  badge: string | null;
  seoTitle: string | null;
  metaDescription: string | null;
  waTemplate: string | null;
  imageUrl: string;
  sortOrder: number;
  isActive: boolean;
  isFeatured: boolean;
  shortDescription: string;
  description: string;
  features: string[];
  colors: string[];
  audiences: string[];
  galleryUrls: string[];
  galleryItems: ProductGalleryItem[];
  specs: ProductSpec[];
};

type ProductRow = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  price: number | string | null;
  badge: string | null;
  seo_title: string | null;
  meta_description: string | null;
  wa_template: string | null;
  whatsapp_message_template?: string | null;
  image_url: string | null;
  sort_order: number | null;
  is_active: boolean | null;
  is_featured: boolean | null;
  short_description: string | null;
  description: string | null;
  features: string[] | null;
  colors: string[] | null;
  audiences: string[] | null;
  gallery_urls: string[] | null;
  specs: ProductSpec[] | null;
  product_features?: { text: string; sort_order: number }[] | null;
  product_colors?: { name: string; sort_order: number }[] | null;
  product_audiences?: { text: string; sort_order: number }[] | null;
  product_gallery?: { image_url: string; alt_text: string | null; sort_order: number }[] | null;
  product_specs?: { label: string; value: string; sort_order: number }[] | null;
};

const extendedSelectClause = `
  id,
  name,
  slug,
  category,
  price,
  badge,
  seo_title,
  meta_description,
  wa_template,
  whatsapp_message_template,
  image_url,
  sort_order,
  is_active,
  is_featured,
  short_description,
  description,
  features,
  colors,
  audiences,
  gallery_urls,
  specs,
  product_features(text, sort_order),
  product_colors(name, sort_order),
  product_audiences(text, sort_order),
  product_gallery(image_url, alt_text, sort_order),
  product_specs(label, value, sort_order)
`;

const legacySelectClause = `
  id,
  name,
  slug,
  category,
  price,
  badge,
  seo_title,
  meta_description,
  whatsapp_message_template,
  image_url,
  sort_order,
  is_active,
  is_featured,
  short_description,
  description,
  product_features(text, sort_order),
  product_colors(name, sort_order),
  product_audiences(text, sort_order),
  product_gallery(image_url, alt_text, sort_order),
  product_specs(label, value, sort_order)
`;

function sortByOrder<T extends { sort_order: number }>(items: T[] | null | undefined) {
  return [...(items ?? [])].sort((left, right) => left.sort_order - right.sort_order);
}

function normalizePrice(price: number | string | null | undefined) {
  if (typeof price === "number" && Number.isFinite(price)) {
    return price;
  }

  if (typeof price === "string") {
    const parsed = Number(price.replace(/[^\d]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

function normalizeSpecs(
  specs: ProductSpec[] | null | undefined,
  relationalSpecs: ProductRow["product_specs"],
) {
  if (Array.isArray(specs) && specs.length > 0) {
    return specs
      .map((item) => ({
        label: item.label?.trim() ?? "",
        value: item.value?.trim() ?? "",
      }))
      .filter((item) => item.label && item.value);
  }

  return sortByOrder(relationalSpecs).map((item) => ({
    label: item.label,
    value: item.value,
  }));
}

function normalizeGalleryItems(row: ProductRow) {
  const relationalItems = sortByOrder(row.product_gallery).map((item) => ({
    imageUrl: item.image_url,
    altText: item.alt_text ?? row.name,
  }));

  if (relationalItems.length > 0) {
    return relationalItems;
  }

  const urls = row.gallery_urls ?? [];
  return urls.map((imageUrl, index) => ({
    imageUrl,
    altText: `${row.name} view ${index + 1}`,
  }));
}

function mapProductRow(row: ProductRow): Product {
  const features =
    row.features && row.features.length > 0
      ? row.features.filter(Boolean)
      : sortByOrder(row.product_features).map((item) => item.text);
  const colors =
    row.colors && row.colors.length > 0
      ? row.colors.filter(Boolean)
      : sortByOrder(row.product_colors).map((item) => item.name);
  const audiences =
    row.audiences && row.audiences.length > 0
      ? row.audiences.filter(Boolean)
      : sortByOrder(row.product_audiences).map((item) => item.text);
  const galleryItems = normalizeGalleryItems(row);

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    category: row.category?.trim() || "Produk Kembunk",
    price: normalizePrice(row.price),
    badge: row.badge,
    seoTitle: row.seo_title,
    metaDescription: row.meta_description,
    waTemplate: row.wa_template ?? row.whatsapp_message_template ?? null,
    imageUrl: row.image_url || galleryItems[0]?.imageUrl || "/produk/image-1.png",
    sortOrder: row.sort_order ?? 0,
    isActive: row.is_active ?? true,
    isFeatured: row.is_featured ?? false,
    shortDescription: row.short_description ?? "",
    description: row.description ?? "",
    features,
    colors,
    audiences,
    galleryUrls:
      row.gallery_urls && row.gallery_urls.length > 0
        ? row.gallery_urls.filter(Boolean)
        : galleryItems.map((item) => item.imageUrl),
    galleryItems,
    specs: normalizeSpecs(row.specs, row.product_specs),
  };
}

export function createSupabaseProductBrowserClient() {
  return getSupabaseBrowserClient();
}

function createSupabaseProductServerClient() {
  const { url, anonKey } = getSupabasePublicEnv();

  return createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

export async function getProducts() {
  try {
    const supabase = createSupabaseProductServerClient();
    const primaryResult = await supabase
      .from("products")
      .select(extendedSelectClause)
      .eq("is_active", true)
      .order("sort_order", { ascending: true });
    let data = (primaryResult.data as ProductRow[] | null) ?? null;
    let error = primaryResult.error;

    if (primaryResult.error?.code === "42703") {
      const legacyResult = await supabase
        .from("products")
        .select(legacySelectClause)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      data = (legacyResult.data as ProductRow[] | null) ?? null;
      error = legacyResult.error;
    }

    if (error) {
      console.error("Failed to fetch products", error);
      return [];
    }

    return ((data as ProductRow[] | null) ?? []).map(mapProductRow);
  } catch (error) {
    console.error("Unexpected error while fetching products", error);
    return [];
  }
}

export async function getFeaturedProducts() {
  try {
    const supabase = createSupabaseProductServerClient();
    const primaryResult = await supabase
      .from("products")
      .select(extendedSelectClause)
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true });
    let data = (primaryResult.data as ProductRow[] | null) ?? null;
    let error = primaryResult.error;

    if (primaryResult.error?.code === "42703") {
      const legacyResult = await supabase
        .from("products")
        .select(legacySelectClause)
        .eq("is_active", true)
        .eq("is_featured", true)
        .order("sort_order", { ascending: true });
      data = (legacyResult.data as ProductRow[] | null) ?? null;
      error = legacyResult.error;
    }

    if (error) {
      console.error("Failed to fetch featured products", error);
      return [];
    }

    return ((data as ProductRow[] | null) ?? []).map(mapProductRow);
  } catch (error) {
    console.error("Unexpected error while fetching featured products", error);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const supabase = createSupabaseProductServerClient();
    const primaryResult = await supabase
      .from("products")
      .select(extendedSelectClause)
      .eq("slug", slug)
      .eq("is_active", true)
      .maybeSingle();
    let data = (primaryResult.data as ProductRow | null) ?? null;
    let error = primaryResult.error;

    if (primaryResult.error?.code === "42703") {
      const legacyResult = await supabase
        .from("products")
        .select(legacySelectClause)
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      data = (legacyResult.data as ProductRow | null) ?? null;
      error = legacyResult.error;
    }

    if (error) {
      console.error(`Failed to fetch product by slug: ${slug}`, error);
      return null;
    }

    if (!data) {
      return null;
    }

    return mapProductRow(data as ProductRow);
  } catch (error) {
    console.error(`Unexpected error while fetching product slug: ${slug}`, error);
    return null;
  }
}
