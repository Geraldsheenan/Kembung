import { ProductsCatalogPageContent } from "@/components/products/products-catalog-page-content";
import { getProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Kembunk Collection",
  description:
    "Stay Hydrated, Stay Kembunk. Temukan koleksi tumbler, bottle, dan travel mug estetik Kembunk yang clean, fun, dan siap untuk daily use.",
  path: "/products",
});

export default async function ProductsCatalogPage() {
  const products = await getProducts();
  return <ProductsCatalogPageContent products={products} />;
}
