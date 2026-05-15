import { readFileSync } from "node:fs";
import path from "node:path";
import ts from "typescript";
import { createClient } from "@supabase/supabase-js";
import { getRequiredEnv, loadEnvFile } from "./_load-env.mjs";

loadEnvFile();

const supabase = createClient(
  getRequiredEnv("NEXT_PUBLIC_SUPABASE_URL"),
  getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  },
);

async function importSiteData() {
  const filePath = path.resolve(process.cwd(), "src/data/site.ts");
  const source = readFileSync(filePath, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;

  return import(`data:text/javascript;base64,${Buffer.from(transpiled).toString("base64")}`);
}

function sortIndexMap(items) {
  return items.map((item, index) => ({ ...item, sort_order: index }));
}

async function upsertSiteSettings(SITE) {
  const { error } = await supabase.from("site_settings").upsert(
    {
      singleton_key: true,
      site_name: SITE.name,
      tagline: SITE.tagline,
      description: SITE.description,
      phone_display: SITE.phoneDisplay,
      phone_international: SITE.phoneInternational,
      site_url: SITE.url,
      instagram_url: SITE.social.instagram,
      tiktok_url: SITE.social.tiktok,
      logo_url: "/logokembunk.png",
      favicon_url: "/logokembunk.png",
    },
    { onConflict: "singleton_key" },
  );

  if (error) {
    throw error;
  }
}

async function upsertNavigation(navItems) {
  await supabase
    .from("navigation_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  const rows = [
    ...navItems.map((item, index) => ({
      label: item.label,
      href: item.href,
      location: "navbar",
      sort_order: index,
      is_active: true,
    })),
    {
      label: "Branch Locations",
      href: "/cabang",
      location: "footer_help",
      sort_order: 0,
      is_active: true,
    },
    {
      label: "Privacy Policy",
      href: "#",
      location: "footer_help",
      sort_order: 1,
      is_active: true,
    },
    {
      label: "Contact Us",
      href: "/hubungi-kami",
      location: "footer_help",
      sort_order: 2,
      is_active: true,
    },
    {
      label: "Instagram",
      href: "#",
      location: "footer_social",
      sort_order: 0,
      is_active: true,
    },
    {
      label: "TikTok",
      href: "#",
      location: "footer_social",
      sort_order: 1,
      is_active: true,
    },
  ];

  const { error } = await supabase.from("navigation_items").insert(rows);
  if (error) throw error;
}

async function upsertBranches(branches) {
  for (const [index, branch] of branches.entries()) {
    const { data: savedBranch, error } = await supabase
      .from("branches")
      .upsert(
        {
          slug: branch.slug,
          name: branch.name,
          area: branch.area,
          badge: branch.badge,
          address: branch.address,
          short_address: branch.shortAddress ?? null,
          latitude: branch.latitude,
          longitude: branch.longitude,
          hours: branch.hours,
          mobile_hours: branch.mobileHours ?? null,
          description: branch.description,
          amenity: branch.amenity ?? null,
          amenity_icon: branch.amenityIcon ?? null,
          theme: branch.theme ?? null,
          mobile_subtitle: branch.mobileSubtitle ?? null,
          mobile_address_line: branch.mobileAddressLine ?? null,
          mobile_status: branch.mobileStatus ?? null,
          mobile_status_tone: branch.mobileStatusTone ?? null,
          mobile_feature_icon: branch.mobileFeatureIcon ?? null,
          map_url: branch.mapUrl,
          map_embed: branch.mapEmbed,
          image_url: branch.image,
          image_class_name: branch.imageClassName ?? null,
          sort_order: index,
          is_active: true,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error || !savedBranch) {
      throw error;
    }

    const branchId = savedBranch.id;

    await Promise.all([
      supabase.from("branch_facilities").delete().eq("branch_id", branchId),
      supabase.from("branch_gallery").delete().eq("branch_id", branchId),
    ]);

    if (branch.facilities?.length) {
      const { error: facilitiesError } = await supabase
        .from("branch_facilities")
        .insert(
          sortIndexMap(branch.facilities.map((text) => ({ branch_id: branchId, text }))),
        );
      if (facilitiesError) throw facilitiesError;
    }

    if (branch.gallery?.length) {
      const { error: branchGalleryError } = await supabase
        .from("branch_gallery")
        .insert(
          sortIndexMap(
            branch.gallery.map((item) => ({
              branch_id: branchId,
              image_url: item.imageUrl,
              alt_text: item.altText,
            })),
          ),
        );
      if (branchGalleryError) throw branchGalleryError;
    }
  }
}

async function upsertHomepage() {
  const { data: products } = await supabase.from("products").select("id, slug").order("sort_order");
  const productIdBySlug = new Map((products ?? []).map((product) => [product.slug, product.id]));

  const homepageSections = [
    {
      section_key: "hero",
      title: "Stay Hydrated,\nStay Kembunk",
      subtitle: "New Collection 2026",
      description:
        "Biar gak haus-haus banget, yuk Kembunk bareng! Botol minum gemas yang bikin kamu rajin minum air tanpa usaha lebih.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuB9OU844Y3W_-EFcUVfx-4SyQwwD34O6_xVTTU760En1bhkP9ptWqYobzpZcqYQd-5ulrzk2rODJYUshq05J_7sjGqA47-uQv6g_Gj5xSalbXZhDHRWkzA_q8csZS-NgIVvckEHSXNl-nSeqCPU8gQ2bIj3VxW7BCOCTI2v5aGxI7ddV_Nwt97csS_1ANn7Um6GYMkj09ts2LQeaW9GX7A02Z3yAxN9P6cZaLMpmzgleHa8ybCET4VFAWtPTHc3MI6wX_XC724gYZc3",
      primary_cta_label: "Cek Koleksi",
      primary_cta_href: "/produk",
      secondary_cta_label: "Chat Admin",
      secondary_cta_href: "/hubungi-kami",
      extra_json: {
        mobileBadge: "Perfectly Hydrated",
        mobileTitle: "Gak Cuma Haus,\nTapi Puas.",
        mobileDescription:
          "Reclaim the word \"Kembunk\". It's not about being bloated, it's about being perfectly satisfied and full of life.",
        mobilePrimaryCtaLabel: "Shop Collection",
        mobilePrimaryCtaHref: "/produk",
        mobileImageUrl:
          "https://lh3.googleusercontent.com/aida-public/AB6AXuARtjaQZLS6fD9vaWTC-WsDJXN0FS71l74uI8xb5-YmTdtG8egQ3MsyDLez9UwwvBt9x4kXBOg_ct1uckkcnKp-oDpBBsAyHc0bM5FeZnw2wCIuAMdMFJ1rm0ckDyvFUa53nGQ0qNc2xkmThpCCr_oMIgUojMrucBCU-a386aju9UjF-Ux7hIrypVtB5PoTY-iaAYOiqY2RiQIqU8Ch7B5jlft0kUsvAYtejMPfBu23XFD_fbUO4kNmt2clU3iRHiKfX6peiEwAJiam",
      },
      is_active: true,
    },
    {
      section_key: "best_sellers_intro",
      title: "Best Sellers",
      subtitle: "",
      description: "Koleksi favorit paling sering di-checkout!",
      image_url: null,
      primary_cta_label: "Lihat Semua Produk",
      primary_cta_href: "/produk",
      secondary_cta_label: null,
      secondary_cta_href: null,
      extra_json: { mobileCtaLabel: "View All" },
      is_active: true,
    },
    {
      section_key: "reasons_intro",
      title: "Kenapa Kembunk?",
      subtitle: "",
      description: "Kita gak cuma jual botol, kita jual kebahagiaan setiap tegukan.",
      image_url: null,
      primary_cta_label: null,
      primary_cta_href: null,
      secondary_cta_label: null,
      secondary_cta_href: null,
      extra_json: {},
      is_active: true,
    },
    {
      section_key: "newsletter_block",
      title: "Dapetin Info Drop Terbaru!",
      subtitle: "",
      description:
        "Join circle Kembunk dan dapetin promo khusus Gen Z & Creative Professionals setiap bulannya.",
      image_url: null,
      primary_cta_label: "Daftar",
      primary_cta_href: null,
      secondary_cta_label: null,
      secondary_cta_href: null,
      extra_json: {
        mobileTitle: "Dapetin Info Drop",
        mobileDescription:
          "Jadilah yang pertama tahu saat koleksi terbatas kami rilis. No spam, just joyful hydration.",
        mobileInputPlaceholder: "Email lo apa?",
        mobileButtonLabel: "Gue Mau Join",
        desktopInputPlaceholder: "Email kamu...",
        desktopButtonLabel: "Daftar",
      },
      is_active: true,
    },
    {
      section_key: "tiktok_block",
      title: "Follow TikTok",
      subtitle: "",
      description: "Scan buat liat review jujur & POV Kembunk.",
      image_url: null,
      primary_cta_label: "@kembunk.official",
      primary_cta_href: "#",
      secondary_cta_label: null,
      secondary_cta_href: null,
      extra_json: {},
      is_active: true,
    },
  ];

  const { error: sectionsError } = await supabase
    .from("homepage_sections")
    .upsert(homepageSections, { onConflict: "section_key" });
  if (sectionsError) throw sectionsError;

  await supabase
    .from("homepage_featured_products")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  const featuredRows = [
    { slug: "kembunk-pastel-bottle", device_type: "desktop", label: "Hot Pick", sort_order: 0 },
    { slug: "tumbler-custom-name", device_type: "desktop", label: null, sort_order: 1 },
    { slug: "tumbler-travel-flask", device_type: "desktop", label: null, sort_order: 2 },
    { slug: "tumbler-travel-flask", device_type: "mobile", label: null, sort_order: 0 },
    { slug: "tumbler-custom-name", device_type: "mobile", label: null, sort_order: 1 },
    { slug: "kembunk-pastel-bottle", device_type: "mobile", label: null, sort_order: 2 },
  ]
    .map((item) => ({
      product_id: productIdBySlug.get(item.slug),
      device_type: item.device_type,
      label: item.label,
      sort_order: item.sort_order,
      is_active: true,
    }))
    .filter((item) => item.product_id);

  if (featuredRows.length > 0) {
    const { error: featuredError } = await supabase
      .from("homepage_featured_products")
      .insert(featuredRows);
    if (featuredError) throw featuredError;
  }

  await supabase
    .from("homepage_reason_items")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  const reasonRows = [
    {
      device_type: "desktop",
      title: "BPA Free",
      description: "Material premium yang aman banget buat kesehatan kamu.",
      icon_key: "shield",
      theme_key: "secondary",
      sort_order: 0,
      is_active: true,
    },
    {
      device_type: "desktop",
      title: "Keep Cold 24h",
      description: "Air es tetep sejuk seharian meskipun di bawah terik matahari.",
      icon_key: "snowflake",
      theme_key: "primary",
      sort_order: 1,
      is_active: true,
    },
    {
      device_type: "desktop",
      title: "Eco-friendly",
      description: "Kurangi sampah plastik dengan cara yang paling estetik.",
      icon_key: "leaf",
      theme_key: "tertiary",
      sort_order: 2,
      is_active: true,
    },
    {
      device_type: "mobile",
      title: "Eco-Conscious Choice",
      description:
        "Dibuat dari material premium yang tahan lama, mengurangi limbah plastik sekali pakai dengan gaya.",
      icon_key: "leaf",
      theme_key: "surface-wide",
      sort_order: 0,
      is_active: true,
    },
    {
      device_type: "mobile",
      title: "24H Cold",
      description: "Stay fresh seharian.",
      icon_key: "snowflake",
      theme_key: "secondary",
      sort_order: 1,
      is_active: true,
    },
    {
      device_type: "mobile",
      title: "Aesthetic",
      description: "Vibrant colors.",
      icon_key: "heart",
      theme_key: "tertiary",
      sort_order: 2,
      is_active: true,
    },
  ];

  const { error: reasonsError } = await supabase
    .from("homepage_reason_items")
    .insert(reasonRows);
  if (reasonsError) throw reasonsError;
}

async function upsertAboutPage() {
  const aboutSections = [
    {
      section_key: "story",
      eyebrow: "Cerita Kembunk",
      title: "Berawal dari Kamar Kos yang Berantakan.",
      description:
        "Kembunk lahir bukan di ruang rapat mewah, tapi di sebuah kamar kos sempit di Bandung. Lelah dengan botol minum yang membosankan dan cepat rusak, kami memutuskan untuk menciptakan sesuatu yang tidak hanya menghidrasi tubuh, tapi juga menyegarkan mata dan jiwa.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBeyseFTjiP5_eTf5uRgheNzP2WsU6kr2raSbc2OfqS4glPhnd9pK94UbFI9FC71yAljBs5i2-FHvqetVmdzzRRxxxVFFWV1n1_Fj_6FwQIgOKHAyFtUdognCYpPgCBTWmxc3iaOsaRR2o6c9aF8e6i_DA78hLVA6cwkj_EuS1T0fWHIe7jpOK4-HLZhI_CVkgdSz0dwswbSg_O8S55s6gadysgJ292czhWyMU7wtBrzoz_tZtkHMewz4Hz3_Rml88mYM673H6fEPA4",
      quote_text: "\"Hidrasi itu harusnya seru, bukan tugas.\"",
      extra_json: {},
      sort_order: 0,
      is_active: true,
    },
    {
      section_key: "mission",
      eyebrow: "Misi Kita",
      title: "Misi kami? Gak ada yang mati gaya gara-gara kurang minum.",
      description:
        "Kami ingin menghapus stigma kalau bawa botol minum itu ribet atau tua. Di Kembunk, kami bikin hidrasi jadi bagian dari gaya hidup kamu yang dinamis, kreatif, dan penuh warna.",
      image_url: null,
      quote_text: null,
      extra_json: {
        highlights: [
          { iconKey: "droplets", label: "Perfectly Hydrated" },
          { iconKey: "smile", label: "Joyful Vibe" },
        ],
      },
      sort_order: 1,
      is_active: true,
    },
    {
      section_key: "values_intro",
      eyebrow: "",
      title: "Kenapa Pilih Kembunk?",
      description: "Tiga alasan kenapa kita bakal jadi sahabat baru tas kamu.",
      image_url: null,
      quote_text: null,
      extra_json: {},
      sort_order: 2,
      is_active: true,
    },
    {
      section_key: "final",
      eyebrow: "",
      title: "Bukan Sekadar Botol. Tapi Teman Perjalanan.",
      description:
        "Kami percaya setiap tegukan adalah momen kecil untuk reset. Apapun mimpimu, Kembunk ada di sana untuk memastikan kamu tetap segar.",
      image_url:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGJsYFGkrOIGft8isJpupeekaPjTq0SEDgwtYGi6nbq9AdkwCKQ2i4bqpmUgO_hIklh6AUw4mahA0LfM3m6iWMZRJMLNhdUsMz2nZElHYwmYYGVPXxvhrSrpQWRgIDJfk0V1X1LljLy2l9xGeHYRGtSrAbkwkNVxa_VIHS43TO-Cb--jPUB0jVlHlPVTbb60i3ly4EssFmxeRhI6rbSqd6HOMfQOSry4LayKnb9RF7ZR8BOfhpOZIO6LqZ_lNPL2hHgLtfAwziNDd",
      quote_text: null,
      extra_json: {},
      sort_order: 3,
      is_active: true,
    },
  ];

  const { error: sectionsError } = await supabase
    .from("about_page_sections")
    .upsert(aboutSections, { onConflict: "section_key" });
  if (sectionsError) throw sectionsError;

  await supabase
    .from("about_values")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  const values = [
    {
      title: "Aesthetic Banget",
      description:
        "Desain minimalis dengan warna-warna pastel yang dikurasi khusus buat melengkapi OOTD kamu setiap hari.",
      icon_key: "paint-brush",
      theme_key: "primary",
      sort_order: 0,
      is_active: true,
    },
    {
      title: "Dibuat Awet",
      description:
        "Bahan stainless steel grade premium yang tahan banting, anti karat, dan menjaga suhu air sampai 24 jam.",
      icon_key: "shield",
      theme_key: "secondary",
      sort_order: 1,
      is_active: true,
    },
    {
      title: "Sayang Bumi",
      description:
        "Setiap botol Kembunk membantu mengurangi ribuan botol plastik sekali pakai di lautan kita.",
      icon_key: "leaf",
      theme_key: "tertiary",
      sort_order: 2,
      is_active: true,
    },
  ];

  const { error: valuesError } = await supabase.from("about_values").insert(values);
  if (valuesError) throw valuesError;
}

async function upsertContactPage() {
  const { data: siteSettings } = await supabase
    .from("site_settings")
    .select("site_name, phone_display, site_url, instagram_url, tiktok_url")
    .limit(1)
    .maybeSingle();

  const payload = {
    singleton_key: true,
    title: "Hubungi Kami",
    description:
      "Punya pertanyaan, kritik, saran, atau ingin bekerja sama dengan Kembunk? Tim kami siap membantu Anda dengan senang hati.",
    whatsapp_card_title: "Butuh Balasan Cepat?",
    whatsapp_card_description:
      "Hubungi tim Kembunk via WhatsApp untuk pertanyaan produk, kerja sama, atau bantuan order.",
    studio_label: "Alamat",
    studio_address: "Jl. Lodan Raya No. 2\nAncol, Jakarta Utara, DKI Jakarta",
    studio_map_image_url: "/ancol.jpg",
    instagram_url: siteSettings?.instagram_url ?? "#",
    tiktok_url: siteSettings?.tiktok_url ?? "#",
    address_label: "Alamat",
    address_text: "Jl. Lodan Raya No. 2\nAncol, Jakarta Utara, DKI Jakarta",
    phone_label: "Nomor Telepon",
    phone_number: siteSettings?.phone_display ?? "+62 812-3456-7890",
    email_label: "Email",
    email_address: "hello@kembunk.store",
    website_label: "Website",
    website_url: siteSettings?.site_url ?? "https://kembunk.store",
    website_text: `${siteSettings?.site_name ?? "Kembunk"} Official Website`,
    social_media_label: "Social Media",
    instagram_handle: "@kembunk.id",
    tiktok_handle: "@kembunk.id",
    operational_hours_title: "Jam Operasional",
    weekday_hours: "Senin - Jumat : 09.00 - 17.00 WIB",
    saturday_hours: "Sabtu : 09.00 - 14.00 WIB",
    holiday_hours: "Minggu & Hari Libur : Tutup",
    form_title: "Form Contact",
    form_description: "Isi form berikut dan tim Kembunk akan segera menghubungi kamu.",
    closing_statement:
      "Kepuasan dan kenyamanan pelanggan adalah prioritas utama kami. Terima kasih telah menghubungi Kembunk!",
  };

  const { error } = await supabase
    .from("contact_page_settings")
    .upsert(payload, { onConflict: "singleton_key" });

  if (error) throw error;
}

async function upsertProducts(products) {
  for (const [index, product] of products.entries()) {
    const { data: savedProduct, error } = await supabase
      .from("products")
      .upsert(
        {
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: Number(String(product.price).replace(/[^\d]/g, "")),
          short_description: product.shortDescription,
          description: product.description,
          image_url: product.image,
          badge: product.badge ?? null,
          wa_template:
            `Halo, saya mau beli ${product.name}. Apakah produknya masih tersedia?`,
          features: product.features,
          colors: product.colors,
          audiences: product.audience,
          gallery_urls: product.gallery,
          specs: product.specs,
          sort_order: index,
          is_active: true,
          is_featured: index === 0,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error || !savedProduct) {
      throw error;
    }

    const productId = savedProduct.id;

    await Promise.all([
      supabase.from("product_features").delete().eq("product_id", productId),
      supabase.from("product_colors").delete().eq("product_id", productId),
      supabase.from("product_audiences").delete().eq("product_id", productId),
      supabase.from("product_gallery").delete().eq("product_id", productId),
      supabase.from("product_specs").delete().eq("product_id", productId),
    ]);

    if (product.features.length > 0) {
      const { error: featuresError } = await supabase
        .from("product_features")
        .insert(sortIndexMap(product.features.map((text) => ({ product_id: productId, text }))));
      if (featuresError) throw featuresError;
    }

    if (product.colors.length > 0) {
      const { error: colorsError } = await supabase
        .from("product_colors")
        .insert(sortIndexMap(product.colors.map((name) => ({ product_id: productId, name }))));
      if (colorsError) throw colorsError;
    }

    if (product.audience.length > 0) {
      const { error: audiencesError } = await supabase
        .from("product_audiences")
        .insert(sortIndexMap(product.audience.map((text) => ({ product_id: productId, text }))));
      if (audiencesError) throw audiencesError;
    }

    if (product.gallery.length > 0) {
      const { error: galleryError } = await supabase.from("product_gallery").insert(
        sortIndexMap(
          product.gallery.map((image_url) => ({
            product_id: productId,
            image_url,
            alt_text:
              product.galleryItems?.find((item) => item.imageUrl === image_url)?.altText ??
              product.name,
          })),
        ),
      );
      if (galleryError) throw galleryError;
    }

    if (product.specs.length > 0) {
      const { error: specsError } = await supabase.from("product_specs").insert(
        sortIndexMap(
          product.specs.map((spec) => ({
            product_id: productId,
            label: spec.label,
            value: spec.value,
          })),
        ),
      );
      if (specsError) throw specsError;
    }
  }
}

async function upsertArticles(articles) {
  for (const article of articles) {
    const { data: savedArticle, error } = await supabase
      .from("articles")
      .upsert(
        {
          slug: article.slug,
          title: article.title,
          category: article.category,
          excerpt: article.excerpt,
          seo_title: article.seoTitle,
          meta_description: article.metaDescription,
          published_date: article.date,
          read_time: article.readTime,
          author: article.author,
          author_role: article.authorRole,
          image_url: article.image,
          image_alt: article.imageAlt,
          intro: article.intro,
          quote: article.quote ?? null,
          status: "published",
          is_featured: articles[0]?.slug === article.slug,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();

    if (error || !savedArticle) {
      throw error;
    }

    const articleId = savedArticle.id;

    await supabase.from("article_tags").delete().eq("article_id", articleId);

    const { data: existingSections } = await supabase
      .from("article_sections")
      .select("id")
      .eq("article_id", articleId);

    if (existingSections && existingSections.length > 0) {
      const sectionIds = existingSections.map((section) => section.id);
      await supabase.from("article_section_paragraphs").delete().in("section_id", sectionIds);
    }

    await supabase.from("article_sections").delete().eq("article_id", articleId);

    if (article.tags.length > 0) {
      const { error: tagsError } = await supabase.from("article_tags").insert(
        sortIndexMap(article.tags.map((tag) => ({ article_id: articleId, tag }))),
      );
      if (tagsError) throw tagsError;
    }

    for (const [sectionIndex, section] of article.sections.entries()) {
      const { data: savedSection, error: sectionError } = await supabase
        .from("article_sections")
        .insert({
          article_id: articleId,
          heading: section.heading,
          sort_order: sectionIndex,
        })
        .select("id")
        .single();

      if (sectionError || !savedSection) {
        throw sectionError;
      }

      const { error: paragraphsError } = await supabase
        .from("article_section_paragraphs")
        .insert(
          sortIndexMap(
            section.paragraphs.map((content) => ({
              section_id: savedSection.id,
              content,
            })),
          ),
        );

      if (paragraphsError) throw paragraphsError;
    }
  }
}

async function run() {
  const { SITE, navItems, products, branches, articles } = await importSiteData();

  await upsertSiteSettings(SITE);
  await upsertNavigation(navItems);
  await upsertProducts(products);
  await upsertBranches(branches);
  await upsertArticles(articles);
  await upsertHomepage();
  await upsertAboutPage();
  await upsertContactPage();

  console.log("Seed completed:");
  console.log(`- site_settings: 1 row`);
  console.log(`- navigation_items: ${navItems.length + 5}`);
  console.log(`- products: ${products.length}`);
  console.log(`- branches: ${branches.length}`);
  console.log(`- articles: ${articles.length}`);
  console.log(`- homepage_sections: 5`);
  console.log(`- about_page_sections: 4`);
  console.log(`- about_values: 3`);
  console.log(`- contact_page_settings: 1 row`);
}

run().catch((error) => {
  console.error("Failed to seed Supabase content.");
  console.error(error);
  process.exit(1);
});
