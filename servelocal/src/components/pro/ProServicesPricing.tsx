import type { ServiceCategory, ServiceProvider } from "@/lib/types";
import { getCategoryIcon } from "@/lib/category-icons";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = {
  provider: ServiceProvider;
  category: ServiceCategory | null;
};

export function ProServicesPricing({ provider, category }: Props) {
  const Icon = getCategoryIcon(provider.category_slug);

  const services = [
    {
      name: category?.name ?? "General services",
      description: `Professional ${category?.name?.toLowerCase() ?? "trade"} services in your area`,
      price: provider.min_callout_fee ?? "Contact for quote",
    },
    ...(provider.emergency_available
      ? [
          {
            name: "24/7 Emergency",
            description: "After-hours and emergency call-outs available",
            price: "Premium rate applies",
          },
        ]
      : []),
  ];

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Services &amp; Pricing</h2>
        <div className="mt-4 overflow-hidden rounded-[14px] border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="px-4 py-3 text-left font-semibold text-foreground">Service</th>
                <th className="hidden px-4 py-3 text-left font-semibold text-foreground sm:table-cell">
                  Description
                </th>
                <th className="px-4 py-3 text-right font-semibold text-foreground">Price</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s.name} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <Icon className="h-4 w-4 text-primary" />
                      {s.name}
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 text-muted sm:table-cell">{s.description}</td>
                  <td className="px-4 py-3 text-right font-semibold text-primary">{s.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </FadeUp>
  );
}
