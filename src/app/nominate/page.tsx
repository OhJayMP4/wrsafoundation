"use client";

import { useState, Suspense } from "react";
import styles from "../donate/donate.module.css";
import { CheckCircle2, Share2, ArrowRight } from "lucide-react";
import Link from "next/link";
import NominateModal from "@/components/NominateModal";
import { useApp } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

function NominateContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  
  const { addPledge } = useApp();
  const searchParams = useSearchParams();

  // Dynamically pull the name passed from the donate screen
  const nominatorName = searchParams.get("nominatorName") || "A fellow conservationist";

  const handleNominateSubmit = async (data: any) => {
    try {
      const newPledgeId = await addPledge(data);
      // Simulate Email Generation by showing the link locally
      const link = `${window.location.origin}/challenge/${newPledgeId}`;
      setGeneratedLink(link);
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf9', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: '600px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ background: '#dcfce7', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#166534' }}>
            <CheckCircle2 size={40} />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', lineHeight: 1.2 }}>Payment Confirmed.</h1>
          <p style={{ opacity: 0.6, fontSize: '1.125rem', maxWidth: '400px', margin: '0 auto' }}>
            Thank you, {nominatorName}, for your historic contribution to the WRSA Foundation. Your legacy is secure.
          </p>
        </div>

        {!generatedLink ? (
          <div className={styles.formCard} style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Continue The Chain?</h2>
            <p style={{ opacity: 0.6, marginBottom: '2.5rem', lineHeight: 1.6 }}>
              A true movement relies on peer-to-peer accountability. Will you nominate a colleague in the wildlife industry to match your commitment?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="btn-premium btn-accent" 
                style={{ padding: '1.25rem', fontSize: '1.125rem' }}
              >
                Nominate Someone <Share2 size={20} className="ml-2" />
              </button>
              
              <Link href="/leaderboard" className="btn-premium btn-primary" style={{ border: '1px solid var(--glass-border)', padding: '1.25rem', fontSize: '1.125rem' }}>
                End Here & View Board
              </Link>
            </div>
          </div>
        ) : (
          <div className={`${styles.formCard} animate-fade-in`} style={{ padding: '3rem', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem' }}>Nomination Fired!</h2>
            <p style={{ opacity: 0.6, marginBottom: '2rem', lineHeight: 1.6 }}>
              An email has theoretically been dispatched. For testing purposes, here is the unique link generated for the nominee:
            </p>
            
            <div style={{ background: '#fcfcfb', border: '1px solid var(--glass-border)', padding: '1.5rem', borderRadius: '8px', wordBreak: 'break-all', marginBottom: '2rem', userSelect: 'all' }}>
              <code style={{ color: 'var(--accent)', fontWeight: 700 }}>{generatedLink}</code>
            </div>

            <p style={{ fontSize: '0.875rem', opacity: 0.5, marginBottom: '2rem' }}>
              (Copy this link and open it in a new tab to see the onboarding flow).
            </p>

            <Link href="/leaderboard" className="btn-premium btn-primary" style={{ border: '1px solid var(--glass-border)', padding: '1.25rem' }}>
              Go to Leaderboard <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        )}

        <NominateModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSubmit={handleNominateSubmit}
          nominatorName={nominatorName}
        />
        
      </div>
    </div>
  );
}

export default function NominatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
      <NominateContent />
    </Suspense>
  );
}
