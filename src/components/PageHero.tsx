"use client";

import Image from "next/image";

interface PageHeroProps {
  /** Path to the background image in /public, e.g. "/about-hero.jpg" */
  image: string;
  children: React.ReactNode;
  minHeight?: string;
}

/**
 * Dark hero-style banner used at the top of marketing pages (About, FAQ, etc).
 * Mirrors the homepage hero treatment: cover image, dark saturation, gradient
 * overlay for text legibility. If the image file is missing, the gradient +
 * --primary fallback color still renders correctly, so this is safe to wire
 * up before the actual image asset exists.
 */
export default function PageHero({ image, children, minHeight = "320px" }: PageHeroProps) {
  return (
    <div style={{ position: "relative", overflow: "hidden", minHeight, background: "var(--primary)" }}>
      <Image
        src={image}
        alt=""
        fill
        style={{ objectFit: "cover", filter: "brightness(0.55) saturate(0.8)" }}
        priority={false}
      />
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(160deg, rgba(28,46,36,0.55) 0%, rgba(28,46,36,0.88) 100%)",
      }} />
      <div style={{ position: "relative", zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}
