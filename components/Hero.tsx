"use client";

import { motion } from "framer-motion";
import NeuralField from "./NeuralField";

export default function Hero() {
  return (
    <section id="top" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pb-24 pt-32 sm:px-10">
      <div className="absolute inset-0 z-0">
        <NeuralField density={1} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black" />
        <div className="absolute inset-0 bg-radial-fade" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="eyebrow mx-auto mb-8 justify-center"
        >
          Knowledge Infrastructure for Future AI
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl font-medium leading-[1.08] tracking-tight sm:text-6xl md:text-7xl"
        >
          Build Memory Layers
          <br />
          <span className="text-gradient">for Humanity</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mt-8 max-w-2xl text-balance text-lg leading-relaxed text-muted sm:text-xl"
        >
          TeachDB builds Memory Layers for historical figures. Instead of creating new AI
          models, TeachDB preserves accumulated human knowledge and enables future Large
          Language Models to reason from it.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
          className="mt-11 flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#memory-layer"
            className="group relative inline-flex items-center justify-center rounded-full bg-glow-gradient px-7 py-3.5 text-sm font-semibold text-black shadow-glow-strong transition-transform duration-300 hover:-translate-y-0.5"
          >
            View Concept
          </a>
          <a
            href="https://github.com/TOMIKICHI-HASHIMOTO/TeachDB"
            target="_blank"
            rel="noopener noreferrer"
            className="glass glass-hover inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold text-ink transition-transform duration-300 hover:-translate-y-0.5"
          >
            GitHub
          </a>
        </motion.div>
      </div>

      <div
        aria-hidden="true"
        className="absolute bottom-10 left-1/2 z-10 h-11 w-px -translate-x-1/2 overflow-hidden bg-white/15"
      >
        <span className="absolute top-[-100%] left-0 h-full w-full animate-[scrollDrop_2.4s_ease-in-out_infinite] bg-cyan" />
      </div>

      <style>{`
        @keyframes scrollDrop {
          0% { top: -100%; }
          60% { top: 100%; }
          100% { top: 100%; }
        }
      `}</style>
    </section>
  );
}
