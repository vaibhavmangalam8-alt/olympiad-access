import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--ff-fraunces",
  display: "swap",
});

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--ff-grotesk",
  display: "swap",
});

const jetmono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--ff-jetmono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Orbit/13 — Daily Olympiad Lectures",
  description:
    "A step-wise IOQM & olympiad study surface. Thirteen lectures, tracked daily, pinned to a streak you refuse to break.",
};

export const viewport: Viewport = {
  themeColor: "#0b0b0e",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${grotesk.variable} ${jetmono.variable}`}
    >
      <body className="grain">{children}</body>
    </html>
  );
}
