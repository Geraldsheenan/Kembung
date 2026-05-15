import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { AdminSurface } from "@/components/admin/admin-workspace";
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
      <AdminPageIntro
        badge="CRUD Module"
        title="Homepage"
        description="Modul ini mengontrol hero, intro best sellers, reason items, newsletter block, TikTok block, dan urutan produk unggulan yang muncul di homepage publik."
      />

      <AdminSurface className="p-8">
        <HomepageAdminClient
          initialValue={getHomepagePrefillFromContent(homepage)}
          availableProducts={products.map((product) => ({
            slug: product.slug,
            name: product.name,
          }))}
        />
      </AdminSurface>
    </section>
  );
}
