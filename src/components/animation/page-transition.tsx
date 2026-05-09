"use client";

import { AnimatePresence, motion, MotionConfig, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { transitionPresets } from "@/lib/motion";

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion="user">
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={reduceMotion ? false : { opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduceMotion ? undefined : { opacity: 0, y: 10, filter: "blur(6px)" }}
          transition={transitionPresets.smooth}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}
