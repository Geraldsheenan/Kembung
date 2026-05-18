"use client";

import type { PropsWithChildren } from "react";
import { MotionConfig } from "framer-motion";
import type { PublicSiteSettings } from "@/lib/content/site-content";
import type { PublicNavigationContent } from "@/lib/content/navigation-content";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { PageTransition } from "@/components/animation/page-transition";
import { ToastProvider } from "@/components/animation/toast";

type AppShellProps = PropsWithChildren<{
  siteSettings: PublicSiteSettings;
  navigation: PublicNavigationContent;
}>;

export function AppShell({ children, siteSettings, navigation }: AppShellProps) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <NavigationProgress />
        <Navbar
          phoneInternational={siteSettings.phoneInternational}
          navigation={navigation.navbar}
          siteName={siteSettings.siteName}
          logoUrl={siteSettings.logoUrl}
        />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer siteSettings={siteSettings} navigation={navigation} />
        <MobileBottomNav items={navigation.navbar} />
      </ToastProvider>
    </MotionConfig>
  );
}
