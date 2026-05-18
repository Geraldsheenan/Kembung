import { getSupabaseServerClient } from "@/lib/supabase/server";
import { getPublicSiteSettings } from "./site-content";

export type ContactPageSettingsContent = {
  title: string;
  description: string;
  whatsappCardTitle: string;
  whatsappCardDescription: string;
  addressLabel: string;
  address: string;
  phoneLabel: string;
  phoneNumber: string;
  emailLabel: string;
  emailAddress: string;
  websiteLabel: string;
  websiteUrl: string;
  websiteText: string;
  socialMediaLabel: string;
  studioMapImageUrl: string;
  instagramHandle: string;
  instagramUrl: string;
  tiktokHandle: string;
  tiktokUrl: string;
  operationalHoursTitle: string;
  weekdayHours: string;
  saturdayHours: string;
  holidayHours: string;
  formTitle: string;
  formDescription: string;
  closingStatement: string;
};

const fallbackContent: ContactPageSettingsContent = {
  title: "Hubungi Kami",
  description:
    "Punya pertanyaan, kritik, saran, atau ingin bekerja sama dengan Kembunk? Tim kami siap membantu Anda dengan senang hati.",
  whatsappCardTitle: "Butuh Balasan Cepat?",
  whatsappCardDescription: "Hubungi tim Kembunk via WhatsApp untuk pertanyaan produk, kerja sama, atau bantuan order.",
  addressLabel: "Alamat",
  address: "Jl. Lodan Raya No. 2\nAncol, Jakarta Utara, DKI Jakarta",
  phoneLabel: "Nomor Telepon",
  phoneNumber: "+62 812-3456-7890",
  emailLabel: "Email",
  emailAddress: "hello@kembunk.store",
  websiteLabel: "Website",
  websiteUrl: "https://kembunk.store",
  websiteText: "Kembunk Official Website",
  socialMediaLabel: "Social Media",
  studioMapImageUrl: "/ancol.jpg",
  instagramHandle: "@kembunk.id",
  instagramUrl: "#",
  tiktokHandle: "@hikembunk",
  tiktokUrl: "https://www.tiktok.com/@hikembunk?_r=1&_t=ZS-96SlJX0oomF",
  operationalHoursTitle: "Jam Operasional",
  weekdayHours: "Senin - Jumat : 09.00 - 17.00 WIB",
  saturdayHours: "Sabtu : 09.00 - 14.00 WIB",
  holidayHours: "Minggu & Hari Libur : Tutup",
  formTitle: "Form Contact",
  formDescription: "Isi form berikut dan tim Kembunk akan segera menghubungi kamu.",
  closingStatement:
    "Kepuasan dan kenyamanan pelanggan adalah prioritas utama kami. Terima kasih telah menghubungi Kembunk!",
};

export async function getContactPageSettings(): Promise<ContactPageSettingsContent> {
  try {
    const supabase = await getSupabaseServerClient();
    const [pageResult, siteSettings] = await Promise.all([
      supabase.from("contact_page_settings").select("*").limit(1).maybeSingle(),
      getPublicSiteSettings(),
    ]);

    const row = pageResult.data as Record<string, string | null> | null;

    if (!row) {
      return {
        ...fallbackContent,
        phoneNumber: siteSettings.phoneDisplay || fallbackContent.phoneNumber,
        websiteUrl: siteSettings.siteUrl || fallbackContent.websiteUrl,
        websiteText: siteSettings.siteName
          ? `${siteSettings.siteName} Official Website`
          : fallbackContent.websiteText,
        instagramUrl: siteSettings.instagramUrl || fallbackContent.instagramUrl,
        tiktokUrl: siteSettings.tiktokUrl || fallbackContent.tiktokUrl,
      };
    }

    return {
      title: row.title ?? fallbackContent.title,
      description: row.description ?? fallbackContent.description,
      whatsappCardTitle: row.whatsapp_card_title ?? fallbackContent.whatsappCardTitle,
      whatsappCardDescription:
        row.whatsapp_card_description ?? fallbackContent.whatsappCardDescription,
      addressLabel: row.address_label ?? row.studio_label ?? fallbackContent.addressLabel,
      address: row.address_text ?? row.studio_address ?? fallbackContent.address,
      phoneLabel: row.phone_label ?? fallbackContent.phoneLabel,
      phoneNumber: row.phone_number ?? siteSettings.phoneDisplay ?? fallbackContent.phoneNumber,
      emailLabel: row.email_label ?? fallbackContent.emailLabel,
      emailAddress: row.email_address ?? fallbackContent.emailAddress,
      websiteLabel: row.website_label ?? fallbackContent.websiteLabel,
      websiteUrl: row.website_url ?? siteSettings.siteUrl ?? fallbackContent.websiteUrl,
      websiteText:
        row.website_text ??
        (siteSettings.siteName ? `${siteSettings.siteName} Official Website` : null) ??
        fallbackContent.websiteText,
      socialMediaLabel: row.social_media_label ?? fallbackContent.socialMediaLabel,
      studioMapImageUrl: row.studio_map_image_url ?? fallbackContent.studioMapImageUrl,
      instagramHandle: row.instagram_handle ?? fallbackContent.instagramHandle,
      instagramUrl:
        row.instagram_url ?? siteSettings.instagramUrl ?? fallbackContent.instagramUrl,
      tiktokHandle: row.tiktok_handle ?? fallbackContent.tiktokHandle,
      tiktokUrl: row.tiktok_url ?? siteSettings.tiktokUrl ?? fallbackContent.tiktokUrl,
      operationalHoursTitle:
        row.operational_hours_title ?? fallbackContent.operationalHoursTitle,
      weekdayHours: row.weekday_hours ?? fallbackContent.weekdayHours,
      saturdayHours: row.saturday_hours ?? fallbackContent.saturdayHours,
      holidayHours: row.holiday_hours ?? fallbackContent.holidayHours,
      formTitle: row.form_title ?? fallbackContent.formTitle,
      formDescription: row.form_description ?? fallbackContent.formDescription,
      closingStatement: row.closing_statement ?? fallbackContent.closingStatement,
    };
  } catch {
    const siteSettings = await getPublicSiteSettings();

    return {
      ...fallbackContent,
      phoneNumber: siteSettings.phoneDisplay || fallbackContent.phoneNumber,
      websiteUrl: siteSettings.siteUrl || fallbackContent.websiteUrl,
      websiteText: siteSettings.siteName
        ? `${siteSettings.siteName} Official Website`
        : fallbackContent.websiteText,
      instagramUrl: siteSettings.instagramUrl || fallbackContent.instagramUrl,
      tiktokUrl: siteSettings.tiktokUrl || fallbackContent.tiktokUrl,
    };
  }
}
