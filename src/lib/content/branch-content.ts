import { branches as fallbackBranches, type Branch } from "@/data/site";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type SupabaseBranchRow = {
  slug: string;
  name: string;
  address: string;
  short_address: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: string | null;
  mobile_hours: string | null;
  area: string;
  badge: string | null;
  description: string | null;
  amenity: string | null;
  amenity_icon: Branch["amenityIcon"] | null;
  theme: Branch["theme"] | null;
  mobile_subtitle: string | null;
  mobile_address_line: string | null;
  mobile_status: string | null;
  mobile_status_tone: Branch["mobileStatusTone"] | null;
  mobile_feature_icon: Branch["mobileFeatureIcon"] | null;
  map_url: string | null;
  map_embed: string | null;
  image_url: string | null;
  image_class_name: string | null;
  branch_facilities?: { text: string; sort_order: number }[];
  branch_gallery?: { image_url: string; alt_text: string | null; sort_order: number }[];
};

function mapBranchRow(row: SupabaseBranchRow): Branch {
  return {
    slug: row.slug,
    name: row.name,
    address: row.address,
    shortAddress: row.short_address ?? undefined,
    latitude: row.latitude ?? 0,
    longitude: row.longitude ?? 0,
    hours: row.hours ?? "",
    mobileHours: row.mobile_hours ?? undefined,
    area: row.area,
    badge: row.badge ?? "",
    description: row.description ?? "",
    amenity: row.amenity ?? undefined,
    amenityIcon: row.amenity_icon ?? undefined,
    theme: row.theme ?? undefined,
    mobileSubtitle: row.mobile_subtitle ?? undefined,
    mobileAddressLine: row.mobile_address_line ?? undefined,
    mobileStatus: row.mobile_status ?? undefined,
    mobileStatusTone: row.mobile_status_tone ?? undefined,
    mobileFeatureIcon: row.mobile_feature_icon ?? undefined,
    mapUrl: row.map_url ?? "#",
    mapEmbed: row.map_embed ?? "",
    image: row.image_url ?? "/logokembung.png",
    imageClassName: row.image_class_name ?? undefined,
    facilities: sortByOrder(row.branch_facilities).map((item) => item.text),
    gallery: sortByOrder(row.branch_gallery).map((item) => ({
      imageUrl: item.image_url,
      altText: item.alt_text ?? row.name,
    })),
  };
}

function sortByOrder<T extends { sort_order: number }>(items: T[] = []) {
  return [...items].sort((left, right) => left.sort_order - right.sort_order);
}

async function getSupabaseBranches() {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("branches")
    .select(
      `
        slug,
        name,
        address,
        short_address,
        latitude,
        longitude,
        hours,
        mobile_hours,
        area,
        badge,
        description,
        amenity,
        amenity_icon,
        theme,
        mobile_subtitle,
        mobile_address_line,
        mobile_status,
        mobile_status_tone,
        mobile_feature_icon,
        map_url,
        map_embed,
        image_url,
        image_class_name,
        branch_facilities(text, sort_order),
        branch_gallery(image_url, alt_text, sort_order)
      `,
    )
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return null;
  }

  return (data as SupabaseBranchRow[]).map(mapBranchRow);
}

export async function getPublicBranches(): Promise<Branch[]> {
  try {
    const data = await getSupabaseBranches();
    return data ?? fallbackBranches;
  } catch {
    return fallbackBranches;
  }
}

export async function getPublicBranchSlugs(): Promise<{ slug: string }[]> {
  const branches = await getPublicBranches();
  return branches.map((branch) => ({ slug: branch.slug }));
}

export async function getPublicBranchBySlug(slug: string): Promise<Branch | null> {
  const branches = await getPublicBranches();
  return branches.find((branch) => branch.slug === slug) ?? null;
}
