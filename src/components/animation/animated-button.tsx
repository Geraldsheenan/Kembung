"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa6";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { transitionPresets } from "@/lib/motion";

type AnimatedButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "whatsapp";
  loading?: boolean;
  icon?: "arrow" | "whatsapp" | ReactNode;
  fullWidth?: boolean;
};

export function AnimatedButton({
  children,
  className = "",
  variant = "primary",
  loading = false,
  icon,
  fullWidth = false,
  disabled,
  ...props
}: AnimatedButtonProps) {
  const reduceMotion = useReducedMotion();
  const isDisabled = disabled || loading;

  const base =
    "group relative inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold outline-none ring-0";
  const variants = {
    primary:
      "bg-[var(--primary)] text-white shadow-[0_18px_35px_-18px_rgba(168,213,186,0.85)] hover:bg-[var(--primary-strong)]",
    secondary:
      "border border-[var(--outline-variant)] bg-white/95 text-[var(--on-surface-variant)] hover:border-[#FFB5A7] hover:bg-[var(--secondary-fixed)]/35",
    whatsapp:
      "bg-[#25D366] text-white shadow-[0_18px_35px_-18px_rgba(37,211,102,0.75)] hover:shadow-[0_22px_45px_-16px_rgba(168,213,186,0.95)]",
  } as const;

  const resolvedIcon =
    icon === "arrow" ? (
      <motion.span
        className="transition-transform duration-200 group-hover:translate-x-1"
        animate={loading ? { x: [0, 4, 0] } : undefined}
        transition={{ repeat: loading ? Number.POSITIVE_INFINITY : 0, duration: 0.8 }}
      >
        <HiOutlineArrowRight className="text-[18px]" aria-hidden="true" />
      </motion.span>
    ) : icon === "whatsapp" ? (
      <motion.span
        animate={
          reduceMotion || loading
            ? undefined
            : { rotate: [0, 4, -4, 0], y: [0, -1, 0] }
        }
        transition={{ duration: 0.9, repeat: Number.POSITIVE_INFINITY, repeatDelay: 2.4 }}
      >
        <FaWhatsapp className="text-[18px]" aria-hidden="true" />
      </motion.span>
    ) : (
      icon
    );

  return (
    <motion.button
      type="button"
      disabled={isDisabled}
      whileHover={
        reduceMotion || isDisabled
          ? undefined
          : {
              y: -2,
              scale: 1.02,
              boxShadow:
                variant === "secondary"
                  ? "0 18px 36px -20px rgba(255, 181, 167, 0.38)"
                  : "0 20px 38px -18px rgba(168, 213, 186, 0.95)",
            }
      }
      whileTap={reduceMotion || isDisabled ? undefined : { scale: 0.97 }}
      transition={transitionPresets.button}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${isDisabled ? "cursor-not-allowed opacity-90" : ""} ${className}`}
      {...props}
    >
      {resolvedIcon}
      <span>{loading ? "Mengarahkan..." : children}</span>
    </motion.button>
  );
}
