"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  HiOutlineMagnifyingGlass,
} from "react-icons/hi2";
import { buildGeneralWhatsAppMessage } from "@/lib/whatsapp";
import { transitionPresets } from "@/lib/motion";
import { BrandLogo } from "../common/brand-logo";
import { WhatsAppButton } from "../common/whatsapp-button";

const desktopNav = [
  { href: "/", label: "Home" },
  { href: "/produk", label: "Shop" },
  { href: "/cabang", label: "Locations" },
  { href: "/tentang-kami", label: "About" },
  { href: "/artikel", label: "Blog" },
];

export function Navbar() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 18);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      animate={
        reduceMotion
          ? undefined
          : {
              y: scrolled ? 0 : 2,
            }
      }
      transition={transitionPresets.smooth}
      className="sticky top-3 z-50 md:top-4"
    >
      <motion.div
        animate={
          reduceMotion
            ? undefined
            : {
                backgroundColor: scrolled
                  ? "rgba(255,255,255,0.5)"
                  : "rgba(255,255,255,0.34)",
                boxShadow: scrolled
                  ? "0 20px 42px -28px rgba(47,58,61,0.28)"
                  : "0 12px 30px -26px rgba(47,58,61,0.18)",
                borderColor: scrolled
                  ? "rgba(255,255,255,0.7)"
                  : "rgba(255,255,255,0.52)",
              }
        }
        transition={transitionPresets.smooth}
        className={`container-shell relative flex items-center justify-between rounded-full border px-5 backdrop-blur-xl md:px-7 ${
          scrolled ? "py-3.5 md:py-4" : "py-4 md:py-5"
        }`}
      >
        <motion.div
          animate={reduceMotion ? undefined : { scale: scrolled ? 0.97 : 1 }}
          transition={transitionPresets.button}
        >
          <BrandLogo size="navbar" />
        </motion.div>

        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 lg:flex">
          {desktopNav.map((item) => {
            const active = pathname === item.href;

            return (
              <motion.div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className={`relative z-10 rounded-full px-1 py-2 text-[13px] font-medium transition-colors duration-200 ${
                    active
                      ? "text-[var(--primary)]"
                      : "text-[var(--on-surface-variant)] hover:text-[var(--primary)]"
                  }`}
                >
                  {item.label}
                </Link>
                <motion.span
                  className="absolute bottom-0 left-1 right-1 h-0.5 rounded-full bg-[var(--primary)]"
                  initial={false}
                  animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0.55 }}
                  whileHover={
                    active || reduceMotion ? undefined : { scaleX: 1, opacity: 1 }
                  }
                  style={{ originX: 0 }}
                  transition={{ duration: 0.24 }}
                />
              </motion.div>
            );
          })}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <motion.button
            type="button"
            aria-label="Search"
            whileHover={reduceMotion ? undefined : { y: -2, scale: 1.04 }}
            whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            className="text-[20px] text-[var(--on-surface-variant)] transition-colors hover:text-[var(--primary)]"
          >
            <HiOutlineMagnifyingGlass aria-hidden="true" />
          </motion.button>
          <WhatsAppButton
            message={buildGeneralWhatsAppMessage()}
            label="Contact Us"
            className="rounded-full bg-[var(--primary)] px-6 py-3 text-[13px] text-white shadow-[0_16px_34px_-18px_rgba(61,103,81,0.72)]"
          />
        </div>

        <div className="flex items-center gap-1 md:gap-2 lg:hidden">
          {[{ label: "Search", icon: HiOutlineMagnifyingGlass }].map(({ label, icon: Icon }) => (
            <motion.button
              key={label}
              type="button"
              aria-label={label}
              whileHover={reduceMotion ? undefined : { y: -1, scale: 1.03 }}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-full text-[var(--primary)]"
            >
              <Icon className="text-[20px]" aria-hidden="true" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.header>
  );
}
