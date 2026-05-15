import { ProductCard } from "@/components/ProductCard";
import type { Product } from "@/lib/products";

type ProductsCatalogPageContentProps = {
  products: Product[];
};

export function ProductsCatalogPageContent({
  products,
}: ProductsCatalogPageContentProps) {
  return (
    <section className="container-shell py-20">
      <header className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--primary)]">
          Kembunk Collection
        </p>
        <h1 className="mt-5 text-[clamp(2.8rem,6vw,5rem)] font-extrabold tracking-[-0.05em] text-[var(--on-surface)]">
          Kembunk Collection
        </h1>
        <p className="mt-4 text-lg leading-8 text-[var(--on-surface-variant)]">
          Stay Hydrated, Stay Kembunk.
        </p>
      </header>

      {products.length > 0 ? (
        <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="mx-auto mt-16 max-w-2xl rounded-[2rem] border border-dashed border-[var(--outline-variant)]/40 bg-white/70 px-8 py-14 text-center shadow-[0_24px_60px_-28px_rgba(30,52,43,0.12)]">
          <h2 className="text-2xl font-bold text-[var(--on-surface)]">
            Produk belum tersedia
          </h2>
          <p className="mt-3 text-base leading-7 text-[var(--on-surface-variant)]">
            Jalankan seed produk atau aktifkan produk dari Supabase supaya katalog Kembunk tampil di sini.
          </p>
        </div>
      )}
    </section>
  );
}
