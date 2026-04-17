"use client";

import styles from "../admin.module.css";
import { TrendingUp, Users, DollarSign, AlertCircle, ArrowUpRight, Clock } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function AdminDashboard() {
  const { pledges, donations, totalRaised } = useApp();
  
  const activePledges = pledges.filter(p => p.status !== "completed");
  const overdueCount = pledges.filter(p => p.status === "overdue").length;
  const recentDonations = donations.slice(0, 5);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Wildlife <span className="text-accent">Pledge Chain</span></h1>
          <p className={styles.pageSubtitle}>Real-time performance metrics for the conservation movement</p>
        </div>
        <div className={styles.headerActions}>
          <button className="btn-premium btn-primary" style={{ padding: '0.75rem 1.5rem', fontSize: '0.8125rem' }}>
            Generate Report
          </button>
        </div>
      </header>
      
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIconWrapper} style={{ background: 'rgba(197, 160, 89, 0.1)', color: 'var(--accent)' }}>
            <DollarSign size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Total Revenue</span>
            <div className={styles.statValue}>R{totalRaised.toLocaleString()}</div>
            <div className={styles.statTrend} style={{ color: '#2D5A27' }}>
              <ArrowUpRight size={14} /> Tracking in real-time
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIconWrapper} style={{ background: 'rgba(28, 46, 36, 0.1)', color: 'var(--primary)' }}>
            <Users size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Active Pledgers</span>
            <div className={styles.statValue}>{activePledges.length}</div>
            <div className={styles.statTrend} style={{ color: 'var(--accent)' }}>
              From live database
            </div>
          </div>
        </div>

        <div className={`${styles.statCard} glass-card`}>
          <div className={styles.statIconWrapper} style={{ background: 'rgba(153, 27, 27, 0.1)', color: '#991B1B' }}>
            <AlertCircle size={20} />
          </div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>Critical Pledges</span>
            <div className={styles.statValue}>{overdueCount}</div>
            <div className={styles.statTrend} style={{ color: '#991B1B' }}>
              Requires immediate follow-up
            </div>
          </div>
        </div>
      </div>

      <div className={styles.mainGrid}>
        <div className={`${styles.contentCard} glass-card`}>
          <div className={styles.cardHeader}>
            <h3>Recent Pledge Activity</h3>
            <button className={styles.viewAll}>View All</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.premiumTable}>
              <thead>
                <tr>
                  <th>Pledger</th>
                  <th>Amount</th>
                  <th>Deadline</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activePledges.slice(0, 5).map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className={styles.tableMainText}>{p.fullName}</div>
                      <div className={styles.tableSubText}>{p.organization}</div>
                    </td>
                    <td className={styles.tableWeight}>R{p.amount.toLocaleString()}</td>
                    <td>
                      <div className={styles.dateBadge}>
                        <Clock size={12} /> {p.deadline}
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${p.status === 'overdue' ? styles.badgeOverdue : styles.badgePending}`}>
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${styles.contentCard} glass-card`}>
          <div className={styles.cardHeader}>
            <h3>Recent Donations</h3>
          </div>
          <div className={styles.activityList}>
            {recentDonations.map((d) => (
              <div key={d.id} className={styles.activityItem}>
                <div className={styles.avatar}>{d.donorName.charAt(0)}</div>
                <div className={styles.activityInfo}>
                  <div className={styles.activityText}>
                    <strong>{d.donorName}</strong> contributed <strong>R{d.amount.toLocaleString()}</strong>
                  </div>
                  <div className={styles.activityDate}>{d.date}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
