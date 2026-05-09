"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { HiOutlineChevronDown } from "react-icons/hi2";

type FaqItem = {
  question: string;
  answer: string;
};

export function FAQAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduceMotion = useReducedMotion();

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div
            key={item.question}
            className={`overflow-hidden rounded-[20px] border border-[var(--outline-variant)]/35 ${
              open ? "bg-[var(--primary-container)]/25" : "bg-white"
            }`}
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="flex min-h-11 w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
              <span className="font-semibold text-[var(--on-surface)]">{item.question}</span>
              <motion.span
                animate={reduceMotion ? undefined : { rotate: open ? 180 : 0 }}
                transition={{ duration: 0.24 }}
              >
                <HiOutlineChevronDown className="text-[18px] text-[var(--primary)]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {open ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
                  transition={{ duration: 0.22 }}
                  className="px-5 pb-5 text-sm leading-7 text-[var(--on-surface-variant)]"
                >
                  {item.answer}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
