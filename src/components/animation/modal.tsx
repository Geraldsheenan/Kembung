"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useEffect,
  useRef,
} from "react";
import { HiOutlineXMark } from "react-icons/hi2";
import { modalContent, modalOverlay, staggerContainer } from "@/lib/motion";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

export function Modal({ open, onClose, title, children, className = "" }: ModalProps) {
  const reduceMotion = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const initialFocus = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    initialFocus?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  function handlePanelKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") onClose();
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-[rgba(47,58,61,0.24)] px-4 py-8 backdrop-blur-md"
          initial={reduceMotion ? false : "hidden"}
          animate="visible"
          exit="exit"
          variants={modalOverlay}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            variants={reduceMotion ? undefined : modalContent}
            initial={reduceMotion ? false : "hidden"}
            animate="visible"
            exit="exit"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={handlePanelKeyDown}
            className={`w-full max-w-lg rounded-[28px] border border-white/60 bg-[#fffdf8] p-6 shadow-[0_24px_80px_-28px_rgba(47,58,61,0.35)] md:p-8 ${className}`}
          >
            <motion.div
              variants={reduceMotion ? undefined : staggerContainer(0.07)}
              initial={reduceMotion ? false : "hidden"}
              animate="visible"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                {title ? (
                  <h3 className="text-2xl font-bold text-[var(--primary)]">{title}</h3>
                ) : (
                  <span />
                )}
                <motion.button
                  type="button"
                  aria-label="Tutup modal"
                  whileHover={reduceMotion ? undefined : { rotate: 90, scale: 1.04 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.96 }}
                  onClick={onClose}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--surface-container)] text-[var(--on-surface-variant)]"
                >
                  <HiOutlineXMark className="text-[22px]" />
                </motion.button>
              </div>
              {children}
            </motion.div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
