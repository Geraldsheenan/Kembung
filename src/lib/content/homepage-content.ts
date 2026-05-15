import type { Product } from "@/data/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicProducts } from "./product-content";

export type HomepageSectionContent = {
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  extra: Record<string, unknown>;
};

export type HomepageFeaturedProduct = {
  name: string;
  description: string;
  price: string;
  href: string;
  badge?: string;
  image: string;
  background: string;
  label: string;
};

export type HomepageReasonItem = {
  title: string;
  description: string;
  iconKey: string;
  themeKey: string;
};

export type HomepageContent = {
  sections: Record<string, HomepageSectionContent>;
  featured: {
    desktop: HomepageFeaturedProduct[];
    mobile: HomepageFeaturedProduct[];
  };
  reasons: {
    desktop: HomepageReasonItem[];
    mobile: HomepageReasonItem[];
  };
};

type HomepageSectionRow = {
  section_key: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  image_url: string | null;
  primary_cta_label: string | null;
  primary_cta_href: string | null;
  secondary_cta_label: string | null;
  secondary_cta_href: string | null;
  extra_json: Record<string, unknown> | null;
};

type HomepageFeaturedRow = {
  device_type: "desktop" | "mobile";
  label: string | null;
  sort_order: number;
  product_id: string;
};

type HomepageReasonRow = {
  device_type: "desktop" | "mobile";
  title: string;
  description: string | null;
  icon_key: string | null;
  theme_key: string | null;
  sort_order: number;
};

const fallbackContent: HomepageContent = {
  sections: {
    hero: {
      title: "Stay Hydrated, Stay Kembunk",
      subtitle: "New Collection 2026",
      description:
        "Biar gak haus-haus banget, yuk Kembunk bareng! Botol minum gemas yang bikin kamu rajin minum air tanpa usaha lebih.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB9OU844Y3W_-EFcUVfx-4SyQwwD34O6_xVTTU760En1bhkP9ptWqYobzpZcqYQd-5ulrzk2rODJYUshq05J_7sjGqA47-uQv6g_Gj5xSalbXZhDHRWkzA_q8csZS-NgIVvckEHSXNl-nSeqCPU8gQ2bIj3VxW7BCOCTI2v5aGxI7ddV_Nwt97csS_1ANn7Um6GYMkj09ts2LQeaW9GX7A02Z3yAxN9P6cZaLMpmzgleHa8ybCET4VFAWtPTHc3MI6wX_XC724gYZc3",
      primaryCtaLabel: "Cek Koleksi",
      primaryCtaHref: "/produk",
      secondaryCtaLabel: "Chat Admin",
      secondaryCtaHref: "/hubungi-kami",
      extra: {
        mobileBadge: "Perfectly Hydrated",
        mobileTitle: "Gak Cuma Haus,\nTapi Puas.",
        mobileDescription:
          "Reclaim the word \"Kembunk\". It's not about being bloated, it's about being perfectly satisfied and full of life.",
        mobilePrimaryCtaLabel: "Shop Collection",
        mobilePrimaryCtaHref: "/produk",
        mobileImageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuARtjaQZLS6fD9vaWTC-WsDJXN0FS71l74uI8xb5-YmTdtG8egQ3MsyDLez9UwwvBt9x4kXBOg_ct1uckkcnKp-oDpBBsAyHc0bM5FeZnw2wCIuAMdMFJ1rm0ckDyvFUa53nGQ0qNc2xkmThpCCr_oMIgUojMrucBCU-a386aju9UjF-Ux7hIrypVtB5PoTY-iaAYOiqY2RiQIqU8Ch7B5jlft0kUsvAYtejMPfBu23XFD_fbUO4kNmt2clU3iRHiKfX6peiEwAJiam",
      },
    },
    best_sellers_intro: {
      title: "Best Sellers",
      subtitle: "",
      description: "Koleksi favorit paling sering di-checkout!",
      imageUrl: "",
      primaryCtaLabel: "Lihat Semua Produk",
      primaryCtaHref: "/produk",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      extra: {
        mobileCtaLabel: "View All",
      },
    },
    reasons_intro: {
      title: "Kenapa Kembunk?",
      subtitle: "",
      description: "Kita gak cuma jual botol, kita jual kebahagiaan setiap tegukan.",
      imageUrl: "",
      primaryCtaLabel: "",
      primaryCtaHref: "",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      extra: {},
    },
    newsletter_block: {
      title: "Dapetin Info Drop Terbaru!",
      subtitle: "",
      description:
        "Join circle Kembunk dan dapetin promo khusus Gen Z & Creative Professionals setiap bulannya.",
      imageUrl: "",
      primaryCtaLabel: "Daftar",
      primaryCtaHref: "",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      extra: {
        mobileTitle: "Dapetin Info Drop",
        mobileDescription:
          "Jadilah yang pertama tahu saat koleksi terbatas kami rilis. No spam, just joyful hydration.",
        mobileInputPlaceholder: "Email lo apa?",
        mobileButtonLabel: "Gue Mau Join",
        desktopInputPlaceholder: "Email kamu...",
        desktopButtonLabel: "Daftar",
      },
    },
    tiktok_block: {
      title: "Follow TikTok",
      subtitle: "",
      description: "Scan buat liat review jujur & POV Kembunk.",
      imageUrl: "",
      primaryCtaLabel: "@kembunk.official",
      primaryCtaHref: "#",
      secondaryCtaLabel: "",
      secondaryCtaHref: "",
      extra: {},
    },
  },
  featured: {
    desktop: [],
    mobile: [],
  },
  reasons: {
    desktop: [
      {
        title: "BPA Free",
        description: "Material premium yang aman banget buat kesehatan kamu.",
        iconKey: "shield",
        themeKey: "secondary",
      },
      {
        title: "Keep Cold 24h",
        description: "Air es tetep sejuk seharian meskipun di bawah terik matahari.",
        iconKey: "snowflake",
        themeKey: "primary",
      },
      {
        title: "Eco-friendly",
        description: "Kurangi sampah plastik dengan cara yang paling estetik.",
        iconKey: "leaf",
        themeKey: "tertiary",
      },
    ],
    mobile: [
      {
        title: "Eco-Conscious Choice",
        description:
          "Dibuat dari material premium yang tahan lama, mengurangi limbah plastik sekali pakai dengan gaya.",
        iconKey: "leaf",
        themeKey: "surface-wide",
      },
      {
        title: "24H Cold",
        description: "Stay fresh seharian.",
        iconKey: "snowflake",
        themeKey: "secondary",
      },
      {
        title: "Aesthetic",
        description: "Vibrant colors.",
        iconKey: "heart",
        themeKey: "tertiary",
      },
    ],
  },
};

const desktopBackgrounds = [
  "bg-[var(--primary-container)]/10",
  "bg-[var(--secondary-container)]/10",
  "bg-[var(--tertiary-container)]/10",
];

const mobileBackgrounds = [
  "bg-[var(--secondary-container)]",
  "bg-[var(--tertiary-container)]",
  "bg-[var(--primary-container)]",
];

function toSectionMap(rows: HomepageSectionRow[]) {
  return Object.fromEntries(
    rows.map((row) => [
      row.section_key,
      {
        title: row.title ?? "",
        subtitle: row.subtitle ?? "",
        description: row.description ?? "",
        imageUrl: row.image_url ?? "",
        primaryCtaLabel: row.primary_cta_label ?? "",
        primaryCtaHref: row.primary_cta_href ?? "",
        secondaryCtaLabel: row.secondary_cta_label ?? "",
        secondaryCtaHref: row.secondary_cta_href ?? "",
        extra: row.extra_json ?? {},
      },
    ]),
  ) as Record<string, HomepageSectionContent>;
}

function getProductMap(products: Product[]) {
  return new Map(products.map((product) => [product.slug, product]));
}

function inferSlugFromHref(href: string) {
  return href.split("/").filter(Boolean).at(-1) ?? "";
}

function mapFallbackFeatured(products: Product[]) {
  const productMap = getProductMap(products);
  const desktopSource = [
    { slug: "kembunk-pastel-bottle", label: "Hot Pick" },
    { slug: "tumbler-custom-name", label: "" },
    { slug: "tumbler-travel-flask", label: "" },
  ];
  const mobileSource = [
    { slug: "tumbler-travel-flask", label: "" },
    { slug: "tumbler-custom-name", label: "" },
    { slug: "kembunk-pastel-bottle", label: "" },
  ];

  return {
    desktop: desktopSource
      .map((item, index) => {
        const product = productMap.get(item.slug);
        if (!product) return null;
        return {
          name: product.name,
          description: product.shortDescription,
          price: product.price,
          href: `/produk/${product.slug}`,
          badge: item.label || product.badge,
          image: product.image,
          background: desktopBackgrounds[index % desktopBackgrounds.length],
          label: item.label,
        };
      })
      .filter(Boolean) as HomepageFeaturedProduct[],
    mobile: mobileSource
      .map((item, index) => {
        const product = productMap.get(item.slug);
        if (!product) return null;
        return {
          name: product.name,
          description: product.shortDescription,
          price: product.price,
          href: `/produk/${product.slug}`,
          badge: product.badge,
          image: product.gallery[0] ?? product.image,
          background: mobileBackgrounds[index % mobileBackgrounds.length],
          label: item.label,
        };
      })
      .filter(Boolean) as HomepageFeaturedProduct[],
  };
}

function mergeSectionFallbacks(
  sections: Record<string, HomepageSectionContent>,
): Record<string, HomepageSectionContent> {
  return Object.fromEntries(
    Object.entries(fallbackContent.sections).map(([key, fallbackSection]) => [
      key,
      {
        ...fallbackSection,
        ...(sections[key] ?? {}),
        extra: {
          ...fallbackSection.extra,
          ...(sections[key]?.extra ?? {}),
        },
      },
    ]),
  );
}

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const supabase = await getSupabaseServerClient();
    const products = await getPublicProducts();

    const [sectionsResult, featuredResult, reasonsResult] = await Promise.all([
      supabase
        .from("homepage_sections")
        .select(
          "section_key, title, subtitle, description, image_url, primary_cta_label, primary_cta_href, secondary_cta_label, secondary_cta_href, extra_json",
        )
        .eq("is_active", true),
      supabase
        .from("homepage_featured_products")
        .select("product_id, device_type, label, sort_order, products!inner(slug)")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("homepage_reason_items")
        .select("device_type, title, description, icon_key, theme_key, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    const fallbackFeatured = mapFallbackFeatured(products);

    const productMap = new Map(products.map((product) => [product.slug, product]));

    const featuredRows = (featuredResult.data ??
      []) as (HomepageFeaturedRow & { products?: { slug: string } | { slug: string }[] })[];
    const featured = {
      desktop: featuredRows
        .filter((item) => item.device_type === "desktop")
        .map((item, index) => {
          const productRel = Array.isArray(item.products) ? item.products[0] : item.products;
          const slug = productRel?.slug ?? "";
          const product = productMap.get(slug);
          if (!product) return null;
          return {
            name: product.name,
            description: product.shortDescription,
            price: product.price,
            href: `/produk/${product.slug}`,
            badge: item.label || product.badge,
            image: product.image,
            background: desktopBackgrounds[index % desktopBackgrounds.length],
            label: item.label ?? "",
          };
        })
        .filter(Boolean) as HomepageFeaturedProduct[],
      mobile: featuredRows
        .filter((item) => item.device_type === "mobile")
        .map((item, index) => {
          const productRel = Array.isArray(item.products) ? item.products[0] : item.products;
          const slug = productRel?.slug ?? "";
          const product = productMap.get(slug);
          if (!product) return null;
          return {
            name: product.name,
            description: product.shortDescription,
            price: product.price,
            href: `/produk/${product.slug}`,
            badge: product.badge,
            image: product.gallery[0] ?? product.image,
            background: mobileBackgrounds[index % mobileBackgrounds.length],
            label: item.label ?? "",
          };
        })
        .filter(Boolean) as HomepageFeaturedProduct[],
    };

    const reasonsRows = (reasonsResult.data ?? []) as HomepageReasonRow[];
    const reasons = {
      desktop:
        reasonsRows
          .filter((item) => item.device_type === "desktop")
          .map((item) => ({
            title: item.title,
            description: item.description ?? "",
            iconKey: item.icon_key ?? "shield",
            themeKey: item.theme_key ?? "primary",
          })) || [],
      mobile:
        reasonsRows
          .filter((item) => item.device_type === "mobile")
          .map((item) => ({
            title: item.title,
            description: item.description ?? "",
            iconKey: item.icon_key ?? "heart",
            themeKey: item.theme_key ?? "surface-wide",
          })) || [],
    };

    const sectionMap = mergeSectionFallbacks(
      toSectionMap((sectionsResult.data ?? []) as HomepageSectionRow[]),
    );

    return {
      sections: sectionMap,
      featured: {
        desktop: featured.desktop.length > 0 ? featured.desktop : fallbackFeatured.desktop,
        mobile: featured.mobile.length > 0 ? featured.mobile : fallbackFeatured.mobile,
      },
      reasons: {
        desktop: reasons.desktop.length > 0 ? reasons.desktop : fallbackContent.reasons.desktop,
        mobile: reasons.mobile.length > 0 ? reasons.mobile : fallbackContent.reasons.mobile,
      },
    };
  } catch {
    const products = await getPublicProducts();
    return {
      sections: fallbackContent.sections,
      featured: mapFallbackFeatured(products),
      reasons: fallbackContent.reasons,
    };
  }
}

export function getHomepagePrefillFromContent(content: HomepageContent) {
  return {
    hero: content.sections.hero,
    bestSellersIntro: content.sections.best_sellers_intro,
    reasonsIntro: content.sections.reasons_intro,
    newsletterBlock: content.sections.newsletter_block,
    tiktokBlock: content.sections.tiktok_block,
    featuredDesktopSlugs: content.featured.desktop.map((item) => inferSlugFromHref(item.href)),
    featuredMobileSlugs: content.featured.mobile.map((item) => inferSlugFromHref(item.href)),
    desktopReasons: content.reasons.desktop,
    mobileReasons: content.reasons.mobile,
  };
}
