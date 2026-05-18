"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa6";
import {
  HiOutlineBuildingStorefront,
  HiOutlineHome,
  HiOutlineNewspaper,
  HiOutlineShoppingBag,
  HiOutlineUserGroup,
} from "react-icons/hi2";

type MobileBottomNavItem = {
  href: string;
  label: string;
};

const iconMap = {
  "/": HiOutlineHome,
  "/produk": HiOutlineShoppingBag,
  "/store": HiOutlineBuildingStorefront,
  "/hubungi-kami": FaWhatsapp,
  "/artikel": HiOutlineNewspaper,
  "/tentang-kami": HiOutlineUserGroup,
} as const;

type MobileBottomNavProps = {
  items: MobileBottomNavItem[];
};

export function MobileBottomNav({ items }: MobileBottomNavProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const navItems = items.slice(0, 4);

  return (
    <nav className="fixed inset-x-0 bottom-4 z-40 mx-auto w-[calc(100%-1.5rem)] max-w-sm rounded-full bg-[var(--surface-container-lowest)]/96 shadow-[0_18px_40px_-18px_rgba(61,103,81,0.35)] backdrop-blur-xl md:hidden">
      <div className="grid grid-cols-4 items-center px-3 py-2.5">
        {navItems.map(({ href, label }) => {
          const active = pathname === href;
          const Icon = iconMap[href as keyof typeof iconMap] ?? HiOutlineHome;

          return (
            <motion.div
              key={href}
              whileTap={reduceMotion ? undefined : { scale: 0.95 }}
              whileHover={reduceMotion ? undefined : { y: -1 }}
            >
              <Link
                href={href}
                className={`flex min-h-12 flex-col items-center justify-center rounded-full px-2 py-1.5 text-[10px] font-medium ${
                  active
                    ? "bg-[var(--primary-container)] text-[var(--on-primary-container)]"
                    : "text-[var(--on-surface-variant)]"
                }`}
              >
                <motion.span
                  animate={
                    reduceMotion
                      ? undefined
                      : active
                        ? { scale: [1, 1.08, 1], y: [0, -2, 0] }
                        : { scale: 1 }
                  }
                  transition={{ duration: 0.32 }}
                >
                  <Icon className="text-[18px]" aria-hidden="true" />
                </motion.span>
                {label}
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );
}
