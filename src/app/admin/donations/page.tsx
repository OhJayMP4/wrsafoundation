"use client";

import styles from "../admin.module.css";
import { Download, Search, Filter, ExternalLink, CreditCard } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DonationsPage() {
  const { donations } = useApp();

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Donation <span className="text-accent">History</span></h1>
          <p className={styles.pageSubtitle}>Track incoming contributions and payment status</p>
        </div>
        <button className="btn-premium" style={{ border: '1px solid rgba(0,0,0,0.05)', color: 'var(--primary)', padding: '0.75rem 1.5rem' }}>
          <Download size={18} className="mr-2" /> Export CSV
        </button>
      </header>

      <div className={`${styles.contentCard} glass-card`} style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <input 
              type="text" 
              placeholder="Filter transactions..." 
              className={styles.inputField} 
              style={{ marginBottom: 0, paddingLeft: '2.5rem', background: '#f8faf9', border: 'none' }} 
            />
          </div>
          <button className="btn-premium" style={{ background: '#f8faf9', color: 'var(--primary)', border: '1px solid rgba(0,0,0,0.05)', padding: '0.75rem 1.25rem' }}>
            <Filter size={18} />
          </button>
        </div>

        <table className={styles.premiumTable}>
          <thead style={{ background: '#fcfcfb' }}>
            <tr>
              <th style={{ paddingLeft: '2rem' }}>Transaction ID</th>
              <th>Donor</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ paddingRight: '2rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {donations.map((d) => (
              <tr key={d.id}>
                <td style={{ paddingLeft: '2rem' }}>
                  <code style={{ fontSize: '0.7rem', background: 'rgba(0,0,0,0.03)', padding: '4px 8px', borderRadius: '4px' }}>
                    {d.id}
                  </code>
                </td>
                <td>
                  <div className={styles.tableMainText}>{d.donorName}</div>
                  <div className={styles.tableSubText} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={12} /> {d.method}
                  </div>
                </td>
                <td>
                  <div className={styles.tableSubText}>{d.date}</div>
                </td>
                <td>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, padding: '4px 8px', borderRadius: '4px', background: d.type === 'Pledge Pay' ? 'rgba(197, 160, 89, 0.1)' : 'rgba(0,0,0,0.05)', color: d.type === 'Pledge Pay' ? 'var(--accent)' : 'var(--primary)' }}>
                    {d.type.toUpperCase()}
                  </span>
                </td>
                <td className={styles.tableWeight}>R{d.amount.toLocaleString()}</td>
                <td>
                  <span className={`${styles.badge} ${styles.badgeCompleted}`}>
                    completed
                  </span>
                </td>
                <td style={{ paddingRight: '2rem', textAlign: 'right' }}>
                  <button style={{ opacity: 0.3 }} title="View on PayFast"><ExternalLink size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
