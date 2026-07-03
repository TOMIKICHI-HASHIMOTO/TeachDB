"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#memory-layer", label: "Memory Layer" },
  { href: "#why", label: "Why TeachDB" },
  { href: "#poc", label: "Proof of Concept" },
  { href: "#vision", label: "Vision" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 backdrop-blur-xl transition-colors duration-300 sm:px-10 ${
        scrolled ? "border-b border-white/10 bg-black/70" : "border-b border-transparent bg-black/20"
      }`}
    >
      <a href="#top" className="flex items-center gap-2.5">
        <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="16" stroke="#22D3EE" strokeWidth="0.6" opacity="0.3" />
          <circle cx="24" cy="24" r="9" stroke="#2E6BFF" strokeWidth="0.9" opacity="0.6" />
          <circle cx="24" cy="24" r="3" fill="#22D3EE" />
        </svg>
        <span className="font-display text-lg font-medium tracking-tight">TeachDB</span>
      </a>

      <nav className="hidden items-center gap-9 text-sm text-muted md:flex">
        {links.map((link) => (
          <a key={link.href} href={link.href} className="transition-colors hover:text-ink">
            {link.label}
          </a>
        ))}
        <a
          href="https://github.com/TOMIKICHI-HASHIMOTO/TeachDB"
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-ink"
        >
          GitHub
        </a>
      </nav>

      <a
        href="https://github.com/TOMIKICHI-HASHIMOTO/TeachDB"
        target="_blank"
        rel="noopener noreferrer"
        className="hidden rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-ink transition-all hover:border-cyan/50 hover:bg-white/5 sm:inline-flex"
      >
        View Concept
      </a>
    </header>
  );
}
