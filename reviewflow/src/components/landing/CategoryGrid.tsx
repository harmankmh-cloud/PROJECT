"use client";

import Link from "next/link";
import {
  Car,
  Dumbbell,
  Heart,
  Home,
  Scissors,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import { motion } from "framer-motion";
import { LANDING } from "@/content/copy";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { StaggerChildren, StaggerItem } from "@/components/ui/StaggerChildren";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  utensils: UtensilsCrossed,
  scissors: Scissors,
  car: Car,
  heart: Heart,
  wrench: Wrench,
  shopping: ShoppingBag,
  dumbbell: Dumbbell,
  home: Home,
};

export function CategoryGrid() {
  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="marketing-container">
        <FadeInSection className="mb-10 text-center">
          <h2 className="font-display text-2xl text-text md:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-muted">Discover local businesses in every industry</p>
        </FadeInSection>

        <StaggerChildren className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {LANDING.categories.map((cat) => {
            const Icon = ICONS[cat.icon] ?? UtensilsCrossed;
            return (
              <StaggerItem key={cat.name}>
                <Link href={cat.href} className="card-glow group block p-6 text-center">
                  <motion.div
                    className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-white"
                    whileHover={{ scale: 1.08, rotate: 3 }}
                  >
                    <Icon className="h-7 w-7" />
                  </motion.div>
                  <h3 className="font-semibold text-text">{cat.name}</h3>
                </Link>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </div>
    </section>
  );
}
