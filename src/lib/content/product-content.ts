import type { Product as LegacyProduct } from "@/data/site";
import { formatRupiah } from "@/lib/format";
import {
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
} from "@/lib/products";

function mapProductToLegacyProduct(product: Awaited<ReturnType<typeof getProductBySlug>> extends infer T
  ? Exclude<T, null>
  : never): LegacyProduct {
  return {
    slug: product.slug,
    name: product.name,
    category: product.category,
    price: formatRupiah(product.price),
    shortDescription: product.shortDescription,
    description: product.description,
    image: product.imageUrl,
    badge: product.badge ?? undefined,
    features: product.features,
    colors: product.colors,
    audience: product.audiences,
    specs: product.specs,
    gallery: product.galleryUrls,
    galleryItems: product.galleryItems,
  };
}

export async function getPublicProducts(): Promise<LegacyProduct[]> {
  const products = await getProducts();
  return products.map(mapProductToLegacyProduct);
}

export async function getPublicFeaturedProducts(): Promise<LegacyProduct[]> {
  const products = await getFeaturedProducts();
  return products.map(mapProductToLegacyProduct);
}

export async function getPublicProductSlugs(): Promise<{ slug: string }[]> {
  const products = await getPublicProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function getPublicProductBySlug(slug: string): Promise<LegacyProduct | null> {
  const product = await getProductBySlug(slug);
  return product ? mapProductToLegacyProduct(product) : null;
}
