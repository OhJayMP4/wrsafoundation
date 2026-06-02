"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Pledge } from "@/context/AppContext";
import styles from "../../../donate/donate.module.css";
import { ArrowLeft, Flame, Mail, Phone, MessageSquare, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChallengePayPage() {
  const { id } = useParams();
  const router = useRouter();
  const { updatePledgeStatus } = useApp();

  const [pledge, setPledge] = useState<Pledge | null>(null);
  const [loading, setLoading] = useState(true);

  const [amount, setAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ email: "", phone: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    async function fetchPledge() {
      if (!id) return;
      try {
        const docRef = doc(db, "pledges", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const p = { id: docSnap.id, ...docSnap.data() } as Pledge;
          setPledge(p);
          setAmount(p.amount);
        }
      } catch (err) {
        console.error("Error fetching pledge:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPledge();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pledge || !formData.email) return;
    setIsSubmitting(true);

    try {
      // 1. Update pledge status to awaiting_payment and store contact details
      const pledgeRef = doc(db, "pledges", pledge.id);
      await updateDoc(pledgeRef, {
        status: "awaiting_payment",
        pledgerEmail: formData.email,
        pledgerPhone: formData.phone || null,
        amount: Number(amount),
      });

      // 2. Send notification email to admin
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pledge_admin_notify",
          pledgerName: pledge.fullName,
          pledgerEmail: formData.email,
          pledgerPhone: formData.phone || undefined,
          pledgerMessage: formData.message || undefined,
          amount: Number(amount),
          pledgeId: pledge.id,
        }),
      });

      // 3. Send banking details / invoice to pledger
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pledge_invoice",
          pledgerName: pledge.fullName,
          pledgerEmail: formData.email,
          amount: Number(amount),
          pledgeId: pledge.id,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Loading challenge details...
      </div>
    );
  }

  if (!pledge) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        Challenge not found. <Link href="/" style={{ marginLeft: "8px", color: "var(--accent)" }}>Return Home</Link>
      </div>
    );
  }

  if (pledge.status !== "pending") {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="glass-card" style={{ maxWidth: "500px", textAlign: "center", padding: "3rem" }}>
          <CheckCircle2 size={48} color="var(--accent)" style={{ margin: "0 auto 1.5rem" }} />
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>
            {pledge.status === "awaiting_payment" ? "Pledge Already Committed" : "Challenge Already Processed"}
          </h1>
          <p style={{ opacity: 0.7, marginBottom: "2rem", lineHeight: 1.6 }}>
            {pledge.status === "awaiting_payment"
              ? "This pledge has already been committed. The WRSA team will be in touch to finalise payment."
              : "This challenge has already been completed. Thank you for your support."}
          </p>
          <Link href="/leaderboard" className="btn-premium btn-primary">View the Honour Roll</Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf9", padding: "2rem" }}>
        <div style={{ width: "100%", maxWidth: "560px", textAlign: "center" }}>
          <div style={{ background: "#dcfce7", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 2rem", color: "#166534" }}>
            <CheckCircle2 size={40} />
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.2 }}>Pledge Committed!</h1>
          <p style={{ opacity: 0.7, fontSize: "1.125rem", maxWidth: "420px", margin: "0 auto 2rem", lineHeight: 1.6 }}>
            Thank you, <strong>{pledge.fullName.split(" ")[0]}</strong>. Your commitment of <strong>R{Number(amount).toLocaleString()}</strong> has been received.
          </p>
          <div className="glass-card" style={{ padding: "2rem", marginBottom: "2rem", textAlign: "left", background: "white" }}>
            <h3 style={{ fontWeight: 800, marginBottom: "0.75rem" }}>What happens next?</h3>
            <ol style={{ paddingLeft: "1.25rem", opacity: 0.8, lineHeight: 1.8, margin: 0 }}>
              <li>A confirmation has been sent to <strong>{formData.email}</strong>.</li>
              <li>The WRSA Foundation team will contact you to arrange payment.</li>
              <li>Once payment is confirmed, you will appear on the public Honour Roll.</li>
            </ol>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button
              onClick={() => router.push(`/nominate?nominatorName=${encodeURIComponent(pledge.fullName)}&pledgeId=${pledge.id}`)}
              className="btn-premium btn-accent"
              style={{ padding: "1.25rem", fontSize: "1.125rem" }}
            >
              Nominate Someone Next
            </button>
            <Link href="/leaderboard" className="btn-premium btn-primary" style={{ border: "1px solid var(--glass-border)", padding: "1.25rem", fontSize: "1.125rem" }}>
              View the Honour Roll
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backLink} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, font: "inherit", color: "inherit" }}>
        <ArrowLeft size={16} /> Back to Challenge
      </button>

      <div className={styles.header}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(255,255,255,0.1)", padding: "0.5rem 1rem", borderRadius: "999px", fontSize: "0.875rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--accent)", marginBottom: "1rem" }}>
          <Flame size={16} /> Challenge Accepted
        </div>
        <h1 className={styles.title}>Commit Your <span className="text-accent">Legacy</span></h1>
        <p>Confirm your pledge and we will be in touch to finalise payment — no card details needed here.</p>
      </div>

      <div className={`${styles.formCard} glass-card`}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>01</span>
          <label className={styles.label}>Confirm Contribution Amount</label>
        </div>

        <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          {pledge.challengedBy} challenged you to R{pledge.amount.toLocaleString()}. You may match, exceed, or adjust this amount.
        </p>

        <div className={styles.amountGrid} style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <button
            type="button"
            className={`${styles.amountButton} ${amount === pledge.amount ? styles.amountButtonActive : ""}`}
            onClick={() => setAmount(pledge.amount)}
          >
            Match Challenge
            <br /><span style={{ fontSize: "0.8rem", opacity: 0.8 }}>(R{pledge.amount.toLocaleString()})</span>
          </button>
          <button
            type="button"
            className={`${styles.amountButton} ${amount === Math.round(pledge.amount * 1.5) ? styles.amountButtonActive : ""}`}
            onClick={() => setAmount(Math.round(pledge.amount * 1.5))}
          >
            Exceed
            <br /><span style={{ fontSize: "0.8rem", opacity: 0.8 }}>(R{Math.round(pledge.amount * 1.5).toLocaleString()})</span>
          </button>
          <div className={styles.customInputWrapper}>
            <span className={styles.currencyPrefix}>R</span>
            <input
              type="number"
              placeholder="Custom"
              className={styles.customInput}
              value={amount}
              min={1}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.sectionHeader} style={{ marginTop: "3rem" }}>
          <span className={styles.stepNumber}>02</span>
          <label className={styles.label}>Your Contact Details</label>
        </div>

        <p style={{ opacity: 0.7, marginBottom: "1.5rem", fontSize: "0.9rem" }}>
          We will use these details to contact you and arrange payment. No money changes hands on this form.
        </p>

        <form onSubmit={handleSubmit} className={styles.innerForm}>
          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
            <input
              type="email"
              required
              className={styles.inputField}
              placeholder="Your Email Address"
              style={{ paddingLeft: "2.5rem" }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <Phone size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", opacity: 0.4 }} />
            <input
              type="tel"
              className={styles.inputField}
              placeholder="Phone Number (optional)"
              style={{ paddingLeft: "2.5rem" }}
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className={styles.inputGroup} style={{ position: "relative" }}>
            <MessageSquare size={16} style={{ position: "absolute", left: "14px", top: "1rem", opacity: 0.4 }} />
            <textarea
              className={styles.inputField}
              placeholder="Message of support (optional)"
              rows={3}
              style={{ paddingLeft: "2.5rem" }}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button disabled={isSubmitting || !amount || amount < 1} type="submit" className="btn-premium btn-accent" style={{ width: "100%", marginTop: "2rem", height: "4rem" }}>
            {isSubmitting ? "Submitting..." : `Commit My Pledge of R${Number(amount).toLocaleString()}`}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(197,160,89,0.08)", borderRadius: "8px", display: "flex", gap: "12px", alignItems: "flex-start", fontSize: "0.8rem", opacity: 0.8 }}>
          <Mail size={14} style={{ flexShrink: 0, marginTop: "2px", color: "var(--accent)" }} />
          <span>No payment is captured here. After you submit, a member of the WRSA Foundation team will contact you directly to arrange a secure transfer.</span>
        </div>
      </div>
    </div>
  );
}
