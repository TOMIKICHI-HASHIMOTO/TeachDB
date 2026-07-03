"use client";

import { motion } from "framer-motion";
import NeuralField from "./NeuralField";

export default function Vision() {
  return (
    <section id="vision" className="relative overflow-hidden px-6 py-40 sm:px-10 sm:py-52">
      <div className="absolute inset-0 z-0 opacity-70">
        <NeuralField density={1.4} />
      </div>
      <div className="absolute inset-0 z-0 bg-radial-fade" />
      <div className="pointer-events-none absolute inset-0 z-0 shadow-[inset_0_0_180px_60px_rgba(0,0,0,0.6)]" />

      <div className="relative z-10 mx-auto max-w-3xl text-center">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="eyebrow justify-center"
        >
          The Vision
        </motion.p>

        <motion.h2
          initial={{ opacity: 0, y: 26 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-medium leading-[1.05] tracking-tight sm:text-7xl"
        >
          Kenjindo
          <br />
          <span className="text-gradient">House of Wisdom</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted"
        >
          A digital library where every historical figure has their own Memory Layer.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 font-display text-xl tracking-tight text-ink"
        >
          TeachDB is the foundation. Kenjindo is the future.
        </motion.p>
      </div>
    </section>
  );
}
