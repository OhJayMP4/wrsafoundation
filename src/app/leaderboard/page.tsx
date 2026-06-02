"use client";

import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LeaderboardPage() {
  const { donations, pledges, totalRaised, loading } = useApp();

  const topDonors = [...donations].sort((a, b) => b.amount - a.amount).slice(0, 20);
  const deniedPledges = pledges.filter((p) => p.status === "denied");

  const rankIcon = (i: number) => {
    if (i === 0) return <Medal size={20} color="#c5a059" />;
    if (i === 1) return <Medal size={20} color="#9ca3af" />;
    if (i === 2) return <Star size={20} color="#c87941" />;
    return (
      <span style={{ display: "inline-block", width: "20px", textAlign: "center", fontSize: "0.85rem", fontWeight: 700, color: "rgba(28,46,36,0.3)" }}>
        {i + 1}
      </span>
    );
  };

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ background: "var(--primary)", padding: "4rem 2rem 7rem" }}>
        <div style={{ maxWidth: "840px", margin: "0 auto" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.5)", fontWeight: 600, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "2.5rem" }}>
            <ArrowLeft size={14} /> Back to Home
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <Trophy size={42} color="var(--accent)" style={{ flexShrink: 0 }} />
            <div>
              <h1 style={{ color: "white", marginBottom: "0.4rem" }}>The Honour Roll</h1>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem" }}>Recognising the champions of the Wildlife Pledge Chain</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "840px", margin: "-3.5rem auto 0", padding: "0 2rem 6rem", position: "relative", zIndex: 10 }}>

        {/* Total stat */}
        <div className="glass-card" style={{ padding: "2rem 2.5rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem" }}>
          <div>
            <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", opacity: 0.5, marginBottom: "0.35rem", fontFamily: "var(--font-heading)" }}>Total Raised by the Chain</div>
            <div style={{ fontSize: "2.6rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)", lineHeight: 1 }}>R{totalRaised.toLocaleString()}</div>
          </div>
          <Link href="/donate" className="btn-premium btn-accent" style={{ fontSize: "0.875rem", minHeight: "48px", padding: "0.875rem 2rem" }}>
            Join the Legacy
          </Link>
        </div>

        {/* Donors table */}
        <div className="glass-card" style={{ overflow: "hidden", marginBottom: "2rem" }}>
          <div style={{ padding: "1.75rem 2.25rem", borderBottom: "1px solid rgba(28,46,36,0.06)" }}>
            <h2 style={{ fontSize: "1.35rem", margin: 0 }}>Legacy Champions</h2>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "0.875rem 1.5rem", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", opacity: 0.4, fontWeight: 700, fontFamily: "var(--font-heading)", borderBottom: "1px solid rgba(28,46,36,0.06)" }}>#</th>
                <th style={{ padding: "0.875rem 1.5rem", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", opacity: 0.4, fontWeight: 700, fontFamily: "var(--font-heading)", borderBottom: "1px solid rgba(28,46,36,0.06)" }}>Champion</th>
                <th style={{ padding: "0.875rem 1.5rem", textAlign: "left", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", opacity: 0.4, fontWeight: 700, fontFamily: "var(--font-heading)", borderBottom: "1px solid rgba(28,46,36,0.06)" }}>Type</th>
                <th style={{ padding: "0.875rem 1.5rem", textAlign: "right", fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.09em", opacity: 0.4, fontWeight: 700, fontFamily: "var(--font-heading)", borderBottom: "1px solid rgba(28,46,36,0.06)" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", opacity: 0.4 }}>Loading...</td></tr>
              ) : topDonors.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "3rem", textAlign: "center", opacity: 0.45, fontSize: "0.95rem" }}>No confirmed donations yet — be the first.</td></tr>
              ) : (
                topDonors.map((donor, i) => (
                  <tr key={donor.id} style={{ borderBottom: "1px solid rgba(28,46,36,0.04)" }}>
                    <td style={{ padding: "1.35rem 1.5rem", width: "52px" }}>{rankIcon(i)}</td>
                    <td style={{ padding: "1.35rem 1.5rem", fontWeight: 700, color: "var(--primary)", fontSize: "1rem" }}>{donor.donorName}</td>
                    <td style={{ padding: "1.35rem 1.5rem", opacity: 0.55, fontSize: "0.875rem" }}>{donor.type}</td>
                    <td style={{ padding: "1.35rem 1.5rem", textAlign: "right", fontWeight: 800, fontFamily: "var(--font-heading)", fontSize: "1.1rem", color: "var(--primary)" }}>R{donor.amount.toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Declined */}
        {deniedPledges.length > 0 && (
          <div className="glass-card" style={{ overflow: "hidden" }}>
            <div style={{ padding: "1.5rem 2.25rem", borderBottom: "1px solid rgba(28,46,36,0.06)", display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", flexShrink: 0 }} />
              <h2 style={{ fontSize: "1.2rem", margin: 0 }}>Declined Nominations</h2>
            </div>
            <div style={{ padding: "1.75rem 2.25rem" }}>
              <p style={{ opacity: 0.6, marginBottom: "1.5rem", fontSize: "0.95rem", lineHeight: 1.6 }}>
                The following peers were nominated but chose not to accept the challenge at this time.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {deniedPledges.map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.25rem 1.5rem", background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.15)", borderRadius: "var(--radius-sm)" }}>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: "0.25rem", fontSize: "1rem" }}>{p.fullName}</div>
                      <div style={{ fontSize: "0.825rem", opacity: 0.55 }}>Nominated by {p.challengedBy}</div>
                    </div>
                    <span style={{ background: "#fee2e2", color: "#991b1b", padding: "0.35rem 0.875rem", borderRadius: "999px", fontSize: "0.65rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.07em", fontFamily: "var(--font-heading)", whiteSpace: "nowrap" }}>
                      Declined
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
