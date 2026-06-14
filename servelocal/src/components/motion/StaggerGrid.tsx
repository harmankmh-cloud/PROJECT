"use client";

import { motion } from "framer-motion";
import { staggerContainer, fadeUp, defaultTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

type StaggerGridProps = {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "ul" | "section";
};

export function StaggerGrid({ children, className, as = "div" }: StaggerGridProps) {
  const Component = motion[as];

  return (
    <Component
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-40px" }}
      variants={staggerContainer}
      className={cn(className)}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={fadeUp} transition={defaultTransition} className={cn(className)}>
      {children}
    </motion.div>
  );
}
