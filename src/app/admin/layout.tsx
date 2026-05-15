import type { PropsWithChildren } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { getPublicSiteSettings } from "@/lib/content/site-content";

export default async function AdminLayout({ children }: PropsWithChildren) {
  const siteSettings = await getPublicSiteSettings();

  return (
    <AdminShell siteName={siteSettings.siteName} logoUrl={siteSettings.logoUrl}>
      {children}
    </AdminShell>
  );
}
