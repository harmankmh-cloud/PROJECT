"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { easeOut, fadeUp, stagger } from "@/lib/motion";

export function MotionSection({
  children,
  className = "",
  as: Tag = "section",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "section" | "div";
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const Component = motion[Tag];

  return (
    <Component
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={stagger}
    >
      {children}
    </Component>
  );
}

export function MotionItem({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      transition={{ ...easeOut, delay }}
    >
      {children}
    </motion.div>
  );
}
