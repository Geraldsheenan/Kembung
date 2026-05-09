"use client";

import type { PropsWithChildren } from "react";
import { MotionConfig } from "framer-motion";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Navbar } from "@/components/layout/navbar";
import { NavigationProgress } from "@/components/layout/navigation-progress";
import { StickyMobileCTA } from "@/components/layout/sticky-mobile-cta";
import { AnimatedWhatsAppFloat } from "@/components/layout/animated-whatsapp-float";
import { PageTransition } from "@/components/animation/page-transition";
import { ToastProvider } from "@/components/animation/toast";

export function AppShell({ children }: PropsWithChildren) {
  return (
    <MotionConfig reducedMotion="user">
      <ToastProvider>
        <NavigationProgress />
        <Navbar />
        <PageTransition>
          <main>{children}</main>
        </PageTransition>
        <Footer />
        <MobileBottomNav />
        <StickyMobileCTA />
        <AnimatedWhatsAppFloat />
      </ToastProvider>
    </MotionConfig>
  );
}
