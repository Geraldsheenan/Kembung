import type { PropsWithChildren } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { getPublicNavigation } from "@/lib/content/navigation-content";
import { getPublicSiteSettings } from "@/lib/content/site-content";

export default async function SiteLayout({ children }: PropsWithChildren) {
  const [siteSettings, navigation] = await Promise.all([
    getPublicSiteSettings(),
    getPublicNavigation(),
  ]);

  return (
    <AppShell siteSettings={siteSettings} navigation={navigation}>
      {children}
    </AppShell>
  );
}
