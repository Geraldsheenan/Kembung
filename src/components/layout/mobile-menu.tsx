"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Drawer } from "@/components/animation/drawer";
import { staggerContainer } from "@/lib/motion";
import { navItems } from "@/data/site";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="md:hidden">
      <motion.button
        type="button"
        aria-label="Buka menu"
        onClick={() => setOpen((value) => !value)}
        className="rounded-full border border-[var(--line)] bg-white p-3 text-[var(--foreground)] shadow-sm"
        whileHover={reduceMotion ? undefined : { y: -2, scale: 1.03 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
            >
              <HiOutlineXMark className="text-[20px]" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
            >
              <HiOutlineBars3 className="text-[20px]" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

        <Drawer open={open} onClose={() => setOpen(false)}>
          <motion.div
            variants={reduceMotion ? undefined : staggerContainer(0.07, 0.04)}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            className="flex flex-col gap-2"
          >
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  variants={
                    reduceMotion
                      ? undefined
                      : {
                          hidden: { opacity: 0, x: 18 },
                          visible: { opacity: 1, x: 0 },
                        }
                  }
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex min-h-11 items-center justify-end rounded-2xl px-4 py-3 text-right font-semibold transition-all duration-200 ${
                      active
                        ? "bg-[var(--primary-container)]/75 text-[var(--on-primary-container)]"
                        : "text-[var(--foreground)] hover:bg-[var(--secondary)]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
      </Drawer>
    </div>
  );
}
