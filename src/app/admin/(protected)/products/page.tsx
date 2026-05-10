import { ProductsAdminClient } from "@/components/admin/products-admin-client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  price: number | string;
  short_description: string | null;
  description: string | null;
  image_url: string | null;
  badge: string | null;
  seo_title: string | null;
  meta_description: string | null;
  wa_template: string | null;
  whatsapp_message_template: string | null;
  sort_order: number;
  is_active: boolean;
  is_featured: boolean;
  product_features?: { text: string; sort_order: number }[];
  product_colors?: { name: string; sort_order: number }[];
  product_audiences?: { text: string; sort_order: number }[];
  product_gallery?: { image_url: string; alt_text: string | null; sort_order: number }[];
  product_specs?: { label: string; value: string; sort_order: number }[];
};

function sortByOrder<T extends { sort_order: number }>(items: T[] = []) {
  return [...items].sort((left, right) => left.sort_order - right.sort_order);
}

async function getAdminProducts() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("products")
    .select(
      `
        id,
        slug,
        name,
        category,
        price,
        short_description,
        description,
        image_url,
        badge,
        seo_title,
        meta_description,
        wa_template,
        whatsapp_message_template,
        sort_order,
        is_active,
        is_featured,
        product_features(text, sort_order),
        product_colors(name, sort_order),
        product_audiences(text, sort_order),
        product_gallery(image_url, alt_text, sort_order),
        product_specs(label, value, sort_order)
      `,
    )
    .order("sort_order", { ascending: true });

  return ((data as ProductRow[] | null) ?? []).map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    category: item.category,
    price: String(item.price ?? ""),
    shortDescription: item.short_description ?? "",
    description: item.description ?? "",
    imageUrl: item.image_url ?? "",
    badge: item.badge ?? "",
    seoTitle: item.seo_title ?? "",
    metaDescription: item.meta_description ?? "",
    whatsappMessageTemplate: item.wa_template ?? item.whatsapp_message_template ?? "",
    sortOrder: item.sort_order ?? 0,
    isActive: item.is_active ?? true,
    isFeatured: item.is_featured ?? false,
    features: sortByOrder(item.product_features).map((feature) => feature.text),
    colors: sortByOrder(item.product_colors).map((color) => color.name),
    audiences: sortByOrder(item.product_audiences).map((audience) => audience.text),
    gallery: sortByOrder(item.product_gallery).map((galleryItem) => ({
      imageUrl: galleryItem.image_url,
      altText: galleryItem.alt_text ?? item.name,
    })),
    specs: sortByOrder(item.product_specs).map((spec) => ({
      label: spec.label,
      value: spec.value,
    })),
  }));
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          CRUD Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Products
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Editor awal ini sudah menangani field utama produk dan relasi penting seperti
          features, specs, colors, audiences, dan gallery. Jadi modul produk sekarang sudah
          bisa dipakai untuk migrasi konten dari data lokal ke Supabase.
        </p>
      </div>

      <ProductsAdminClient initialProducts={products} />
    </section>
  );
}
