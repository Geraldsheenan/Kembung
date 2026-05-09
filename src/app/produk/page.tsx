import { ProductsCatalog } from "@/components/products/products-catalog";
import { products } from "@/data/site";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Produk",
  description:
    "Katalog produk Kembung: tumbler pastel, tumbler stainless steel, tumbler custom name, travel, daily use, dan gift set.",
  path: "/produk",
});

export default function ProductsPage() {
  return (
    <section className="container-shell py-20">
      <header className="mb-16 text-center md:text-left">
        <h1 className="mb-4 text-[3.5rem] font-extrabold leading-none tracking-[-0.04em] text-[var(--primary)]">
          Katalog Kembung
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-[var(--on-surface-variant)]">
          Temukan tumbler favoritmu untuk menjaga hidrasi tetap ceria. Semua filter
          kategori di bawah ini langsung mengikuti produk yang tersedia saat ini.
        </p>
      </header>

      <ProductsCatalog products={products} />
    </section>
  );
}
