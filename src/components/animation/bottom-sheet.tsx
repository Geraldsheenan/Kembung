"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import { useEffect, useRef } from "react";
import { bottomSheetVariants, modalOverlay } from "@/lib/motion";

type BottomSheetProps = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
};

export function BottomSheet({ open, onClose, children, title }: BottomSheetProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.button
            type="button"
            aria-label="Tutup filter"
            onClick={onClose}
            className="fixed inset-0 z-[95] bg-[rgba(47,58,61,0.24)] backdrop-blur-sm md:hidden"
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            variants={modalOverlay}
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title ?? "Bottom sheet"}
            tabIndex={-1}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            variants={reduceMotion ? undefined : bottomSheetVariants}
            onKeyDown={handleKeyDown}
            className="fixed inset-x-0 bottom-0 z-[100] rounded-t-[28px] border border-white/60 bg-[#fffdf8] p-5 pb-8 shadow-[0_-24px_80px_-24px_rgba(47,58,61,0.28)] md:hidden"
          >
            <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-[var(--line)]/70" />
            {title ? <h3 className="mb-4 text-lg font-bold text-[var(--primary)]">{title}</h3> : null}
            {children}
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
}
