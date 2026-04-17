"use client";

import { useState } from "react";
import { X, UserPlus, Info } from "lucide-react";

interface NominateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { fullName: string; organization: string; nomineeEmail: string; amount: number; challengedBy: string }) => Promise<void>;
  nominatorName: string; // The person who just donated
}

export default function NominateModal({ isOpen, onClose, onSubmit, nominatorName }: NominateModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    organization: "",
    nomineeEmail: "",
    amount: 50000,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ ...formData, challengedBy: nominatorName });
      setFormData({ fullName: "", organization: "", nomineeEmail: "", amount: 50000 });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(28, 46, 36, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2rem', background: '#fff', borderRadius: '16px', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.5 }}>
          <X size={20} />
        </button>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <UserPlus size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Nominate The Next Leader</h2>
        </div>

        <p style={{ opacity: 0.6, fontSize: '0.875rem', marginBottom: '2rem', lineHeight: 1.5 }}>
          Challenge a peer to match or exceed your commitment to wildlife conservation. They will receive an email with a unique link to accept the challenge.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Nominee Full Name</label>
            <input 
              type="text" 
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              placeholder="e.g., Janine Doe"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Organization / Ranch</label>
            <input 
              type="text" 
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}
              value={formData.organization}
              onChange={(e) => setFormData({...formData, organization: e.target.value})}
              placeholder="e.g., Doe Wildlife Reserve"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Nominee Email</label>
            <input 
              type="email" 
              required 
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}
              value={formData.nomineeEmail}
              onChange={(e) => setFormData({...formData, nomineeEmail: e.target.value})}
              placeholder="janine@example.com"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Challenge Amount (R)</label>
            <input 
              type="number" 
              required 
              min={100}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--glass-border)', borderRadius: 'var(--radius-sm)' }}
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px', padding: '1rem', background: '#f8faf9', borderRadius: '8px', marginTop: '0.5rem' }}>
            <Info size={16} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ fontSize: '0.75rem', opacity: 0.7, lineHeight: 1.4 }}>
              By confirming, {formData.fullName || "they"} will be listed on the Live Challenge Board as "Pending". They have 7 days to accept.
            </span>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="btn-premium btn-accent" 
            style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}
          >
            {isSubmitting ? "Generating Link..." : "Send Nomination"}
          </button>
        </form>
      </div>
    </div>
  );
}
