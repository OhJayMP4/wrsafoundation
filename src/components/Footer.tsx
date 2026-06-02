"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Phone, ArrowRight } from "lucide-react";
import Image from "next/image";

const NAV = [
  { label: "About", href: "/about" },
  { label: "How to Pledge", href: "/how-to-pledge" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const CHAIN = [
  { label: "Make a Pledge", href: "/donate" },
  { label: "Honour Roll", href: "/leaderboard" },
  { label: "Live Challenge Board", href: "/" },
];

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "var(--primary)", color: "white", overflowX: "hidden" }}>

      <style>{`
        .footer-cta-band {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          padding: 3.5rem 1.5rem;
        }
        .footer-cta-inner {
          max-width: var(--container-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          flex-wrap: wrap;
        }
        .footer-grid {
          max-width: var(--container-width);
          margin: 0 auto;
          padding: 3.5rem 1.5rem;
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1.2fr;
          gap: 2.5rem;
        }
        .footer-bottom {
          border-top: 1px solid rgba(255,255,255,0.07);
          padding: 1.25rem 1.5rem;
          max-width: 100%;
        }
        .footer-bottom-inner {
          max-width: var(--container-width);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .footer-link {
          color: rgba(255,255,255,0.6);
          font-size: 0.875rem;
          text-decoration: none;
          transition: color 0.15s;
          display: block;
          padding: 0.2rem 0;
        }
        .footer-link:hover { color: white; }

        @media (max-width: 860px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2rem;
          }
        }
        @media (max-width: 540px) {
          .footer-cta-band { padding: 2.5rem 1.25rem; }
          .footer-cta-inner { flex-direction: column; align-items: flex-start; }
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 1.75rem;
            padding: 2.5rem 1.25rem;
          }
          .footer-bottom-inner { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        }
      `}</style>

      {/* CTA band */}
      <div className="footer-cta-band">
        <div className="footer-cta-inner">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ color: "white", fontSize: "clamp(1.3rem,3vw,2rem)", marginBottom: "0.5rem" }}>
              Ready to join the <span style={{ color: "var(--accent)" }}>chain?</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.95rem", lineHeight: 1.7, maxWidth: "420px" }}>
              Every pledge is a link in a growing network of conservationists committed to protecting Southern Africa's wildlife.
            </p>
          </div>
          <Link href="/donate" className="btn-premium btn-accent" style={{ flexShrink: 0, fontSize: "0.875rem" }}>
            Pledge Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Main grid */}
      <div className="footer-grid">

        {/* Brand */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
            <Image src="/logo.png" alt="WRSA Foundation" width={40} height={40} style={{ objectFit: "contain", flexShrink: 0 }} />
            <div>
              <div style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "0.9rem", color: "white", lineHeight: 1.2 }}>Wildlife Pledge Chain</div>
              <div style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>WRSA Foundation</div>
            </div>
          </div>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.875rem", lineHeight: 1.75, maxWidth: "260px" }}>
            A peer-to-peer conservation commitment movement, preserving Southern Africa's wildlife for future generations.
          </p>
        </div>

        {/* Foundation links */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Foundation</h4>
          <ul style={{ listStyle: "none" }}>
            {NAV.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Chain links */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>The Chain</h4>
          <ul style={{ listStyle: "none" }}>
            {CHAIN.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="footer-link">{link.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ color: "var(--accent)", fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.25rem" }}>Contact</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <a href="mailto:info@wrsafoundation.co.za" className="footer-link" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Mail size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />
              info@wrsafoundation.co.za
            </a>
            <a href="tel:+27120000000" className="footer-link" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Phone size={13} style={{ color: "var(--accent)", flexShrink: 0 }} />
              +27 (0)12 000 0000
            </a>
            <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.8rem", marginTop: "0.25rem" }}>
              Pretoria, South Africa
            </p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="footer-bottom-inner">
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem" }}>
            © {year} WRSA Foundation NPC. All rights reserved.
          </p>
          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>
            Protecting Southern Africa's wildlife.
          </p>
        </div>
      </div>

    </footer>
  );
}
