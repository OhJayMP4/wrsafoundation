"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "How to Pledge", href: "/how-to-pledge" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function PublicNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname?.startsWith("/admin")) return null;

  const isActive = (href: string) => pathname === href;

  return (
    <nav style={{
      position: "fixed",
      top: "40px",
      left: 0,
      right: 0,
      zIndex: 500,
      background: "rgba(28, 46, 36, 0.97)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.07)",
    }}>
      <div style={{
        maxWidth: "var(--container-width)",
        margin: "0 auto",
        padding: "0 2rem",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }} className="nav-inner">
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <Image src="/logo.png" alt="WRSA Foundation" width={38} height={38} style={{ objectFit: "contain" }} />
          <span style={{ color: "white", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.95rem", letterSpacing: "0.02em" }}>
            Wildlife Pledge Chain
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }} className="nav-desktop">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "999px",
                color: isActive(link.href) ? "var(--accent)" : "rgba(255,255,255,0.7)",
                fontWeight: 600,
                fontSize: "0.875rem",
                transition: "color 0.15s",
                textDecoration: "none",
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/support-monthly" className="btn-premium" style={{ marginLeft: "0.75rem", fontSize: "0.8rem", minHeight: "38px", padding: "0.5rem 1.25rem", background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "white" }}>
            Support Monthly
          </Link>
          <Link href="/donate" className="btn-premium btn-accent" style={{ marginLeft: "0.5rem", fontSize: "0.8rem", minHeight: "38px", padding: "0.5rem 1.25rem" }}>
            Pledge Now
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="nav-mobile-toggle"
          style={{ background: "none", border: "none", color: "white", cursor: "pointer", padding: "0.5rem" }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={{ background: "rgba(28,46,36,0.98)", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "1rem 2rem 1.5rem" }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{ display: "block", padding: "0.875rem 0", color: isActive(link.href) ? "var(--accent)" : "rgba(255,255,255,0.8)", fontWeight: 600, fontSize: "1rem", borderBottom: "1px solid rgba(255,255,255,0.06)", textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/support-monthly" onClick={() => setMenuOpen(false)} className="btn-premium" style={{ display: "block", textAlign: "center", marginTop: "1.25rem", fontSize: "0.9rem", background: "transparent", border: "2px solid rgba(255,255,255,0.3)", color: "white" }}>
            Support Monthly
          </Link>
          <Link href="/donate" onClick={() => setMenuOpen(false)} className="btn-premium btn-accent" style={{ display: "block", textAlign: "center", marginTop: "0.75rem", fontSize: "0.9rem" }}>
            Pledge Now
          </Link>
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-mobile-toggle { display: none; }
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-toggle { display: block !important; }
          .nav-inner { height: 72px !important; padding: 0 1.25rem !important; }
        }
      `}</style>
    </nav>
  );
}
