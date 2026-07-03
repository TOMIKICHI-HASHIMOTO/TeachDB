"use client";

import { motion } from "framer-motion";

const lines = [
  "Humans preserve knowledge.",
  "AI generates understanding.",
  "Knowledge remains.",
  "Reasoning evolves.",
];

export default function Philosophy() {
  return (
    <section className="relative mx-auto max-w-4xl px-6 py-40 text-center sm:px-10 sm:py-52">
      <div className="flex flex-col gap-3 sm:gap-4">
        {lines.map((line, i) => (
          <motion.p
            key={line}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={`font-display text-3xl font-medium tracking-tight sm:text-5xl ${
              i >= 2 ? "text-gradient" : "text-ink"
            }`}
          >
            {line}
          </motion.p>
        ))}
      </div>
    </section>
  );
}
