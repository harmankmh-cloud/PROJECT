import {
  Bug,
  Droplets,
  Hammer,
  Home,
  Paintbrush,
  Plug,
  Refrigerator,
  Snowflake,
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
  mover: Truck,
  "water-heater": Droplets,
  "snow-removal": Snowflake,
  renovation: Hammer,
  "pest-control": Bug,
  "appliance-repair": Refrigerator,
  appliance: Plug,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return ICON_MAP[slug] ?? Wrench;
}
