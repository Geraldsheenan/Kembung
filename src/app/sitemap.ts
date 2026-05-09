import type { MetadataRoute } from "next";
import { articles, branches, products, SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/tentang-kami",
    "/cabang",
    "/produk",
    "/artikel",
    "/hubungi-kami",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${SITE.url}${route}`,
      lastModified: new Date(),
    })),
    ...branches.map((branch) => ({
      url: `${SITE.url}/cabang/${branch.slug}`,
      lastModified: new Date(),
    })),
    ...products.map((product) => ({
      url: `${SITE.url}/produk/${product.slug}`,
      lastModified: new Date(),
    })),
    ...articles.map((article) => ({
      url: `${SITE.url}/artikel/${article.slug}`,
      lastModified: new Date(article.date),
    })),
  ];
}
