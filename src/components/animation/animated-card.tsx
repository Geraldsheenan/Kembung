"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { transitionPresets } from "@/lib/motion";

type AnimatedCardProps = Omit<HTMLMotionProps<"div">, "children"> & {
  children: ReactNode;
  hoverBorder?: string;
  highlightOnTap?: boolean;
};

export function AnimatedCard({
  children,
  className,
  hoverBorder = "rgba(168, 213, 186, 0.9)",
  highlightOnTap = true,
  ...props
}: AnimatedCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        reduceMotion
          ? undefined
          : {
              y: -4,
              boxShadow: "0 28px 60px -24px rgba(168, 213, 186, 0.35)",
              borderColor: hoverBorder,
            }
      }
      whileTap={
        reduceMotion
          ? undefined
          : {
              scale: 0.98,
              backgroundColor: highlightOnTap ? "rgba(246,231,216,0.7)" : undefined,
            }
      }
      transition={transitionPresets.button}
      className={`border border-transparent ${className ?? ""}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
