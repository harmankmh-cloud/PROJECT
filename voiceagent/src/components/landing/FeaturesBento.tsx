"use client";

import { motion, useInView } from "framer-motion";
import { Calendar, FileText, Mic, Moon, Phone, Plug } from "lucide-react";
import { useRef } from "react";
import { BENTO_FEATURES } from "@/lib/copy/landing";
import { INTEGRATIONS } from "@/lib/marketing-content";
import { fadeUp, stagger } from "@/lib/motion";
import { GlowCard } from "@/components/ui/GlowCard";

const ICONS: Record<string, React.ReactNode> = {
  calls: <Phone className="h-6 w-6 text-violet-400" />,
  booking: <Calendar className="h-6 w-6 text-teal-400" />,
  greeting: <Mic className="h-6 w-6 text-violet-400" />,
  afterhours: <Moon className="h-6 w-6 text-teal-300" />,
  transcripts: <FileText className="h-6 w-6 text-violet-300" />,
  integrations: <Plug className="h-6 w-6 text-teal-400" />,
};

function WaveformIcon() {
  return (
    <div className="flex h-10 items-end gap-1" aria-hidden>
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-violet-400"
          animate={{ height: ["30%", "100%", "45%", "80%", "30%"] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.08 }}
          style={{ height: "40%" }}
        />
      ))}
    </div>
  );
}

export function FeaturesBento() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section className="py-20 md:py-24" id="features">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <p className="section-eyebrow mb-3">Features</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">
            Everything a great receptionist does — without the payroll
          </h2>
        </div>

        <motion.div
          ref={ref}
          className="grid gap-4 md:grid-cols-3 md:grid-rows-2"
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={stagger}
        >
          {BENTO_FEATURES.map((f) => (
            <motion.div
              key={f.id}
              variants={fadeUp}
              className={f.large ? "md:col-span-2" : ""}
            >
              <GlowCard className="h-full">
                <div className="mb-4 flex items-center justify-between">
                  {ICONS[f.id]}
                  {f.id === "calls" ? <WaveformIcon /> : null}
                </div>
                <h3 className="font-display text-lg text-text">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.desc}</p>
                {f.id === "integrations" ? (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {INTEGRATIONS.slice(0, 8).map((int) => (
                      <div
                        key={int.name}
                        className="flex h-9 items-center justify-center rounded-lg border border-border bg-bg/50 text-[10px] font-semibold text-muted"
                        title={int.name}
                      >
                        {int.abbr}
                      </div>
                    ))}
                  </div>
                ) : null}
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
