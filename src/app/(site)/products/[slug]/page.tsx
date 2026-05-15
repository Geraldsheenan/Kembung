import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductDetailPageContent } from "@/components/products/product-detail-page-content";
import { getProductBySlug, getProducts } from "@/lib/products";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Produk tidak ditemukan",
      description: "Produk Kembunk yang kamu cari belum tersedia.",
    };
  }

  return {
    title: product.seoTitle || product.name,
    description: product.metaDescription || product.shortDescription,
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailPageContent product={product} collectionHref="/products" />;
}
