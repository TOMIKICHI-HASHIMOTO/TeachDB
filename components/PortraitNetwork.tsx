"use client";

import { motion } from "framer-motion";

// Node coordinates approximate a seated scholar's head and shoulders —
// the silhouette emerges from the network rather than being drawn over it.
const outline: [number, number][] = [
  [195, 90], [188.97, 112.5], [172.5, 128.97], [150, 135], [127.5, 128.97],
  [111.03, 112.5], [105, 90], [111.03, 67.5], [127.5, 51.03], [150, 45],
  [172.5, 51.03], [188.97, 67.5],
  [110, 180], [95, 220], [82, 260], [74, 300], [70, 336],
  [190, 180], [205, 220], [218, 260], [226, 300], [230, 336],
];

const inner: [number, number][] = [
  [150, 92], [138, 108], [162, 104], [150, 150], [150, 185],
  [128, 222], [172, 222], [150, 258], [120, 298], [180, 298], [150, 322],
];

const links: [number, number][] = [
  // head ring
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9], [9, 10], [10, 11], [11, 0],
  // head interior
  [22, 23], [22, 24], [23, 24], [22, 3],
  // neck
  [3, 25], [25, 26],
  // shoulder chains
  [12, 13], [13, 14], [14, 15], [15, 16],
  [17, 18], [18, 19], [19, 20], [20, 21],
  // shoulders to neck
  [12, 25], [17, 25],
  // chest
  [26, 27], [26, 28], [27, 29], [28, 29], [29, 30], [29, 31], [30, 32], [31, 32],
];

const allNodes = [...outline, ...inner];

export default function PortraitNetwork() {
  return (
    <div className="relative mx-auto aspect-[3/3.4] w-full max-w-sm">
      <div className="absolute inset-0 rounded-full bg-glow-gradient opacity-[0.08] blur-3xl" />
      <svg viewBox="0 0 300 340" className="relative h-full w-full" aria-hidden="true">
        <defs>
          <linearGradient id="portraitLine" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2E6BFF" stopOpacity="0.55" />
            <stop offset="1" stopColor="#22D3EE" stopOpacity="0.55" />
          </linearGradient>
        </defs>

        {links.map(([a, b], i) => {
          const [x1, y1] = allNodes[a];
          const [x2, y2] = allNodes[b];
          return (
            <motion.line
              key={i}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#portraitLine)"
              strokeWidth="0.8"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: i * 0.02, ease: "easeInOut" }}
            />
          );
        })}

        {allNodes.map(([x, y], i) => (
          <motion.circle
            key={i}
            cx={x} cy={y} r={i < outline.length ? 1.6 : 2.1}
            fill={i < outline.length ? "#8CBEFF" : "#22D3EE"}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: [0, 1, 0.7] }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 + i * 0.015 }}
          />
        ))}
      </svg>
    </div>
  );
}
