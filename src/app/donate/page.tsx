"use client";

import { useState } from "react";
import styles from "./donate.module.css";
import { ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";

const AMOUNTS = [
  { label: "R500", value: 500 },
  { label: "R1,000", value: 1000 },
  { label: "R5,000", value: 5000 },
  { label: "R36,000", value: 36000 },
];

export default function DonatePage() {
  const { addDonation } = useApp();
  const [amount, setAmount] = useState<number>(1000);
  const [frequency, setFrequency] = useState<"once" | "monthly">("once");
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    
    addDonation({
      donorName: formData.name,
      amount: Number(amount),
      type: amount >= 36000 ? "Pledge Pay" : "General",
      method: "Credit Card",
    });
    
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className={styles.container} style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div className="glass-card" style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', maxWidth: '600px', margin: '0 auto' }}>
          <CheckCircle2 size={64} color="var(--accent)" />
          <h1 style={{ color: 'var(--primary)', marginBottom: 0 }}>Link Forge Successful!</h1>
          <p style={{ opacity: 0.7 }}>
            Thank you, {formData.name.split(' ')[0]}. Your link in the **Wildlife Pledge Chain** has been forged.
          </p>
          
          <div style={{ marginTop: '2rem', padding: '2rem', background: 'rgba(197, 160, 89, 0.05)', borderRadius: 'var(--radius)', border: '1px solid var(--accent)', width: '100%' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Who is next?</h2>
            <p style={{ fontSize: '0.875rem', opacity: 0.7, marginBottom: '1.5rem' }}>The chain must continue. Nominate a peer to take the next link.</p>
            <Link href="/admin/pledges" className="btn-premium btn-accent" style={{ width: '100%', display: 'block' }}>
              Nominate a Leader
            </Link>
          </div>

          <Link href="/" className="btn-premium btn-secondary" style={{ marginTop: '1rem', opacity: 0.6 }}>Back to Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Link href="/" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to Foundation
      </Link>
      
      <div className={styles.header}>
        <h1 className={styles.title}>Ignite the <span className="text-accent">Chain</span></h1>
        <p>Select your contribution tier and help us safeguard South Africa&apos;s heritage.</p>
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
