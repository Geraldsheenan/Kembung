"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa6";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { buildGeneralWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function StickyMobileCTA() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY > Math.max(window.innerHeight * 0.65, 320);
      const footer = document.querySelector("footer");
      if (!footer) {
        setVisible(scrolled);
        return;
      }
      const footerTop = footer.getBoundingClientRect().top;
      const hideNearFooter = footerTop < window.innerHeight - 140;
      setVisible(scrolled && !hideNearFooter);
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 24 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-24 z-[115] px-4 md:hidden"
        >
          <Link
            href={buildWhatsAppUrl(buildGeneralWhatsAppMessage())}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_-20px_rgba(168,213,186,0.95)]"
          >
            <FaWhatsapp className="text-[18px]" aria-hidden="true" />
            Chat WhatsApp
          </Link>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
