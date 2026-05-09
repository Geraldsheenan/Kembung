"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { drawerVariants, modalOverlay } from "@/lib/motion";

type DrawerProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export function Drawer({ open, onClose, children }: DrawerProps) {
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Tutup menu"
            className="fixed inset-0 z-[95] bg-[rgba(47,58,61,0.24)] backdrop-blur-sm"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            variants={modalOverlay}
            onClick={onClose}
          />
          <motion.aside
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            variants={reduceMotion ? undefined : drawerVariants}
            className="fixed inset-y-0 right-0 z-[100] w-[86vw] max-w-sm border-l border-white/50 bg-[#fffdf8]/95 px-5 py-6 shadow-[0_24px_80px_-24px_rgba(47,58,61,0.28)] backdrop-blur-xl"
          >
            <div className="mb-5 flex justify-start">
              <motion.button
                type="button"
                aria-label="Tutup drawer"
                whileHover={reduceMotion ? undefined : { rotate: 90 }}
                whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                onClick={onClose}
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
              >
                <HiOutlineXMark className="text-[22px]" />
              </motion.button>
            </div>
            {children}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
