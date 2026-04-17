"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Pledge } from "@/context/AppContext";
import styles from "../../../donate/donate.module.css";
import { ArrowLeft, ShieldCheck, Flame } from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChallengePayPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addDonation } = useApp();
  
  const [pledge, setPledge] = useState<Pledge | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [amount, setAmount] = useState<number>(0);
  const [formData, setFormData] = useState({ email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      await addDonation({
        donorName: pledge.fullName,
        amount: Number(amount),
        type: amount >= 36000 ? "Pledge Pay" : "General",
        method: "Credit Card",
        pledgeId: pledge.id,
      });
      
      // Redirect to the post-donation Nominate page (chain continuation)
      router.push(`/nominate?nominatorName=${encodeURIComponent(pledge.fullName)}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading challenge details...</div>;
  }

  if (!pledge || pledge.status !== "pending") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Challenge not found or already processed. <Link href="/" style={{ marginLeft: '8px', color: 'var(--accent)' }}>Return Home</Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <button onClick={() => router.back()} className={styles.backLink} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, font: 'inherit', color: 'inherit' }}>
        <ArrowLeft size={16} /> Back to Challenge
      </button>
      
      <div className={styles.header}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '1rem' }}>
          <Flame size={16} /> Challenge Accepted
        </div>
        <h1 className={styles.title}>Fulfill Your <span className="text-accent">Legacy</span></h1>
        <p>Complete your commitment to the WRSA Foundation and solidify your place on the Honour Roll.</p>
      </div>

      <div className={`${styles.formCard} glass-card`}>
        <div className={styles.sectionHeader}>
          <span className={styles.stepNumber}>01</span>
          <label className={styles.label}>Confirm Contribution Amount</label>
        </div>
        
        <p style={{ opacity: 0.7, marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {pledge.challengedBy} challenged you to R{pledge.amount.toLocaleString()}. You may match, exceed, or lower this amount.
        </p>

        <div className={styles.amountGrid} style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
          <button
            className={`${styles.amountButton} ${amount === pledge.amount ? styles.amountButtonActive : ""}`}
            onClick={() => setAmount(pledge.amount)}
          >
            Match Challenge
            <br/><span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(R{pledge.amount.toLocaleString()})</span>
          </button>
          <button
            className={`${styles.amountButton} ${amount === pledge.amount * 1.5 ? styles.amountButtonActive : ""}`}
            onClick={() => setAmount(pledge.amount * 1.5)}
          >
            Exceed
            <br/><span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(R{(pledge.amount * 1.5).toLocaleString()})</span>
          </button>
          <div className={styles.customInputWrapper}>
            <span className={styles.currencyPrefix}>R</span>
            <input 
              type="number" 
              placeholder="Custom" 
              className={styles.customInput}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={styles.sectionHeader} style={{ marginTop: '3rem' }}>
          <span className={styles.stepNumber}>02</span>
          <label className={styles.label}>Finalize Details for {pledge.fullName}</label>
        </div>

        <form onSubmit={handleSubmit} className={styles.innerForm}>
          <div className={styles.inputGroup}>
            <input 
              type="email" 
              required
              className={styles.inputField} 
              placeholder="Your Email Address"
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

          <button disabled={isSubmitting} type="submit" className="btn-premium btn-accent" style={{ width: '100%', marginTop: '2rem', height: '4rem' }}>
            {isSubmitting ? "Processing..." : "Complete Secure Donation"}
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
