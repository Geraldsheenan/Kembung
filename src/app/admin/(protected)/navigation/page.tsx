import { AdminPageIntro } from "@/components/admin/admin-page-intro";
import { NavigationAdminClient } from "@/components/admin/navigation-admin-client";
import { getSupabaseAdminClient } from "@/lib/supabase/admin";

type NavigationRow = {
  id: string;
  label: string;
  href: string;
  location: "navbar" | "footer_help" | "footer_social";
  sort_order: number;
  is_active: boolean;
};

async function getAdminNavigationItems() {
  const supabase = getSupabaseAdminClient();
  const { data } = await supabase
    .from("navigation_items")
    .select("id, label, href, location, sort_order, is_active")
    .order("location", { ascending: true })
    .order("sort_order", { ascending: true });

  return ((data as NavigationRow[] | null) ?? []).map((item) => ({
    id: item.id,
    label: item.label,
    href: item.href,
    location: item.location,
    sortOrder: item.sort_order,
    isActive: item.is_active,
  }));
}

export default async function AdminNavigationPage() {
  const items = await getAdminNavigationItems();

  return (
    <section className="space-y-6">
      <AdminPageIntro
        badge="CRUD Module"
        title="Navigation"
        description="Modul ini mengontrol link navbar, footer help, footer social, dan daftar link mobile yang ikut membaca lokasi `navbar`."
      />

      <NavigationAdminClient initialItems={items} />
    </section>
  );
}
