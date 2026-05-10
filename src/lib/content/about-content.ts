import { getSupabaseServerClient } from "@/lib/supabase/server";

export type AboutSectionContent = {
  eyebrow: string;
  title: string;
  description: string;
  imageUrl: string;
  quoteText: string;
  extra: Record<string, unknown>;
};

export type AboutValueItem = {
  title: string;
  description: string;
  iconKey: string;
  themeKey: string;
};

export type AboutPageContent = {
  sections: Record<string, AboutSectionContent>;
  values: AboutValueItem[];
};

type AboutSectionRow = {
  section_key: string;
  eyebrow: string | null;
  title: string | null;
  description: string | null;
  image_url: string | null;
  quote_text: string | null;
  extra_json: Record<string, unknown> | null;
};

type AboutValueRow = {
  title: string;
  description: string | null;
  icon_key: string | null;
  theme_key: string | null;
  sort_order: number;
};

const fallbackContent: AboutPageContent = {
  sections: {
    story: {
      eyebrow: "Cerita Kembung",
      title: "Berawal dari Kamar Kos yang Berantakan.",
      description:
        "Kembung lahir bukan di ruang rapat mewah, tapi di sebuah kamar kos sempit di Bandung. Lelah dengan botol minum yang membosankan dan cepat rusak, kami memutuskan untuk menciptakan sesuatu yang tidak hanya menghidrasi tubuh, tapi juga menyegarkan mata dan jiwa.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBeyseFTjiP5_eTf5uRgheNzP2WsU6kr2raSbc2OfqS4glPhnd9pK94UbFI9FC71yAljBs5i2-FHvqetVmdzzRRxxxVFFWV1n1_Fj_6FwQIgOKHAyFtUdognCYpPgCBTWmxc3iaOsaRR2o6c9aF8e6i_DA78hLVA6cwkj_EuS1T0fWHIe7jpOK4-HLZhI_CVkgdSz0dwswbSg_O8S55s6gadysgJ292czhWyMU7wtBrzoz_tZtkHMewz4Hz3_Rml88mYM673H6fEPA4",
      quoteText: "\"Hidrasi itu harusnya seru, bukan tugas.\"",
      extra: {},
    },
    mission: {
      eyebrow: "Misi Kita",
      title: "Misi kami? Gak ada yang mati gaya gara-gara kurang minum.",
      description:
        "Kami ingin menghapus stigma kalau bawa botol minum itu ribet atau \"tua.\" Di Kembung, kami bikin hidrasi jadi bagian dari gaya hidup kamu yang dinamis, kreatif, dan penuh warna. Kami ingin kamu merasa puas, sampai \"kembung\" dalam arti yang paling menyenangkan.",
      imageUrl: "",
      quoteText: "",
      extra: {
        highlights: [
          { iconKey: "droplets", label: "Perfectly Hydrated" },
          { iconKey: "smile", label: "Joyful Vibe" },
        ],
      },
    },
    values_intro: {
      eyebrow: "",
      title: "Kenapa Pilih Kembung?",
      description: "Tiga alasan kenapa kita bakal jadi sahabat baru tas kamu.",
      imageUrl: "",
      quoteText: "",
      extra: {},
    },
    final: {
      eyebrow: "",
      title: "Bukan Sekadar Botol. Tapi Teman Perjalanan.",
      description:
        "Kami percaya setiap tegukan adalah momen kecil untuk reset. Apapun mimpimu, menyelesaikan skripsi, membangun startup, atau sekadar jalan-jalan sore, Kembung ada di sana untuk memastikan kamu tetap segar.",
      imageUrl:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDgGJsYFGkrOIGft8isJpupeekaPjTq0SEDgwtYGi6nbq9AdkwCKQ2i4bqpmUgO_hIklh6AUw4mahA0LfM3m6iWMZRJMLNhdUsMz2nZElHYwmYYGVPXxvhrSrpQWRgIDJfk0V1X1LljLy2l9xGeHYRGtSrAbkwkNVxa_VIHS43TO-Cb--jPUB0jVlHlPVTbb60i3ly4EssFmxeRhI6rbSqd6HOMfQOSry4LayKnb9RF7ZR8BOfhpOZIO6LqZ_lNPL2hHgLtfAwziNDd",
      quoteText: "",
      extra: {},
    },
  },
  values: [
    {
      title: "Aesthetic Banget",
      description:
        "Desain minimalis dengan warna-warna pastel yang dikurasi khusus buat melengkapi OOTD kamu setiap hari.",
      iconKey: "paint-brush",
      themeKey: "primary",
    },
    {
      title: "Dibuat Awet",
      description:
        "Bahan stainless steel grade premium yang tahan banting, anti karat, dan menjaga suhu air sampai 24 jam.",
      iconKey: "shield",
      themeKey: "secondary",
    },
    {
      title: "Sayang Bumi",
      description:
        "Setiap botol Kembung membantu mengurangi ribuan botol plastik sekali pakai di lautan kita.",
      iconKey: "leaf",
      themeKey: "tertiary",
    },
  ],
};

function mergeSections(rows: AboutSectionRow[]) {
  return Object.fromEntries(
    Object.entries(fallbackContent.sections).map(([key, fallbackSection]) => {
      const row = rows.find((item) => item.section_key === key);

      return [
        key,
        {
          eyebrow: row?.eyebrow ?? fallbackSection.eyebrow,
          title: row?.title ?? fallbackSection.title,
          description: row?.description ?? fallbackSection.description,
          imageUrl: row?.image_url ?? fallbackSection.imageUrl,
          quoteText: row?.quote_text ?? fallbackSection.quoteText,
          extra: {
            ...fallbackSection.extra,
            ...(row?.extra_json ?? {}),
          },
        },
      ];
    }),
  ) as Record<string, AboutSectionContent>;
}

export async function getAboutPageContent(): Promise<AboutPageContent> {
  try {
    const supabase = await getSupabaseServerClient();
    const [sectionsResult, valuesResult] = await Promise.all([
      supabase
        .from("about_page_sections")
        .select("section_key, eyebrow, title, description, image_url, quote_text, extra_json")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("about_values")
        .select("title, description, icon_key, theme_key, sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true }),
    ]);

    return {
      sections: mergeSections((sectionsResult.data ?? []) as AboutSectionRow[]),
      values:
        (valuesResult.data as AboutValueRow[] | null)?.map((item) => ({
          title: item.title,
          description: item.description ?? "",
          iconKey: item.icon_key ?? "leaf",
          themeKey: item.theme_key ?? "primary",
        })) ?? fallbackContent.values,
    };
  } catch {
    return fallbackContent;
  }
}

export function getAboutPagePrefill(content: AboutPageContent) {
  return {
    story: content.sections.story,
    mission: content.sections.mission,
    valuesIntro: content.sections.values_intro,
    final: content.sections.final,
    values: content.values,
  };
}
