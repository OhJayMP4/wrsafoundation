"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useSupporterAuth } from "@/context/SupporterAuthContext";
import { SupporterRouteGuard } from "@/components/SupporterRouteGuard";
import { DEBIT_ORDER_TIERS } from "@/types/debitOrder";
import styles from "../../donate/donate.module.css";
import { Building2, User, CheckCircle2 } from "lucide-react";

const DEBIT_DAYS = [1, 15, 25] as const;
const COMMITMENT_OPTIONS = [6, 7, 8, 9, 10, 11, 12];

function SetupForm() {
  const { supporter } = useSupporterAuth();
  const router = useRouter();

  const [applicantType, setApplicantType] = useState<"individual" | "business">("individual");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    fullName: supporter?.displayName || "",
    idNumber: "",
    companyName: "",
    registrationNumber: "",
    contactPerson: "",
    phone: "",
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    branchCode: "",
    bankAccountType: "Cheque/Current" as "Cheque/Current" | "Savings",
  });

  const [tier, setTier] = useState<"250" | "500" | "1000" | "2500" | "custom">("500");
  const [customAmount, setCustomAmount] = useState("");
  const [debitDay, setDebitDay] = useState<1 | 15 | 25>(1);
  const [commitmentMonths, setCommitmentMonths] = useState(12);

  const effectiveAmount = tier === "custom" ? Number(customAmount) : Number(tier);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supporter) return;
    setError("");

    if (!effectiveAmount || effectiveAmount < 1) {
      setError("Please enter a valid monthly amount.");
      return;
    }

    setSubmitting(true);
    try {
      const startDate = new Date();
      startDate.setDate(debitDay);
      if (startDate < new Date()) startDate.setMonth(startDate.getMonth() + 1);

      const debitOrderData = {
        userId: supporter.uid,
        applicantType,
        ...(applicantType === "individual"
          ? { fullName: formData.fullName, idNumber: formData.idNumber }
          : { companyName: formData.companyName, registrationNumber: formData.registrationNumber, contactPerson: formData.contactPerson }),
        email: supporter.email,
        phone: formData.phone,
        bankName: formData.bankName,
        accountHolder: formData.accountHolder,
        accountNumber: formData.accountNumber,
        branchCode: formData.branchCode,
        bankAccountType: formData.bankAccountType,
        tier,
        amount: effectiveAmount,
        debitDay,
        commitmentMonths,
        startDate: startDate.toISOString().split("T")[0],
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, "debitOrders", supporter.uid), debitOrderData);

      // Confirmation email to supporter
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "debit_order_confirmation",
          pledgerName: applicantType === "individual" ? formData.fullName : formData.companyName,
          pledgerEmail: supporter.email,
          amount: effectiveAmount,
          debitDay,
          commitmentMonths,
        }),
      });

      // Admin notification
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "debit_order_admin_notify",
          pledgerName: applicantType === "individual" ? formData.fullName : formData.companyName,
          pledgerEmail: supporter.email,
          pledgerPhone: formData.phone,
          amount: effectiveAmount,
          debitDay,
          commitmentMonths,
          applicantType,
        }),
      });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong submitting your debit order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ maxWidth: "480px", textAlign: "center" }}>
          <div style={{ background: "#dcfce7", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "#166534" }}>
            <CheckCircle2 size={40} />
          </div>
          <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Debit Order Submitted</h1>
          <p style={{ opacity: 0.65, lineHeight: 1.7, marginBottom: "2rem" }}>
            Thank you for committing to R{effectiveAmount.toLocaleString()}/month for {commitmentMonths} months. Our team will review your mandate and confirm by email before your first debit on the {debitDay}{debitDay === 1 ? "st" : "th"} of the month.
          </p>
          <button onClick={() => router.push("/support-monthly/dashboard")} className="btn-premium btn-accent">
            View My Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Set Up Your <span className="text-accent">Debit Order</span></h1>
        <p>Complete your details below. No money is taken immediately — our team confirms your mandate before the first debit.</p>
      </div>

      <div className={`${styles.formCard} glass-card`}>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "0.875rem 1.25rem", borderRadius: "var(--radius-sm)", marginBottom: "1.5rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          {/* Step 1: Applicant type */}
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>01</span>
            <label className={styles.label}>Are you applying as an individual or a business?</label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "2.5rem" }}>
            <button type="button" onClick={() => setApplicantType("individual")}
              style={{ padding: "1.5rem", borderRadius: "var(--radius-md)", border: applicantType === "individual" ? "2px solid var(--accent)" : "2px solid rgba(28,46,36,0.1)", background: applicantType === "individual" ? "rgba(197,160,89,0.06)" : "white", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <User size={24} color={applicantType === "individual" ? "var(--accent)" : "var(--muted)"} />
              <span style={{ fontWeight: 700 }}>Individual</span>
            </button>
            <button type="button" onClick={() => setApplicantType("business")}
              style={{ padding: "1.5rem", borderRadius: "var(--radius-md)", border: applicantType === "business" ? "2px solid var(--accent)" : "2px solid rgba(28,46,36,0.1)", background: applicantType === "business" ? "rgba(197,160,89,0.06)" : "white", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <Building2 size={24} color={applicantType === "business" ? "var(--accent)" : "var(--muted)"} />
              <span style={{ fontWeight: 700 }}>Business</span>
            </button>
          </div>

          {/* Step 2: Details */}
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>02</span>
            <label className={styles.label}>{applicantType === "individual" ? "Your Details" : "Business Details"}</label>
          </div>
          <div className={styles.innerForm} style={{ marginBottom: "2.5rem" }}>
            {applicantType === "individual" ? (
              <>
                <input type="text" required className={styles.inputField} placeholder="Full Name"
                  value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} />
                <input type="text" required className={styles.inputField} placeholder="ID Number"
                  value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} />
              </>
            ) : (
              <>
                <input type="text" required className={styles.inputField} placeholder="Company Name"
                  value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                <input type="text" required className={styles.inputField} placeholder="Company Registration Number"
                  value={formData.registrationNumber} onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })} />
                <input type="text" required className={styles.inputField} placeholder="Contact Person"
                  value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
              </>
            )}
            <input type="tel" required className={styles.inputField} placeholder="Phone Number"
              value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          {/* Step 3: Banking */}
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>03</span>
            <label className={styles.label}>Banking Details (Debit Order Mandate)</label>
          </div>
          <div className={styles.innerForm} style={{ marginBottom: "2.5rem" }}>
            <input type="text" required className={styles.inputField} placeholder="Bank Name"
              value={formData.bankName} onChange={(e) => setFormData({ ...formData, bankName: e.target.value })} />
            <input type="text" required className={styles.inputField} placeholder="Account Holder Name"
              value={formData.accountHolder} onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })} />
            <input type="text" required className={styles.inputField} placeholder="Account Number"
              value={formData.accountNumber} onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })} />
            <input type="text" required className={styles.inputField} placeholder="Branch Code"
              value={formData.branchCode} onChange={(e) => setFormData({ ...formData, branchCode: e.target.value })} />
            <select className={styles.inputField} value={formData.bankAccountType}
              onChange={(e) => setFormData({ ...formData, bankAccountType: e.target.value as "Cheque/Current" | "Savings" })}>
              <option value="Cheque/Current">Cheque / Current Account</option>
              <option value="Savings">Savings Account</option>
            </select>
            <div style={{ background: "rgba(197,160,89,0.08)", padding: "1rem 1.25rem", borderRadius: "var(--radius-sm)", fontSize: "0.85rem", opacity: 0.75, lineHeight: 1.6 }}>
              By submitting this form you authorise the WRSA Foundation to process a monthly debit order against this account, for the amount and period selected below. Our team will contact you to confirm before any debit is processed.
            </div>
          </div>

          {/* Step 4: Tier */}
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>04</span>
            <label className={styles.label}>Monthly Amount</label>
          </div>
          <div className={styles.amountGrid} style={{ marginBottom: "1rem" }}>
            {DEBIT_ORDER_TIERS.map((t) => (
              <button key={t.tier} type="button"
                className={`${styles.amountButton} ${tier === t.tier ? styles.amountButtonActive : ""}`}
                onClick={() => setTier(t.tier)}>
                R{t.amount.toLocaleString()}
                <br /><span style={{ fontSize: "0.7rem", opacity: 0.8 }}>{t.label}</span>
              </button>
            ))}
            <div className={styles.customInputWrapper}>
              <span className={styles.currencyPrefix}>R</span>
              <input type="number" min={1} placeholder="Custom amount" className={styles.customInput}
                value={customAmount}
                onFocus={() => setTier("custom")}
                onChange={(e) => { setTier("custom"); setCustomAmount(e.target.value); }} />
            </div>
          </div>

          {/* Step 5: Debit day */}
          <div className={styles.sectionHeader} style={{ marginTop: "2.5rem" }}>
            <span className={styles.stepNumber}>05</span>
            <label className={styles.label}>Preferred Debit Day</label>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2.5rem" }}>
            {DEBIT_DAYS.map((day) => (
              <button key={day} type="button" onClick={() => setDebitDay(day)}
                className={`${styles.amountButton} ${debitDay === day ? styles.amountButtonActive : ""}`}>
                {day}{day === 1 ? "st" : "th"}
              </button>
            ))}
          </div>

          {/* Step 6: Commitment period */}
          <div className={styles.sectionHeader}>
            <span className={styles.stepNumber}>06</span>
            <label className={styles.label}>Commitment Period</label>
          </div>
          <p style={{ opacity: 0.6, fontSize: "0.875rem", marginBottom: "1rem" }}>
            Monthly supporters commit to a minimum of 6 months, up to 12 months.
          </p>
          <select className={styles.inputField} value={commitmentMonths}
            onChange={(e) => setCommitmentMonths(Number(e.target.value))} style={{ marginBottom: "2rem" }}>
            {COMMITMENT_OPTIONS.map((m) => (
              <option key={m} value={m}>{m} months</option>
            ))}
          </select>

          <button type="submit" disabled={submitting} className="btn-premium btn-accent" style={{ width: "100%", height: "4rem" }}>
            {submitting ? "Submitting..." : `Confirm R${effectiveAmount ? effectiveAmount.toLocaleString() : "0"}/month for ${commitmentMonths} months`}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function SetupPage() {
  return (
    <SupporterRouteGuard>
      <SetupForm />
    </SupporterRouteGuard>
  );
}
