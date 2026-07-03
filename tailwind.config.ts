import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        black: "#050608",
        navy: {
          DEFAULT: "#0A1120",
          soft: "#0E1826",
          deep: "#060B14",
        },
        ink: "#F4F6FA",
        muted: "#8B93A7",
        faint: "#4C5364",
        electric: {
          DEFAULT: "#2E6BFF",
          dim: "rgba(46,107,255,0.35)",
        },
        cyan: {
          DEFAULT: "#22D3EE",
          dim: "rgba(34,211,238,0.35)",
        },
      },
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-manrope)", "sans-serif"],
      },
      backgroundImage: {
        "glow-gradient": "linear-gradient(120deg, #2E6BFF, #22D3EE)",
        "radial-fade": "radial-gradient(ellipse at center, rgba(46,107,255,0.12), transparent 70%)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(34,211,238,0.35)",
        "glow-strong": "0 0 60px -8px rgba(46,107,255,0.45)",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 8s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
