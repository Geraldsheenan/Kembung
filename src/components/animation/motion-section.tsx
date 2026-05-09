"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, scaleIn, slideInLeft, slideInRight } from "@/lib/motion";

type MotionSectionProps = {
  as?: "section" | "div" | "article";
  children: ReactNode;
  delay?: number;
  variant?: "fadeUp" | "scaleIn" | "slideInLeft" | "slideInRight";
  className?: string;
  id?: string;
};

export function MotionSection({
  as = "section",
  children,
  className,
  delay = 0,
  variant = "fadeUp",
  id,
  ...props
}: MotionSectionProps) {
  const reduceMotion = useReducedMotion();
  const Component = motion[as];
  const variantsMap = {
    fadeUp,
    scaleIn,
    slideInLeft,
    slideInRight,
  } as const;

  return (
    <Component
      initial={reduceMotion ? false : "hidden"}
      whileInView={reduceMotion ? undefined : "visible"}
      viewport={{ once: true, amount: 0.15 }}
      variants={variantsMap[variant]}
      transition={reduceMotion ? undefined : { delay }}
      className={className}
      id={id}
      {...props}
    >
      {children}
    </Component>
  );
}
