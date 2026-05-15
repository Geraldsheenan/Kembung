import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import type { PublicNavigationContent } from "@/lib/content/navigation-content";
import type { PublicSiteSettings } from "@/lib/content/site-content";

type FooterProps = {
  siteSettings: PublicSiteSettings;
  navigation: PublicNavigationContent;
};

export function Footer({ siteSettings, navigation }: FooterProps) {
  return (
    <footer className="mt-16 hidden w-full rounded-t-[32px] bg-[var(--secondary-container)] md:mt-20 md:block">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] md:items-start md:gap-12 md:py-20">
        <div className="flex max-w-xs flex-col items-center space-y-7 text-center">
          <BrandLogo
            size="footer"
            variant="full"
            src={siteSettings.logoUrl}
            alt={siteSettings.siteName}
          />
          <p className="whitespace-nowrap text-sm leading-7 text-[var(--on-secondary-container)]/80 md:text-base">
            &copy; 2026 {siteSettings.siteName}. {siteSettings.tagline}
          </p>
        </div>

        <div className="space-y-4 text-left">
          <h5 className="text-sm font-semibold text-[var(--on-secondary-container)]">
            Socials
          </h5>
          <ul className="space-y-3 text-sm md:text-base">
            {navigation.footerSocial.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={
                    item.label.toLowerCase() === "instagram"
                      ? siteSettings.instagramUrl || item.href || "#"
                      : item.label.toLowerCase() === "tiktok"
                        ? siteSettings.tiktokUrl || item.href || "#"
                        : item.href || "#"
                  }
                  className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-[var(--on-secondary-container)]">
            Help
          </h5>
          <ul className="space-y-3 text-sm md:text-base">
            {navigation.footerHelp.map((item) => (
              <li key={`${item.href}-${item.label}`}>
                <Link
                  href={item.href}
                  className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
