import {
  Droplets,
  Hammer,
  Home,
  Paintbrush,
  Sparkles,
  Trees,
  Truck,
  Wind,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  plumber: Wrench,
  electrician: Zap,
  hvac: Wind,
  landscaper: Trees,
  painter: Paintbrush,
  cleaner: Sparkles,
  roofer: Home,
  handyman: Hammer,
  moving: Truck,
  "water-heater": Droplets,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return ICON_MAP[slug] ?? Wrench;
}
