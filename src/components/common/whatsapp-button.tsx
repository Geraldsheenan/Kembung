"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { transitionPresets } from "@/lib/motion";

type WhatsAppButtonProps = {
  message: string;
  phoneInternational?: string;
  label?: string;
  className?: string;
};

export function WhatsAppButton({
  message,
  phoneInternational,
  label = "Pesan via WhatsApp",
  className = "",
}: WhatsAppButtonProps) {
  const [loading, setLoading] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : { y: -2, scale: 1.02, boxShadow: "0 20px 40px -18px rgba(168, 213, 186, 0.95)" }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.97 }}
      transition={transitionPresets.button}
    >
      <Link
        href={buildWhatsAppUrl(message, phoneInternational)}
        target="_blank"
        rel="noreferrer"
        onClick={() => {
          setLoading(true);
          window.setTimeout(() => setLoading(false), 950);
        }}
        className={`glow-pastel group inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white shadow-lg ${className}`}
        aria-label={label}
      >
        <motion.span
          className="group-hover:animate-wiggle-soft"
          animate={
            reduceMotion
              ? undefined
              : { rotate: [0, 4, -4, 0], y: [0, -1, 0] }
          }
          transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.6 }}
        >
          <FaWhatsapp className="text-[18px]" aria-hidden="true" />
        </motion.span>
        {loading ? "Mengarahkan..." : label}
      </Link>
    </motion.div>
  );
}
