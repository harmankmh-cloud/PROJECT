/** Shared Framer Motion tokens — Sentry-inspired, respects reduced motion via MotionConfig. */
export const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
} as const;

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
} as const;

export const slideIn = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
} as const;

export const stagger = {
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
} as const;

export const spring = { type: "spring" as const, stiffness: 260, damping: 24 };

export const easeOut = { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const };

export const cardHover = {
  scale: 1.02,
  boxShadow: "0 0 32px rgba(124, 58, 237, 0.25), 0 8px 32px rgba(0,0,0,0.4)",
};

export const cardTap = { scale: 0.98 };

export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: easeOut,
};

export const wordSwap = {
  initial: { opacity: 0, y: 16, filter: "blur(4px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -12, filter: "blur(4px)" },
};
