"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import { Plus, Search, Filter, MoreHorizontal, Clock, X } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function PledgesPage() {
  const { pledges, addPledge } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPledgeData, setNewPledgeData] = useState({ fullName: "", organization: "", amount: 36000 });

  const handleAddPledge = (e: React.FormEvent) => {
    e.preventDefault();
    addPledge(newPledgeData);
    setIsModalOpen(false);
    setNewPledgeData({ fullName: "", organization: "", amount: 36000 });
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pledge <span className="text-accent">Chain</span></h1>
          <p className={styles.pageSubtitle}>Manage and track the R36K legacy progression</p>
        </div>
        <button 
          className="btn-premium btn-accent" 
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.8125rem' }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} className="mr-2" /> Add New Pledge
        </button>
      </header>

      <div className={`${styles.contentCard} glass-card`} style={{ padding: '0' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(0,0,0,0.05)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
            <input 
              type="text" 
              placeholder="Filter by name or organization..." 
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
              <th style={{ paddingLeft: '2rem' }}>Pledger</th>
              <th>Challenged By</th>
              <th>Deadline</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ paddingRight: '2rem' }}></th>
            </tr>
          </thead>
          <tbody>
            {pledges.map((p) => {
              const deadlineDate = new Date(p.deadline);
              const today = new Date();
              const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
              
              let urgencyLabel: string = p.status;
              let badgeClass = styles.badgePending;
              
              if (p.status === 'completed') {
                urgencyLabel = 'Completed';
                badgeClass = styles.badgeCompleted;
              } else if (diffDays < 0) {
                urgencyLabel = 'Overdue';
                badgeClass = styles.badgeOverdue;
              } else if (diffDays <= 2) {
                urgencyLabel = 'Burning';
                badgeClass = styles.badgeBurning;
              }

              return (
                <tr key={p.id}>
                  <td style={{ paddingLeft: '2rem' }}>
                    <div className={styles.tableMainText}>{p.fullName}</div>
                    <div className={styles.tableSubText}>{p.organization}</div>
                  </td>
                  <td>
                    <div className={styles.tableSubText}>{p.challengedBy}</div>
                  </td>
                  <td>
                    <div className={styles.dateBadge}>
                      <Clock size={12} /> {p.deadline}
                    </div>
                  </td>
                  <td className={styles.tableWeight}>R{p.amount.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.badge} ${badgeClass}`}>
                      {urgencyLabel}
                    </span>
                  </td>
                  <td style={{ paddingRight: '2rem', textAlign: 'right' }}>
                    <button style={{ opacity: 0.3 }}><MoreHorizontal size={18} /></button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Create New Pledge</h3>
              <button onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddPledge}>
              <label className={styles.label}>Full Name</label>
              <input 
                type="text" 
                required 
                className={styles.inputField}
                value={newPledgeData.fullName}
                onChange={(e) => setNewPledgeData({...newPledgeData, fullName: e.target.value})}
              />
              <label className={styles.label}>Organization</label>
              <input 
                type="text" 
                required 
                className={styles.inputField}
                value={newPledgeData.organization}
                onChange={(e) => setNewPledgeData({...newPledgeData, organization: e.target.value})}
              />
              <label className={styles.label}>Pledge Amount (R)</label>
              <input 
                type="number" 
                required 
                className={styles.inputField}
                value={newPledgeData.amount}
                onChange={(e) => setNewPledgeData({...newPledgeData, amount: Number(e.target.value)})}
              />
              <button type="submit" className="btn-premium btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Initiate Pledge Link
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
