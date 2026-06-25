"use client";

import Link from "next/link";
import { ArrowRight, Heart, Shield, Leaf, Users, CalendarCheck, RefreshCcw } from "lucide-react";
import { useSupporterAuth } from "@/context/SupporterAuthContext";
import { DEBIT_ORDER_TIERS } from "@/types/debitOrder";
import FadeIn from "@/components/FadeIn";

export default function SupportMonthlyPage() {
  const { supporter } = useSupporterAuth();

  const ctaHref = supporter ? "/support-monthly/setup" : "/support-monthly/signup";

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--primary)", color: "white", padding: "5rem 1.5rem 6rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto", textAlign: "center" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(197,160,89,0.15)", border: "1px solid rgba(197,160,89,0.4)", padding: "0.5rem 1.25rem", borderRadius: "999px", color: "#e8c97a", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.5rem" }}>
            <RefreshCcw size={14} /> Monthly Giving
          </div>
          <h1 style={{ color: "white", fontSize: "clamp(2.2rem,5vw,3.5rem)", marginBottom: "1.25rem" }}>
            Sustain the Fight, <span className="text-accent">Every Month</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "620px", margin: "0 auto 2.5rem" }}>
            A one-time pledge makes an impact. A monthly debit order builds a movement. Join our committed supporters with a recurring contribution, sustained over 6 to 12 months.
          </p>
          <Link href={ctaHref} className="btn-premium btn-accent">
            {supporter ? "Set Up My Debit Order" : "Become a Monthly Supporter"} <ArrowRight size={18} />
          </Link>
        </div>
      </div>

      {/* Tiers */}
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "5rem 1.5rem" }}>
        <FadeIn direction="up">
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <h2 style={{ fontSize: "clamp(1.8rem,3vw,2.4rem)", marginBottom: "0.75rem" }}>Choose Your Tier</h2>
            <p style={{ opacity: 0.6, fontSize: "1.05rem", maxWidth: "480px", margin: "0 auto" }}>
              Pick a monthly amount that suits you, or set a custom figure during setup.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
          {DEBIT_ORDER_TIERS.map((tier, i) => (
            <FadeIn key={tier.tier} direction="up" delay={i * 80}>
              <div className="glass-card card-hover" style={{ padding: "2.25rem 1.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--accent)", marginBottom: "0.75rem" }}>
                  {tier.label}
                </div>
                <div style={{ fontSize: "2.4rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)", marginBottom: "0.25rem" }}>
                  R{tier.amount.toLocaleString()}
                </div>
                <div style={{ opacity: 0.5, fontSize: "0.85rem" }}>per month</div>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn direction="up">
          <div className="glass-card" style={{ padding: "1.5rem 2rem", textAlign: "center" }}>
            <p style={{ opacity: 0.7, fontSize: "0.95rem" }}>
              Prefer a different amount? You can set a <strong>custom monthly figure</strong> during the setup process.
            </p>
          </div>
        </FadeIn>
      </div>

      {/* How it works */}
      <div style={{ background: "#f4f0e8", padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: "var(--container-width)", margin: "0 auto" }}>
          <FadeIn direction="up">
            <h2 style={{ textAlign: "center", fontSize: "clamp(1.8rem,3vw,2.4rem)", marginBottom: "3rem" }}>How It Works</h2>
          </FadeIn>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: <Users size={26} />, title: "1. Create an Account", body: "Sign up with your email so you can manage your debit order details securely." },
              { icon: <CalendarCheck size={26} />, title: "2. Set Up Your Order", body: "Choose your tier or custom amount, your preferred debit date, and a commitment period of 6–12 months." },
              { icon: <Shield size={26} />, title: "3. We Confirm With You", body: "Our team reviews your mandate and confirms via email before your first debit is processed." },
              { icon: <Heart size={26} />, title: "4. Your Impact Continues", body: "Every month, your contribution funds ongoing conservation work — automatically, reliably." },
            ].map((step, i) => (
              <FadeIn key={step.title} direction="up" delay={i * 80}>
                <div className="glass-card card-hover" style={{ padding: "2rem" }}>
                  <div style={{ color: "var(--accent)", marginBottom: "1rem" }}>{step.icon}</div>
                  <h3 style={{ fontSize: "1.05rem", marginBottom: "0.6rem" }}>{step.title}</h3>
                  <p style={{ opacity: 0.65, fontSize: "0.9rem", lineHeight: 1.7 }}>{step.body}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>

      {/* What happens with your money */}
      <div style={{ maxWidth: "var(--container-width)", margin: "0 auto", padding: "5rem 1.5rem" }}>
        <FadeIn direction="up">
          <div className="glass-card" style={{ padding: "3rem 2.5rem" }}>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.1rem)", marginBottom: "0.75rem" }}>What Happens With Your Money</h2>
            <p style={{ opacity: 0.6, marginBottom: "2.5rem", maxWidth: "560px" }}>
              Your monthly debit order provides predictable, year-round funding that lets us plan conservation work further into the future than once-off donations allow.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
              {[
                { pct: "40%", label: "Anti-Poaching Operations", icon: <Shield size={22} /> },
                { pct: "25%", label: "Habitat Restoration", icon: <Leaf size={22} /> },
                { pct: "20%", label: "Community Education", icon: <Users size={22} /> },
                { pct: "15%", label: "Research & Monitoring", icon: <Heart size={22} /> },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center", padding: "1.5rem 1rem", background: "#faf8f4", borderRadius: "var(--radius-md)" }}>
                  <div style={{ color: "var(--accent)", marginBottom: "0.75rem", display: "flex", justifyContent: "center" }}>{item.icon}</div>
                  <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)", marginBottom: "0.4rem" }}>{item.pct}</div>
                  <div style={{ opacity: 0.6, fontSize: "0.85rem", lineHeight: 1.5 }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </div>

      {/* Final CTA */}
      <div style={{ textAlign: "center", padding: "0 1.5rem 6rem" }}>
        <Link href={ctaHref} className="btn-premium btn-accent">
          {supporter ? "Set Up My Debit Order" : "Become a Monthly Supporter"} <ArrowRight size={18} />
        </Link>
      </div>

    </div>
  );
}
