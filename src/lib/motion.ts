import type { Variants } from "framer-motion";

export const durations = {
  instant: 0.15,
  fast: 0.2,
  normal: 0.35,
  slow: 0.55,
} as const;

export const easings = {
  smooth: [0.22, 1, 0.36, 1] as const,
  soft: [0.16, 1, 0.3, 1] as const,
  inOut: [0.42, 0, 0.28, 1] as const,
} as const;

export const transitionPresets = {
  quick: { duration: durations.instant, ease: easings.soft },
  button: { duration: durations.fast, ease: easings.smooth },
  smooth: { duration: durations.normal, ease: easings.smooth },
  panel: { duration: durations.slow, ease: easings.smooth },
} as const;

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPresets.smooth,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionPresets.smooth,
  },
};

export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionPresets.smooth,
  },
};

export const slideInRight: Variants = {
  hidden: { opacity: 0, x: 24 },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitionPresets.smooth,
  },
};

export const staggerContainer = (staggerChildren = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.fast, ease: easings.inOut },
  },
  exit: {
    opacity: 0,
    transition: { duration: durations.fast, ease: easings.inOut },
  },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionPresets.smooth,
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: { duration: durations.fast, ease: easings.inOut },
  },
};

export const drawerVariants: Variants = {
  hidden: { x: "100%" },
  visible: {
    x: 0,
    transition: transitionPresets.smooth,
  },
  exit: {
    x: "100%",
    transition: { duration: durations.fast, ease: easings.inOut },
  },
};

export const bottomSheetVariants: Variants = {
  hidden: { y: "100%" },
  visible: {
    y: 0,
    transition: transitionPresets.smooth,
  },
  exit: {
    y: "100%",
    transition: { duration: durations.fast, ease: easings.inOut },
  },
};

export const toastVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionPresets.button,
  },
  exit: {
    opacity: 0,
    y: 10,
    scale: 0.98,
    transition: { duration: durations.fast, ease: easings.inOut },
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitionPresets.button,
  },
};

export const itemFade: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: transitionPresets.button,
  },
};
