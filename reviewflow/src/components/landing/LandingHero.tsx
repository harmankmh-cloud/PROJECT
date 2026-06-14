"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LANDING } from "@/content/copy";
import { StarDisplay } from "@/components/ui/StarRating";
import { FadeInSection } from "@/components/ui/FadeInSection";

const CITIES = ["Vancouver", "Calgary", "Toronto", "Abbotsford", "Edmonton"];

export function LandingHero() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("");
  const [showCities, setShowCities] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (city) params.set("city", city);
    router.push(`/search?${params.toString()}`);
  };

  const filteredCities = CITIES.filter((c) =>
    c.toLowerCase().includes(city.toLowerCase())
  );

  return (
    <section className="mesh-bg relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
      <div className="marketing-container text-center">
        <FadeInSection>
          <div className="mb-6 flex justify-center">
            <StarDisplay value={4.8} size="md" animateOnLoad showValue />
          </div>
          <h1 className="font-display text-4xl leading-tight text-text md:text-6xl lg:text-7xl">
            {LANDING.hero.headline}{" "}
            <span className="text-gradient">{LANDING.hero.headlineAccent}</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted md:text-xl">
            {LANDING.hero.subheading}
          </p>
        </FadeInSection>

        <FadeInSection delay={0.1} className="mx-auto mt-10 max-w-2xl">
          <form onSubmit={handleSearch} className="relative">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={LANDING.hero.searchPlaceholder}
                  className="input-field pl-12"
                />
              </div>
              <div className="relative sm:w-48">
                <input
                  type="text"
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    setShowCities(true);
                  }}
                  onFocus={() => setShowCities(true)}
                  onBlur={() => setTimeout(() => setShowCities(false), 150)}
                  placeholder="City"
                  className="input-field"
                  autoComplete="off"
                />
                {showCities && filteredCities.length > 0 && (
                  <ul className="absolute z-20 mt-1 w-full rounded-xl border border-border bg-surface py-1 shadow-xl">
                    {filteredCities.map((c) => (
                      <li key={c}>
                        <button
                          type="button"
                          className="w-full px-4 py-2 text-left text-sm hover:bg-bg"
                          onMouseDown={() => {
                            setCity(c);
                            setShowCities(false);
                          }}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button type="submit" className="btn-primary-pill px-8 py-3.5">
                Search
              </button>
            </div>
          </form>
        </FadeInSection>

        <FadeInSection delay={0.15} className="mt-8">
          <p className="mb-3 text-sm text-muted">Popular cities</p>
          <div className="flex flex-wrap justify-center gap-2">
            {CITIES.map((c) => (
              <motion.button
                key={c}
                type="button"
                onClick={() => setCity(c)}
                className="rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text transition hover:border-primary hover:text-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                {c}
              </motion.button>
            ))}
          </div>
        </FadeInSection>

        <FadeInSection delay={0.2} className="mt-8">
          <p className="mb-3 text-sm text-muted">Trending categories</p>
          <div className="flex flex-wrap justify-center gap-2">
            {LANDING.hero.categories.map((cat) => (
              <Link
                key={cat}
                href={`/search?category=${encodeURIComponent(cat)}`}
                className="rounded-full border border-border/60 bg-bg/50 px-4 py-1.5 text-sm text-muted transition hover:border-star/50 hover:text-star"
              >
                {cat}
              </Link>
            ))}
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
