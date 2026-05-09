import Link from "next/link";
import { BrandLogo } from "@/components/common/brand-logo";
import { SITE } from "@/data/site";

export function Footer() {
  return (
    <footer className="mt-16 hidden w-full rounded-t-[32px] bg-[var(--secondary-container)] md:mt-20 md:block">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)_minmax(0,0.9fr)] md:items-start md:gap-12 md:py-20">
        <div className="max-w-xs space-y-5">
          <BrandLogo size="footer" variant="mark" />
          <p className="text-sm leading-7 text-[var(--on-secondary-container)]/80 md:text-base">
            &copy; 2024 Kembung. Joyful Hydration for the Soul.
          </p>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-[var(--on-secondary-container)]">
            Socials
          </h5>
          <ul className="space-y-3 text-sm md:text-base">
            <li>
              <Link
                href={SITE.social.instagram}
                className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
              >
                Instagram
              </Link>
            </li>
            <li>
              <Link
                href={SITE.social.tiktok}
                className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
              >
                TikTok
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="text-sm font-semibold text-[var(--on-secondary-container)]">
            Help
          </h5>
          <ul className="space-y-3 text-sm md:text-base">
            <li>
              <Link
                href="/cabang"
                className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
              >
                Branch Locations
              </Link>
            </li>
            <li>
              <Link
                href="#"
                className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                href="/hubungi-kami"
                className="text-[var(--on-secondary-container)]/80 transition-colors hover:text-[var(--primary)]"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
