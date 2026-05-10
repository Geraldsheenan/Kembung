import { HomepageAdminClient } from "@/components/admin/homepage-admin-client";
import {
  getHomepageContent,
  getHomepagePrefillFromContent,
} from "@/lib/content/homepage-content";
import { getPublicProducts } from "@/lib/content/product-content";

export default async function AdminHomepagePage() {
  const [homepage, products] = await Promise.all([
    getHomepageContent(),
    getPublicProducts(),
  ]);

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
          CRUD Module
        </p>
        <h2 className="mt-4 text-[2.4rem] font-extrabold tracking-[-0.04em] text-[var(--primary)]">
          Homepage
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-8 text-[var(--on-surface-variant)]">
          Modul ini mengontrol hero, intro best sellers, reason items, newsletter block,
          TikTok block, dan urutan produk unggulan yang muncul di homepage publik.
        </p>
      </div>

      <div className="rounded-[2rem] bg-white p-8 shadow-[0_24px_60px_-28px_rgba(30,52,43,0.18)]">
        <HomepageAdminClient
          initialValue={getHomepagePrefillFromContent(homepage)}
          availableProducts={products.map((product) => ({
            slug: product.slug,
            name: product.name,
          }))}
        />
      </div>
    </section>
  );
}
