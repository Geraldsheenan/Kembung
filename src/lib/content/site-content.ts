import { SITE } from "@/data/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PublicSiteSettings = {
  siteName: string;
  tagline: string;
  description: string;
  phoneDisplay: string;
  phoneInternational: string;
  siteUrl: string;
  instagramUrl: string;
  tiktokUrl: string;
  logoUrl: string;
  faviconUrl: string;
};

const fallbackSiteSettings: PublicSiteSettings = {
  siteName: SITE.name,
  tagline: SITE.tagline,
  description: SITE.description,
  phoneDisplay: SITE.phoneDisplay,
  phoneInternational: SITE.phoneInternational,
  siteUrl: SITE.url,
  instagramUrl: SITE.social.instagram,
  tiktokUrl: SITE.social.tiktok,
  logoUrl: "/logokembunk.png",
  faviconUrl: "/logokembunk.png",
};

export async function getPublicSiteSettings(): Promise<PublicSiteSettings> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select(
        "site_name, tagline, description, phone_display, phone_international, site_url, instagram_url, tiktok_url, logo_url, favicon_url",
      )
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return fallbackSiteSettings;
    }

    return {
      siteName: data.site_name ?? fallbackSiteSettings.siteName,
      tagline: data.tagline ?? fallbackSiteSettings.tagline,
      description: data.description ?? fallbackSiteSettings.description,
      phoneDisplay: data.phone_display ?? fallbackSiteSettings.phoneDisplay,
      phoneInternational:
        data.phone_international ?? fallbackSiteSettings.phoneInternational,
      siteUrl: data.site_url ?? fallbackSiteSettings.siteUrl,
      instagramUrl: data.instagram_url ?? fallbackSiteSettings.instagramUrl,
      tiktokUrl: data.tiktok_url ?? fallbackSiteSettings.tiktokUrl,
      logoUrl: data.logo_url ?? fallbackSiteSettings.logoUrl,
      faviconUrl: data.favicon_url ?? fallbackSiteSettings.faviconUrl,
    };
  } catch {
    return fallbackSiteSettings;
  }
}

