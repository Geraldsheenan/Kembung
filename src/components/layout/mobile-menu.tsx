"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { easings, staggerContainer, transitionPresets } from "@/lib/motion";
import { navItems } from "@/data/site";

type MobileMenuProps = {
  items?: { href: string; label: string }[];
  buttonClassName?: string;
};

export function MobileMenu({
  items = navItems,
  buttonClassName = "rounded-full border border-[var(--line)] bg-white p-3 text-[var(--foreground)] shadow-sm",
}: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <div className="md:hidden">
      <motion.button
        type="button"
        aria-label={open ? "Tutup menu" : "Buka menu"}
        onClick={() => setOpen((value) => !value)}
        className={buttonClassName}
        animate={
          reduceMotion
            ? undefined
            : {
                rotate: open ? 90 : 0,
                scale: open ? 1.04 : 1,
              }
        }
        transition={transitionPresets.button}
        whileHover={reduceMotion ? undefined : { y: -1, scale: open ? 1.04 : 1.02 }}
        whileTap={reduceMotion ? undefined : { scale: 0.96 }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -45, opacity: 0, scale: 0.96 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: 45, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <HiOutlineXMark className="text-[20px]" aria-hidden="true" />
            </motion.span>
          ) : (
            <motion.span
              key="menu"
              initial={{ rotate: 45, opacity: 0, scale: 0.96 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              exit={{ rotate: -45, opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <HiOutlineBars3 className="text-[20px]" aria-hidden="true" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Tutup menu"
              className="fixed inset-0 top-[76px] z-[95] bg-transparent"
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={reduceMotion ? undefined : { opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={transitionPresets.smooth}
              onClick={() => setOpen(false)}
            />

            <motion.aside
              initial={reduceMotion ? false : { x: "108%", opacity: 0, scale: 0.96 }}
              animate={reduceMotion ? undefined : { x: 0, opacity: 1, scale: 1 }}
              exit={reduceMotion ? undefined : { x: "108%", opacity: 0, scale: 0.98 }}
              transition={{
                duration: 0.42,
                ease: easings.smooth,
              }}
              className="fixed right-3 top-[88px] z-[100] min-w-[168px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-[30px] rounded-tr-[10px] border border-white/55 bg-[linear-gradient(180deg,rgba(243,231,219,0.96),rgba(238,225,211,0.88))] p-2 shadow-[0_24px_54px_-26px_rgba(109,99,87,0.34)] backdrop-blur-xl"
            >
              <motion.div
                variants={reduceMotion ? undefined : staggerContainer(0.06, 0.04)}
                initial={reduceMotion ? false : "hidden"}
                animate="visible"
                className="flex flex-col gap-1.5"
              >
                {items.map((item, index) => {
                  const active = pathname === item.href;

                  return (
                    <motion.div
                      key={item.href}
                      variants={
                        reduceMotion
                          ? undefined
                          : {
                              hidden: { opacity: 0, x: 20 },
                              visible: {
                                opacity: 1,
                                x: 0,
                                transition: {
                                  duration: 0.35,
                                  ease: "easeOut",
                                  delay: 0.12 + index * 0.06,
                                },
                              },
                            }
                      }
                    >
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={`flex min-h-14 items-center justify-end rounded-[22px] px-5 text-right text-[1.05rem] font-semibold leading-none tracking-[-0.02em] transition-all duration-200 ${
                          active
                            ? "bg-white/72 text-[var(--primary)] shadow-[inset_0_1px_0_rgba(255,255,255,0.65)]"
                            : "text-[rgba(26,28,26,0.92)] hover:bg-white/42 hover:text-[var(--primary)]"
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
