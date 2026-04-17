"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Heart, Users, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function Home() {
  const { totalRaised, pledges } = useApp();
  const activePledges = pledges.filter(p => p.status !== "completed").length;

  return (
    <div className={styles.main}>
      {/* Premium Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <Image 
            src="/hero.png" 
            alt="WRSA Foundation Hero" 
            fill 
            className={styles.heroImage}
            priority
          />
          <div className={styles.heroOverlay} />
        </div>
        
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <Award size={14} className="mr-2" />
            <span>The Wildlife Pledge Chain</span>
          </div>
          <h1>The Wildlife<br /><span className="text-accent">Pledge Chain</span></h1>
          <p>
            A person-to-person movement of responsibility. Join the elite chain 
            of wildlife conservationists committing to the future of our industry.
          </p>
          <div className={styles.heroActions}>
            <Link href="/donate" className="btn-premium btn-accent">
              Accept the Challenge <ArrowRight size={18} className="ml-2" />
            </Link>
            <Link href="/leaderboard" className="btn-premium btn-primary" style={{ border: '1px solid var(--glass-border)' }}>
              View the Chain
            </Link>
          </div>
        </div>
      </section>

      {/* Dynamic Stats Section - Glassmorphism */}
      <section className={styles.statsSection}>
        <div className={`${styles.statsGrid} glass-card`}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Total Raised</div>
            <div className={styles.statValue}>R{totalRaised.toLocaleString()}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Active Pledges</div>
            <div className={styles.statValue}>{activePledges}</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Success Rate</div>
            <div className={styles.statValue}>100%</div>
          </div>
        </div>
      </section>

      {/* 🔥 Live Challenge Board - Strategic Social Pressure */}
      <section className={styles.challengeBoard}>
        <div className={styles.boardHeader}>
          <h2 className="animate-fade-in">🔥 The <span className="text-accent">Live Challenge Board</span></h2>
          <p className={styles.boardSubtitle}>Visibility. Urgency. Accountability. These leaders are next in the chain.</p>
        </div>

        <div className={styles.pledgeGrid}>
          {pledges.filter(p => p.status === 'pending').map((p) => {
            const deadlineDate = new Date(p.deadline);
            const today = new Date();
            const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
            
            let urgencyLabel = 'Pending';
            let badgeClass = styles.badgePending;
            let isBurning = false;

            if (diffDays < 0) {
              urgencyLabel = 'Overdue';
              badgeClass = styles.badgeOverdue;
            } else if (diffDays <= 2) {
              urgencyLabel = 'Burning';
              badgeClass = styles.badgeBurning;
              isBurning = true;
            }

            return (
              <div key={p.id} className={`${styles.pledgeCard} glass-card`}>
                {isBurning && <div className={styles.burningEffect} />}
                <div className={styles.cardTop}>
                  <div className={styles.pledgerInfo}>
                    <h3>{p.fullName}</h3>
                    <p>{p.organization}</p>
                  </div>
                  <span className={`${styles.urgencyBadge} ${badgeClass}`}>
                    {urgencyLabel}
                  </span>
                </div>

                <div className={styles.cardMeta}>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Challenged By</span>
                    <span className={styles.metaValue}>{p.challengedBy}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Time Remaining</span>
                    <span className={styles.metaValue} style={{ color: isBurning ? '#ef4444' : 'inherit' }}>
                      {diffDays < 0 ? 'Overdue' : `${diffDays} days`}
                    </span>
                  </div>
                  <div className={styles.metaItem}>
                    <span className={styles.metaLabel}>Target</span>
                    <span className={styles.metaValue}>R{p.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Info Cards Section */}
      <main className={styles.content}>
        <div className={`${styles.card} glass-card`}>
          <div className={styles.iconCircle}><Heart size={32} /></div>
          <h2>Our Mission</h2>
          <p>
            The WRSA Foundation preserves biodiversity through strategic 
            industry partnership. The Wildlife Pledge Chain is our flagship initiative 
            driving direct conservation impact.
          </p>
        </div>

        <div className={`${styles.card} glass-card`}>
          <div className={styles.iconCircle}><Users size={32} /></div>
          <h2>The Chain Reaction</h2>
          <p>
            Make your pledge, fulfill your commitment, and nominate the next 
            leader to carry the torch. Every link in the chain strengthens 
            our collective legacy.
          </p>
          <Link href="/donate" className={styles.textLink}>
            How to nominate <ArrowRight size={16} />
          </Link>
        </div>
      </main>

      {/* Footer Branding */}
      <footer className={styles.footer}>
        <div style={{ opacity: 0.6, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} /> Secure Wildlife Conservation Platform
        </div>
      </footer>
    </div>
  );
}
