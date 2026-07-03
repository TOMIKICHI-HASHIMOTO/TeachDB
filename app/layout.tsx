import type { Metadata } from "next";
import { Space_Grotesk, Manrope } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TeachDB — Building Memory Layers for Humanity",
  description:
    "TeachDB builds Memory Layers for historical figures — preserved human knowledge that future AI models can reason from. Knowledge remains. Reasoning evolves.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${manrope.variable} dark`}>
      <body className="font-body bg-black text-ink">
        <div className="pointer-events-none fixed inset-0 z-[60] grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
