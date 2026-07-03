"use client";

import { motion } from "framer-motion";

interface Stage {
  label: string;
  caption?: string;
}

export default function FlowDiagram({ stages }: { stages: Stage[] }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center">
      {stages.map((stage, i) => (
        <div key={stage.label} className="flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            className="glass glass-hover w-full rounded-2xl px-7 py-4 text-center"
          >
            <span className="font-display text-base font-medium text-ink">{stage.label}</span>
            {stage.caption && (
              <p className="mt-1 text-xs text-muted">{stage.caption}</p>
            )}
          </motion.div>

          {i < stages.length - 1 && (
            <div className="relative h-12 w-px overflow-hidden bg-white/10">
              <motion.span
                className="absolute left-0 top-[-100%] h-1/3 w-full bg-gradient-to-b from-transparent via-cyan to-transparent"
                animate={{ top: ["-33%", "100%"] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.3,
                }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
