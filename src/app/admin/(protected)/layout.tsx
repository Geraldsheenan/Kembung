import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPublicSiteSettings } from "@/lib/content/site-content";
import { getRoleFromClaims } from "@/lib/supabase/auth";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProtectedAdminLayout({
  children,
}: PropsWithChildren) {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.auth.getClaims();

  if (getRoleFromClaims(data?.claims ?? null) !== "admin") {
    redirect("/admin/login");
  }

  const siteSettings = await getPublicSiteSettings();

  return (
    <AdminShell siteName={siteSettings.siteName} logoUrl={siteSettings.logoUrl}>
      {children}
    </AdminShell>
  );
}
