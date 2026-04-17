"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useApp, Pledge } from "@/context/AppContext";
import styles from "../../page.module.css";
import { Flame, ShieldCheck, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function ChallengePage() {
  const { id } = useParams();
  const router = useRouter();
  const { updatePledgeStatus } = useApp();
  
  const [pledge, setPledge] = useState<Pledge | null>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasDenied, setHasDenied] = useState(false);

  useEffect(() => {
    async function fetchPledge() {
      if (!id) return;
      try {
        const docRef = doc(db, "pledges", id as string);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPledge({ id: docSnap.id, ...docSnap.data() } as Pledge);
        }
      } catch (err) {
        console.error("Error fetching pledge:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPledge();
  }, [id]);

  const handleDeny = async () => {
    if (!pledge) return;
    setIsProcessing(true);
    try {
      await updatePledgeStatus(pledge.id, "denied");
      setHasDenied(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAccept = () => {
    if (!pledge) return;
    // Redirect to donate page with pledge ID
    router.push(`/donate?pledgeId=${pledge.id}&suggestedAmount=${pledge.amount}`);
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading challenge details...</div>;
  }

  if (!pledge) {
    return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Challenge not found.</div>;
  }

  if (hasDenied || pledge.status === "denied") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fef2f2', padding: '2rem' }}>
        <div className="glass-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
          <XCircle size={48} color="#dc2626" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#991b1b', marginBottom: '1rem' }}>Challenge Declined.</h1>
          <p style={{ opacity: 0.7, marginBottom: '2rem', lineHeight: 1.6 }}>
            You have respectfully declined the nomination from <strong>{pledge.challengedBy}</strong>. This status will be reflected temporarily.
          </p>
          <Link href="/leaderboard" className="btn-premium" style={{ border: '1px solid currentColor', color: '#991b1b' }}>
            Return to Public Board
          </Link>
        </div>
      </div>
    );
  }

  if (pledge.status === "completed") {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-card" style={{ maxWidth: '500px', textAlign: 'center', padding: '3rem' }}>
          <ShieldCheck size={48} color="var(--accent)" style={{ margin: '0 auto 1.5rem' }} />
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Challenge Already Completed!</h1>
          <p style={{ opacity: 0.7, marginBottom: '2rem', lineHeight: 1.6 }}>
            This pledge has already been fulfilled. Thank you for your support.
          </p>
          <Link href="/leaderboard" className="btn-premium btn-primary">
            View the Leaderboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--primary)', color: 'white', padding: '4rem 2rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.1)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent)', marginBottom: '2rem' }}>
            <Flame size={16} /> Official Nomination
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1rem' }}>
            Welcome, <span className="text-accent">{pledge.fullName.split(' ')[0]}</span>.
          </h1>
          <p style={{ fontSize: '1.25rem', opacity: 0.7, maxWidth: '600px', margin: '0 auto' }}>
            <strong>{pledge.challengedBy}</strong> has cemented their legacy in wildlife conservation and formally nominated you to match their commitment.
          </p>
        </div>

        <div className="glass-card" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '24px', textAlign: 'center', marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>The Challenge</h2>
          <div style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'var(--font-heading)', color: 'var(--accent)', lineHeight: 1, marginBottom: '1rem' }}>
            R{pledge.amount.toLocaleString()}
          </div>
          <p style={{ opacity: 0.6, marginBottom: '3rem', maxWidth: '400px', margin: '0 auto 3rem' }}>
            Suggested commitment to the WRSA Foundation. You may choose to match, exceed, or go lower on the next screen.
          </p>

          <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column', maxWidth: '400px', margin: '0 auto' }}>
            <button 
              onClick={handleAccept}
              disabled={isProcessing}
              className="btn-premium btn-accent" 
              style={{ padding: '1.25rem', fontSize: '1.125rem', display: 'flex', justifyContent: 'center' }}
            >
              Accept Challenge <ArrowRight size={20} className="ml-2" />
            </button>
            <button 
              onClick={handleDeny}
              disabled={isProcessing}
              className="btn-premium" 
              style={{ padding: '1.25rem', fontSize: '1.125rem', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: 'rgba(255,255,255,0.6)' }}
            >
              {isProcessing ? "Processing..." : "Deny Nomination"}
            </button>
          </div>
        </div>

        <p style={{ textAlign: 'center', opacity: 0.4, fontSize: '0.875rem' }}>
          *Denying this nomination will publicize the declined state on the leaderboard for 48 hours.
        </p>

      </div>
    </div>
  );
}
