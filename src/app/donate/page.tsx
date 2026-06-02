"use client";

import { useState, Suspense } from "react";
import styles from "./donate.module.css";
import { ArrowLeft, ArrowRight, Share2, UserPlus, CheckCircle2, Copy, Check, Mail } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter } from "next/navigation";

const AMOUNTS = [
  { label: "R5,000", value: 5000 },
  { label: "R10,000", value: 10000 },
  { label: "R20,000", value: 20000 },
  { label: "R36,000", value: 36000 },
];

type Step = 1 | 2 | 3;

function DonateForm() {
  const { addPledge } = useApp();
  const router = useRouter();

  const [step, setStep] = useState<Step>(1);
  const [amount, setAmount] = useState<number>(36000);
  const [customAmount, setCustomAmount] = useState("");

  const [pledgerData, setPledgerData] = useState({
    name: "",
    email: "",
    phone: "",
    organization: "",
    message: "",
  });

  const [nomineeData, setNomineeData] = useState({
    name: "",
    organization: "",
    email: "",
    amount: 36000,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pledgeId, setPledgeId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const effectiveAmount = customAmount ? Number(customAmount) : amount;

  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submitPledge = async (withNominee: boolean) => {
    setIsSubmitting(true);
    try {
      // Create the pledger's own pledge record
      const newPledgeId = await addPledge(
        {
          fullName: pledgerData.name,
          organization: pledgerData.organization || "Individual",
          amount: effectiveAmount,
          challengedBy: "Direct Donation",
          pledgerEmail: pledgerData.email,
          pledgerPhone: pledgerData.phone || undefined,
          nomineeEmail: undefined,
        },
        "awaiting_payment"
      );
      setPledgeId(newPledgeId);

      // Send invoice email to pledger
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pledge_invoice",
          pledgerName: pledgerData.name,
          pledgerEmail: pledgerData.email,
          amount: effectiveAmount,
          pledgeId: newPledgeId,
          pledgerMessage: pledgerData.message || undefined,
        }),
      });

      // Notify admin
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pledge_admin_notify",
          pledgerName: pledgerData.name,
          pledgerEmail: pledgerData.email,
          pledgerPhone: pledgerData.phone || undefined,
          organization: pledgerData.organization || undefined,
          amount: effectiveAmount,
          pledgeId: newPledgeId,
          pledgerMessage: pledgerData.message || undefined,
        }),
      });

      // If nominating, create nominee pledge and send them an email
      if (withNominee && nomineeData.name && nomineeData.email) {
        const nomineePledgeId = await addPledge({
          fullName: nomineeData.name,
          organization: nomineeData.organization || "Individual",
          amount: nomineeData.amount,
          challengedBy: pledgerData.name,
          nomineeEmail: nomineeData.email,
        });

        const challengeLink = `${window.location.origin}/challenge/${nomineePledgeId}`;
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "nominee_challenge",
            nomineeName: nomineeData.name,
            nomineeEmail: nomineeData.email,
            challengedBy: pledgerData.name,
            amount: nomineeData.amount,
            challengeLink,
          }),
        });
      }

      // Jump to confirmation
      setStep(3);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNoNominee = () => submitPledge(false);
  const handleStep3Submit = (e: React.FormEvent) => { e.preventDefault(); submitPledge(true); };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ── Confirmation screen ──
  if (step === 3 && pledgeId) {
    return (
      <div style={{ minHeight: "100vh", background: "#f8faf9", display: "flex", alignItems: "center", justifyContent: "center", padding: "3rem 1.5rem" }}>
        <div style={{ width: "100%", maxWidth: "580px" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{ background: "#dcfce7", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "#166534" }}>
              <CheckCircle2 size={40} />
            </div>
            <h1 style={{ fontSize: "clamp(1.8rem,4vw,2.6rem)", marginBottom: "1rem" }}>Pledge Committed!</h1>
            <p style={{ opacity: 0.65, fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "440px", margin: "0 auto" }}>
              Thank you, <strong>{pledgerData.name.split(" ")[0]}</strong>. Your commitment has been recorded.
              A confirmation with payment details has been sent to <strong>{pledgerData.email}</strong>.
            </p>
          </div>

          <div className={`${styles.formCard} glass-card`} style={{ padding: "2rem 2.5rem", marginBottom: "1.5rem" }}>
            <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 700, marginBottom: "1.25rem", fontSize: "1.1rem" }}>
              Payment Reference
            </h3>
            <div style={{ background: "#f8faf9", border: "1px solid rgba(28,46,36,0.1)", borderRadius: "var(--radius-sm)", padding: "1rem 1.25rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", marginBottom: "0.75rem" }}>
              <code style={{ fontWeight: 700, fontSize: "1.1rem", letterSpacing: "0.08em", color: "var(--accent)" }}>
                {pledgeId.slice(0, 10).toUpperCase()}
              </code>
              <button
                onClick={() => handleCopy(pledgeId.slice(0, 10).toUpperCase())}
                style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "1px solid rgba(28,46,36,0.15)", borderRadius: "999px", padding: "0.4rem 0.875rem", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, color: copied ? "#166534" : "var(--primary)" }}
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p style={{ fontSize: "0.85rem", opacity: 0.6, lineHeight: 1.6 }}>
              Please use this reference when making your EFT payment so we can match your contribution.
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
            <Link href="/leaderboard" className="btn-premium btn-primary" style={{ textAlign: "center" }}>
              View the Honour Roll
            </Link>
            <Link href="/" className="btn-premium" style={{ textAlign: "center", border: "2px solid rgba(28,46,36,0.15)", background: "transparent", color: "var(--primary)" }}>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Foundation
      </Link>

      {/* Progress indicator */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem", marginBottom: "2.5rem" }}>
        {([1, 2, 3] as Step[]).map((s) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
              width: "32px", height: "32px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "0.8rem", fontWeight: 700, fontFamily: "var(--font-heading)",
              background: step >= s ? "var(--accent)" : "rgba(28,46,36,0.08)",
              color: step >= s ? "var(--accent-foreground)" : "rgba(28,46,36,0.35)",
              transition: "all 0.2s",
            }}>
              {s}
            </div>
            {s < 3 && <div style={{ width: "40px", height: "2px", background: step > s ? "var(--accent)" : "rgba(28,46,36,0.1)", transition: "all 0.2s" }} />}
          </div>
        ))}
      </div>

      {/* ── Step 1: Amount + Info ── */}
      {step === 1 && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Make Your <span className="text-accent">Pledge</span></h1>
            <p>Select your contribution and tell us who you are. No payment is made on this form — we will send you banking details by email.</p>
          </div>

          <div className={`${styles.formCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepNumber}>01</span>
              <label className={styles.label}>Choose Your Pledge Amount</label>
            </div>

            <div className={styles.amountGrid}>
              {AMOUNTS.map((amt) => (
                <button
                  key={amt.value}
                  type="button"
                  className={`${styles.amountButton} ${!customAmount && amount === amt.value ? styles.amountButtonActive : ""}`}
                  onClick={() => { setAmount(amt.value); setCustomAmount(""); }}
                >
                  {amt.label}
                </button>
              ))}
            </div>

            <div className={styles.customInputWrapper} style={{ marginTop: "1rem" }}>
              <span className={styles.currencyPrefix}>R</span>
              <input
                type="number"
                min={1}
                placeholder="Enter a custom amount"
                className={styles.customInput}
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
              />
            </div>

            <div className={styles.sectionHeader} style={{ marginTop: "2.5rem" }}>
              <span className={styles.stepNumber}>02</span>
              <label className={styles.label}>Your Details</label>
            </div>

            <form onSubmit={handleStep1Next} className={styles.innerForm}>
              <input
                type="text" required className={styles.inputField}
                placeholder="Full Name *"
                value={pledgerData.name}
                onChange={(e) => setPledgerData({ ...pledgerData, name: e.target.value })}
              />
              <input
                type="email" required className={styles.inputField}
                placeholder="Email Address *"
                value={pledgerData.email}
                onChange={(e) => setPledgerData({ ...pledgerData, email: e.target.value })}
              />
              <input
                type="tel" className={styles.inputField}
                placeholder="Phone Number (optional)"
                value={pledgerData.phone}
                onChange={(e) => setPledgerData({ ...pledgerData, phone: e.target.value })}
              />
              <input
                type="text" className={styles.inputField}
                placeholder="Organisation / Ranch (optional)"
                value={pledgerData.organization}
                onChange={(e) => setPledgerData({ ...pledgerData, organization: e.target.value })}
              />
              <textarea
                className={styles.inputField}
                placeholder="Message of support (optional)"
                rows={3}
                value={pledgerData.message}
                onChange={(e) => setPledgerData({ ...pledgerData, message: e.target.value })}
              />

              <button
                type="submit"
                disabled={!effectiveAmount || effectiveAmount < 1 || !pledgerData.name || !pledgerData.email}
                className="btn-premium btn-accent"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                Continue <ArrowRight size={18} />
              </button>
            </form>

            <div className={styles.securityNote}>
              <Mail size={15} />
              <span>Banking details will be sent to your email — no card required on this form</span>
            </div>
          </div>
        </>
      )}

      {/* ── Step 2: Nominate or not ── */}
      {step === 2 && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Continue the <span className="text-accent">Chain?</span></h1>
            <p>Will you nominate a peer in the wildlife industry to match your commitment? This is how the chain grows.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem", marginBottom: "1.5rem" }}>
            <button
              onClick={() => { setStep(3); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`${styles.formCard} glass-card`}
              style={{ padding: "2.5rem 2rem", textAlign: "center", cursor: "pointer", border: "2px solid var(--accent)", background: "rgba(197,160,89,0.04)", transition: "all 0.2s" }}
            >
              <UserPlus size={40} color="var(--accent)" style={{ margin: "0 auto 1rem" }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", marginBottom: "0.6rem" }}>Yes — Nominate Someone</h3>
              <p style={{ opacity: 0.6, fontSize: "0.9rem", lineHeight: 1.6 }}>Keep the chain alive by challenging a colleague to match your pledge.</p>
            </button>

            <button
              onClick={handleNoNominee}
              disabled={isSubmitting}
              className={`${styles.formCard} glass-card`}
              style={{ padding: "2.5rem 2rem", textAlign: "center", cursor: "pointer", border: "2px solid rgba(28,46,36,0.1)", transition: "all 0.2s" }}
            >
              <Share2 size={40} color="var(--muted)" style={{ margin: "0 auto 1rem", opacity: 0.4 }} />
              <h3 style={{ fontFamily: "var(--font-heading)", fontSize: "1.2rem", marginBottom: "0.6rem" }}>No — Complete My Pledge</h3>
              <p style={{ opacity: 0.6, fontSize: "0.9rem", lineHeight: 1.6 }}>
                {isSubmitting ? "Submitting your pledge..." : "Submit your pledge without nominating anyone right now."}
              </p>
            </button>
          </div>

          <button onClick={() => setStep(1)} className={styles.backLink} style={{ background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={16} /> Back
          </button>
        </>
      )}

      {/* ── Step 3: Nominee details ── */}
      {step === 3 && !pledgeId && (
        <>
          <div className={styles.header}>
            <h1 className={styles.title}>Nominate a <span className="text-accent">Champion</span></h1>
            <p>Enter the details of the person you are challenging. They will receive an email with their unique challenge link.</p>
          </div>

          <div className={`${styles.formCard} glass-card`}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepNumber}>03</span>
              <label className={styles.label}>Nominee Details</label>
            </div>

            <form onSubmit={handleStep3Submit} className={styles.innerForm}>
              <input
                type="text" required className={styles.inputField}
                placeholder="Nominee Full Name *"
                value={nomineeData.name}
                onChange={(e) => setNomineeData({ ...nomineeData, name: e.target.value })}
              />
              <input
                type="text" className={styles.inputField}
                placeholder="Nominee Organisation / Ranch"
                value={nomineeData.organization}
                onChange={(e) => setNomineeData({ ...nomineeData, organization: e.target.value })}
              />
              <input
                type="email" required className={styles.inputField}
                placeholder="Nominee Email Address *"
                value={nomineeData.email}
                onChange={(e) => setNomineeData({ ...nomineeData, email: e.target.value })}
              />
              <div>
                <label className={styles.label} style={{ marginBottom: "0.5rem" }}>Challenge Amount (R) *</label>
                <div className={styles.customInputWrapper}>
                  <span className={styles.currencyPrefix}>R</span>
                  <input
                    type="number" required min={1} className={styles.customInput}
                    value={nomineeData.amount}
                    onChange={(e) => setNomineeData({ ...nomineeData, amount: Number(e.target.value) })}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-premium btn-accent"
                style={{ width: "100%", marginTop: "1rem" }}
              >
                {isSubmitting ? "Submitting..." : "Complete Pledge & Send Nomination"}
              </button>
            </form>
          </div>

          <button onClick={() => setStep(2)} className={styles.backLink} style={{ background: "none", border: "none", cursor: "pointer", marginTop: "1.5rem" }}>
            <ArrowLeft size={16} /> Back
          </button>
        </>
      )}
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <DonateForm />
    </Suspense>
  );
}
