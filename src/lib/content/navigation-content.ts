import { SITE, navItems as fallbackNavItems } from "@/data/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type PublicNavigationItem = {
  href: string;
  label: string;
};

export type PublicNavigationContent = {
  navbar: PublicNavigationItem[];
  footerHelp: PublicNavigationItem[];
  footerSocial: PublicNavigationItem[];
};

type NavigationRow = {
  label: string;
  href: string;
  location: "navbar" | "footer_help" | "footer_social";
  sort_order: number;
};

const fallbackNavigation: PublicNavigationContent = {
  navbar: fallbackNavItems.map((item) => ({ href: item.href, label: item.label })),
  footerHelp: [
    { href: "/store", label: "Store Locations" },
    { href: "#", label: "Privacy Policy" },
    { href: "/hubungi-kami", label: "Contact Us" },
  ],
  footerSocial: [
    { href: "#", label: "Instagram" },
    { href: SITE.social.tiktok, label: "TikTok" },
  ],
};

function sortRows(rows: NavigationRow[]) {
  return [...rows].sort((left, right) => left.sort_order - right.sort_order);
}

export async function getPublicNavigation(): Promise<PublicNavigationContent> {
  try {
    const supabase = await getSupabaseServerClient();
    const { data, error } = await supabase
      .from("navigation_items")
      .select("label, href, location, sort_order")
      .eq("is_active", true)
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      return fallbackNavigation;
    }

    const rows = data as NavigationRow[];

    return {
      navbar: sortRows(rows)
        .filter((item) => item.location === "navbar")
        .map((item) => ({ href: item.href, label: item.label })),
      footerHelp: sortRows(rows)
        .filter((item) => item.location === "footer_help")
        .map((item) => ({ href: item.href, label: item.label })),
      footerSocial: sortRows(rows)
        .filter((item) => item.location === "footer_social")
        .map((item) => ({ href: item.href, label: item.label })),
    };
  } catch {
    return fallbackNavigation;
  }
}
