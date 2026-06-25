"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSupporterAuth } from "@/context/SupporterAuthContext";
import { SupporterRouteGuard } from "@/components/SupporterRouteGuard";
import { DebitOrder } from "@/types/debitOrder";
import { CalendarCheck, LogOut, Clock, CheckCircle2, XCircle, Banknote, Mail, Phone, HelpCircle } from "lucide-react";

function statusBadge(status: DebitOrder["status"]) {
  const map: Record<DebitOrder["status"], { bg: string; color: string; label: string; icon: React.ReactNode }> = {
    pending: { bg: "#fef3c7", color: "#92400e", label: "Pending Confirmation", icon: <Clock size={14} /> },
    active: { bg: "#dcfce7", color: "#166534", label: "Active", icon: <CheckCircle2 size={14} /> },
    completed: { bg: "#e0e7ff", color: "#3730a3", label: "Completed", icon: <CheckCircle2 size={14} /> },
    cancelled: { bg: "#fee2e2", color: "#991b1b", label: "Cancelled", icon: <XCircle size={14} /> },
  };
  const s = map[status];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: s.bg, color: s.color, padding: "0.4rem 0.875rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 700 }}>
      {s.icon} {s.label}
    </span>
  );
}

function DashboardContent() {
  const { supporter, logOut } = useSupporterAuth();
  const [order, setOrder] = useState<DebitOrder | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      if (!supporter) return;
      const snap = await getDoc(doc(db, "debitOrders", supporter.uid));
      if (snap.exists()) setOrder({ id: snap.id, ...snap.data() } as DebitOrder);
      setLoading(false);
    }
    fetchOrder();
  }, [supporter]);

  if (loading) {
    return <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.5 }}>Loading...</div>;
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 1.5rem 6rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2.5rem", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.4rem)", marginBottom: "0.4rem" }}>
            Welcome, <span className="text-accent">{supporter?.displayName?.split(" ")[0] || "Supporter"}</span>
          </h1>
          <p style={{ opacity: 0.6 }}>{supporter?.email}</p>
        </div>
        <button onClick={() => logOut()} style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px solid rgba(28,46,36,0.15)", padding: "0.6rem 1.1rem", borderRadius: "999px", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700, opacity: 0.7 }}>
          <LogOut size={14} /> Log Out
        </button>
      </div>

      {!order ? (
        <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
          <Banknote size={40} color="var(--accent)" style={{ margin: "0 auto 1.25rem" }} />
          <h2 style={{ fontSize: "1.4rem", marginBottom: "0.75rem" }}>No Debit Order Set Up Yet</h2>
          <p style={{ opacity: 0.6, marginBottom: "2rem", lineHeight: 1.7 }}>
            You haven't set up your monthly debit order yet. It only takes a few minutes.
          </p>
          <Link href="/support-monthly/setup" className="btn-premium btn-accent">Set Up My Debit Order</Link>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: "2.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.3rem", margin: 0 }}>Your Debit Order</h2>
            {statusBadge(order.status)}
          </div>

          <div style={{ background: "#faf8f4", borderRadius: "var(--radius-md)", padding: "2rem", textAlign: "center", marginBottom: "2rem" }}>
            <div style={{ fontSize: "0.75rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.5rem" }}>Monthly Contribution</div>
            <div style={{ fontSize: "2.8rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--primary)" }}>R{order.amount.toLocaleString()}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.72rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "6px" }}>
                <CalendarCheck size={13} /> Debit Day
              </div>
              <div style={{ fontWeight: 700 }}>{order.debitDay}{order.debitDay === 1 ? "st" : "th"} of each month</div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.4rem" }}>Commitment</div>
              <div style={{ fontWeight: 700 }}>{order.commitmentMonths} months</div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.4rem" }}>Applicant Type</div>
              <div style={{ fontWeight: 700, textTransform: "capitalize" }}>{order.applicantType}</div>
            </div>
            <div>
              <div style={{ fontSize: "0.72rem", opacity: 0.5, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: "0.4rem" }}>First Debit</div>
              <div style={{ fontWeight: 700 }}>{order.startDate}</div>
            </div>
          </div>

          {order.status === "pending" && (
            <div style={{ marginTop: "2rem", padding: "1rem 1.25rem", background: "rgba(197,160,89,0.08)", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", opacity: 0.75, lineHeight: 1.6 }}>
              Our team is reviewing your mandate and will confirm by email before your first debit is processed.
            </div>
          )}
        </div>
      )}

      {order && (
        <div className="glass-card" style={{ padding: "2rem", marginTop: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
            <HelpCircle size={20} color="var(--accent)" />
            <h3 style={{ fontSize: "1.1rem", margin: 0 }}>Need to Make Changes?</h3>
          </div>
          <p style={{ opacity: 0.65, lineHeight: 1.7, fontSize: "0.9rem", marginBottom: "1.5rem" }}>
            If you'd like to cancel your debit order, change your monthly amount, or have any questions or concerns, please contact the WRSA Foundation directly — our team is happy to help.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="mailto:foundation@wrsa.co.za" className="btn-premium btn-primary" style={{ fontSize: "0.85rem", minHeight: "44px", padding: "0.75rem 1.5rem" }}>
              <Mail size={15} /> foundation@wrsa.co.za
            </a>
            <a href="tel:+27769086458" className="btn-premium" style={{ fontSize: "0.85rem", minHeight: "44px", padding: "0.75rem 1.5rem", border: "2px solid rgba(28,46,36,0.15)", background: "transparent", color: "var(--primary)" }}>
              <Phone size={15} /> +27 76 908 6458
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SupporterRouteGuard>
      <DashboardContent />
    </SupporterRouteGuard>
  );
}
