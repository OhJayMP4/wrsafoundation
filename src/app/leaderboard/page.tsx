"use client";

import styles from "../donate/donate.module.css";
import Link from "next/link";
import { ArrowLeft, Trophy, Medal, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function LeaderboardPage() {
  const { donations, pledges, totalRaised, loading } = useApp();

  // Sort donations by amount descending
  const topDonors = [...donations]
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10);

  // Get denied pledges (could filter by date later, but for testing we show all)
  const deniedPledges = pledges.filter(p => p.status === "denied");

  return (
    <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 2rem' }}>
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', opacity: 0.6, marginBottom: '2rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '8px' }} /> Back to Home
      </Link>

      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <Trophy size={48} style={{ color: 'var(--accent)', margin: '0 auto 1rem' }} />
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)' }}>The Honour Roll</h1>
        <p style={{ opacity: 0.7 }}>Recognizing the champions of the Wildlife Pledge Chain</p>
      </div>

      <div style={{ background: 'white', borderRadius: 'var(--radius)', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '4rem' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: 'var(--primary)', color: 'white' }}>
              <th style={{ padding: '1rem 1.5rem' }}>Donor</th>
              <th style={{ padding: '1rem 1.5rem' }}>Commitment Type</th>
              <th style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>Loading champions...</td>
              </tr>
            ) : topDonors.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No donations recorded yet.</td>
              </tr>
            ) : (
              topDonors.map((donor, i) => (
                <tr key={donor.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {i === 0 ? <Medal size={20} color="#FFD700" /> : i === 1 ? <Medal size={20} color="#C0C0C0" /> : i === 2 ? <Star size={20} color="#CD7F32" /> : <div style={{ width: 20 }} />}
                    <span style={{ fontWeight: 600 }}>{donor.donorName}</span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', opacity: 0.7 }}>{donor.type}</td>
                  <td style={{ padding: '1.25rem 1.5rem', textAlign: 'right', fontWeight: 800 }}>R{donor.amount.toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Denied Pledges Section */}
      {deniedPledges.length > 0 && (
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '12px', height: '12px', background: '#dc2626', borderRadius: '50%', display: 'inline-block' }} /> 
            Declined Nominations
          </h2>
          <p style={{ opacity: 0.7, marginBottom: '2rem', fontSize: '0.875rem' }}>
            The following peers were nominated but chose not to accept the challenge at this time.
          </p>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {deniedPledges.map(p => (
              <div key={p.id} style={{ background: '#fef2f2', border: '1px solid #fecaca', padding: '1.5rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 700, color: '#991b1b', marginBottom: '0.25rem' }}>{p.fullName}</h3>
                  <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Nominated by {p.challengedBy}</p>
                </div>
                <div style={{ background: '#dc2626', color: 'white', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Denied
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.875rem', opacity: 0.5, marginBottom: '1.5rem' }}>
          Total raised so far: R{totalRaised.toLocaleString()}
        </p>
        <Link href="/donate" className="btn-premium btn-accent" style={{ display: 'inline-block' }}>
          Join the Legacy
        </Link>
      </div>
    </div>
  );
}
