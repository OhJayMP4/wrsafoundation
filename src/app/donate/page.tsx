"use client";

import { useState, Suspense } from "react";
import styles from "./donate.module.css";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useRouter, useSearchParams } from "next/navigation";

const AMOUNTS = [
  { label: "R500", value: 500 },
  { label: "R1,000", value: 1000 },
  { label: "R5,000", value: 5000 },
  { label: "R36,000", value: 36000 },
];

function DonateForm() {
  const { addDonation } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const initialValue = Number(searchParams.get("suggestedAmount")) || 1000;
  const pledgeId = searchParams.get("pledgeId") || undefined;

  const [amount, setAmount] = useState<number>(initialValue);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setIsSubmitting(true);
    
    try {
      await addDonation({
        donorName: formData.name,
        amount: Number(amount),
        type: amount >= 36000 ? "Pledge Pay" : "General",
        method: "Credit Card",
        pledgeId: pledgeId,
      });
      
      // Redirect to the post-donation Nominate page
      router.push(`/nominate?nominatorName=${encodeURIComponent(formData.name)}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Foundation
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Ignite the <span className="text-accent">Chain</span></h1>
        <p>
          {pledgeId 
            ? "Fulfill your nomination and cement your legacy in conservation." 
            : "Select your contribution tier and help us safeguard South Africa's heritage."}
        </p>
      </div>

      <div className={`${styles.formCard} glass-card`}>
        <div className={styles.toggleContainer}>
          <button 
            className={`${styles.toggleButton} ${frequency === "once" ? styles.toggleButtonActive : ""}`}
            onClick={() => setFrequency("once")}
          >
            Once-off Gift
          </button>
          <button 
            className={`${styles.toggleButton} ${frequency === "monthly" ? styles.toggleButtonActive : ""}`}
            onClick={() => setFrequency("monthly")}
          >
            Monthly Pledge
          </button>
        </div>

        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>01</span>
          <label className={styles.label}>Select Contribution Amount</label>
        </div>
        
        <div className={styles.amountGrid}>
          {AMOUNTS.map((amt) => (
            <button
              key={amt.value}
              className={`${styles.amountButton} ${amount === amt.value ? styles.amountButtonActive : ""}`}
              onClick={() => setAmount(amt.value)}
            >
              {amt.label}
            </button>
          ))}
          <div className={styles.customInputWrapper}>
            <span className={styles.currencyPrefix}>R</span>
            <input 
              type="number" 
              placeholder="Custom" 
              className={styles.customInput}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
          <span className={styles.stepNumber}>02</span>
          <label className={styles.label}>Donor Information</label>
        </div>

        <form onSubmit={handleSubmit} className={styles.innerForm}>
          <div className={styles.inputGroup}>
            <input 
              type="text" 
              required
              className={styles.inputField} 
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              required
              className={styles.inputField} 
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          
          <div className={styles.inputGroup}>
            <textarea 
              className={styles.inputField} 
              placeholder="Message of support (Optional)" 
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-premium btn-accent" style={{ width: '100%', marginTop: '2rem', height: '4rem' }}>
            Complete Secure Donation
          </button>
        </form>

        <div className={styles.securityNote}>
          <ShieldCheck size={16} /> 
          <span>Encrypted payment processed via <strong>PayFast</strong> South Africa</span>
        </div>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <DonateForm />
    </Suspense>
  );
}
