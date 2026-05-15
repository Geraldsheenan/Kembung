import { BranchesAdminClient } from "@/components/admin/branches-admin-client";
import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type BranchRow = {
  id: string;
  slug: string;
  name: string;
  area: string;
  badge: string | null;
  address: string;
  short_address: string | null;
  latitude: number | null;
  longitude: number | null;
  hours: string | null;
  mobile_hours: string | null;
  description: string | null;
  amenity: string | null;
  amenity_icon: string | null;
  theme: string | null;
  mobile_subtitle: string | null;
  mobile_address_line: string | null;
  mobile_status: string | null;
  mobile_status_tone: string | null;
  mobile_feature_icon: string | null;
  map_url: string | null;
  map_embed: string | null;
  image_url: string | null;
  image_class_name: string | null;
  branch_facilities?: { text: string; sort_order: number }[];
  branch_gallery?: { image_url: string; alt_text: string | null; sort_order: number }[];
  sort_order: number;
  is_active: boolean;
};

function sortByOrder<T extends { sort_order: number }>(items: T[] = []) {
  return [...items].sort((left, right) => left.sort_order - right.sort_order);
}

async function getAdminBranches() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("branches")
    .select(
      `
        id,
        slug,
        name,
        area,
        badge,
        address,
        short_address,
        latitude,
        longitude,
        hours,
        mobile_hours,
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
        branch_gallery(image_url, alt_text, sort_order),
        sort_order,
        is_active
      `,
    )
    .order("sort_order", { ascending: true });

  return ((data as BranchRow[] | null) ?? []).map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    area: item.area,
    badge: item.badge ?? "",
    address: item.address,
    shortAddress: item.short_address ?? "",
    latitude: item.latitude?.toString() ?? "",
    longitude: item.longitude?.toString() ?? "",
    hours: item.hours ?? "",
    mobileHours: item.mobile_hours ?? "",
    description: item.description ?? "",
    amenity: item.amenity ?? "",
    amenityIcon: item.amenity_icon ?? "",
    theme: item.theme ?? "",
    mobileSubtitle: item.mobile_subtitle ?? "",
    mobileAddressLine: item.mobile_address_line ?? "",
    mobileStatus: item.mobile_status ?? "",
    mobileStatusTone: item.mobile_status_tone ?? "",
    mobileFeatureIcon: item.mobile_feature_icon ?? "",
    mapUrl: item.map_url ?? "",
    mapEmbed: item.map_embed ?? "",
    imageUrl: item.image_url ?? "",
    imageClassName: item.image_class_name ?? "",
    facilities: sortByOrder(item.branch_facilities).map((facility) => facility.text),
    gallery: sortByOrder(item.branch_gallery).map((galleryItem) => ({
      imageUrl: galleryItem.image_url,
      altText: galleryItem.alt_text ?? item.name,
    })),
    sortOrder: item.sort_order ?? 0,
    isActive: item.is_active ?? true,
  }));
}

export default async function AdminBranchesPage() {
  const branches = await getAdminBranches();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="Dashboard Foundation"
        title="Branches"
        description="Modul ini menangani data cabang, status aktif, koordinat, map, jam operasional, dan foto utama yang dipakai halaman publik."
      />

      <BranchesAdminClient initialBranches={branches} />
    </section>
  );
}
