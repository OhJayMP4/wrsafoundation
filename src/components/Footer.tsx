"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, Mail, Phone, ArrowRight } from "lucide-react";

const NAV = [
  { label: "About", href: "/about" },
  { label: "How to Pledge", href: "/how-to-pledge" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const CHAIN = [
  { label: "Make a Pledge", href: "/donate" },
  { label: "Honour Roll", href: "/leaderboard" },
  { label: "Live Challenge Board", href: "/#challenge-board" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--primary)", color: "white" }}>

      {/* CTA band */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "4rem 2rem" }}>
        <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ color: "white", fontSize: "clamp(1.5rem,3vw,2.2rem)", marginBottom: "0.5rem" }}>
              Ready to join the <span style={{ color: "var(--accent)" }}>chain?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem", maxWidth: "460px", lineHeight: 1.7 }}>
              Every pledge is a link in a growing network of conservationists committed to protecting Southern Africa's wildlife.
            </p>
          </div>
          <Link href="/donate" className="btn-premium btn-accent" style={{ flexShrink: 0 }}>
            Pledge Now <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Main footer grid */}
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "4rem 2rem", display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.2fr", gap: "3rem" }} className="footer-grid">

        {/* Brand column */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
            <div style={{ width: "36px", height: "36px", background: "var(--accent)", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Award size={20} color="var(--primary)" />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.95rem", color: "white" }}>Wildlife Pledge Chain</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>WRSA Foundation</div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.9rem", lineHeight: 1.75, maxWidth: "280px" }}>
            A peer-to-peer conservation commitment movement, preserving Southern Africa's wildlife for future generations.
          </p>
        </div>

        {/* About column */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Foundation</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", transition: "color 0.15s", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "white")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Chain column */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>The Chain</h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {CHAIN.map((link) => (
              <li key={link.href}>
                <Link href={link.href} style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.9rem", transition: "color 0.15s", textDecoration: "none" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "white")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact column */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <a href="mailto:info@wrsafoundation.co.za" style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              <Mail size={14} style={{ flexShrink: 0, color: "var(--accent)" }} />
              info@wrsafoundation.co.za
            </a>
            <a href="tel:+27120000000" style={{ display: "flex", alignItems: "center", gap: "0.625rem", color: "rgba(255,255,255,0.6)", fontSize: "0.875rem", textDecoration: "none" }}
              onMouseEnter={e => (e.currentTarget.style.color = "white")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
            >
              <Phone size={14} style={{ flexShrink: 0, color: "var(--accent)" }} />
              +27 (0)12 000 0000
            </a>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem", marginTop: "0.25rem", lineHeight: 1.6 }}>
              Pretoria, South Africa
            </p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem 2rem" }}>
        <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem" }}>
            © {year} WRSA Foundation NPC. All rights reserved.
          </p>
          <p style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem" }}>
            Protecting Southern Africa's wildlife since day one.
          </p>
        </div>
      </div>

      <style>{`
        .footer-grid {
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
        }
      `}</style>
    </footer>
  );
}
