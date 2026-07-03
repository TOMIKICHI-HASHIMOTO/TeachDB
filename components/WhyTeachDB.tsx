"use client";

import { motion } from "framer-motion";
import Reveal from "./Reveal";

const cards = [
  {
    title: "Knowledge",
    body: "Preserve everything known about one historical figure.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <circle cx="13" cy="13" r="9" stroke="currentColor" strokeWidth="1.3" />
        <circle cx="13" cy="13" r="3.2" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Reasoning",
    body: "Allow any future LLM to reason using preserved knowledge.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 3 L16.5 11 L24 13 L16.5 15 L13 23 L9.5 15 L2 13 L9.5 11 Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Future",
    body: "Create digital cultural assets for future generations.",
    icon: (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <path d="M13 2 L13 8 M13 18 L13 24 M2 13 L8 13 M18 13 L24 13" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <circle cx="13" cy="13" r="5" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
];

export default function WhyTeachDB() {
  return (
    <section id="why" className="relative border-y border-white/5 bg-navy-deep/60 px-6 py-32 sm:px-10 sm:py-40">
      <Reveal className="mx-auto mb-16 max-w-xl text-center">
        <p className="eyebrow justify-center">Why TeachDB</p>
        <h2 className="font-display text-3xl font-medium leading-tight tracking-tight sm:text-4xl">
          Three ideas. One infrastructure.
        </h2>
      </Reveal>

      <div className="mx-auto grid max-w-5xl gap-5 sm:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -6 }}
            className="glass glass-hover group rounded-2xl p-8"
          >
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-cyan transition-colors duration-300 group-hover:text-electric group-hover:border-cyan/40">
              {card.icon}
            </div>
            <h3 className="font-display text-lg font-medium">{card.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{card.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
