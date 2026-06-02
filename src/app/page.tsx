"use client";

import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";
import { Heart, Users, ArrowRight, ShieldCheck, Award } from "lucide-react";
import { useApp } from "@/context/AppContext";
import FadeIn from "@/components/FadeIn";

export default function Home() {
  const { totalRaised, pledges } = useApp();
  const activePledges = pledges.filter(p => p.status !== "completed").length;

  return (
    <div className={styles.main}>
      {/* Hero */}
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
            A person-to-person movement of responsibility. Join the chain
            of wildlife conservationists committing to the future of our industry.
          </p>
          <div className={styles.heroActions}>
            <Link href="/donate" className={`btn-premium btn-accent ${styles.heroPrimary}`}>
              Accept the Challenge <ArrowRight size={20} />
            </Link>
            <Link href="/leaderboard" className={`btn-premium ${styles.heroSecondary}`}>
              View the Chain
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <FadeIn direction="up" delay={100} style={{ position: "relative", zIndex: 20 }}>
        <section className={styles.statsSection} style={{ position: "static", zIndex: "unset" }}>
          <div className={`${styles.statsGrid} glass-card`} style={{ background: "#ffffff", backdropFilter: "none" }}>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Total Raised</div>
              <div className={styles.statValue}>R{totalRaised.toLocaleString()}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Active Pledges</div>
              <div className={styles.statValue}>{activePledges}</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statLabel}>Chain Links</div>
              <div className={styles.statValue}>{pledges.length}</div>
            </div>
          </div>
        </section>
      </FadeIn>

      {/* Live Challenge Board */}
      <section className={styles.challengeBoard}>
        <FadeIn direction="up">
          <div className={styles.boardHeader}>
            <div>
              <h2>The <span className="text-accent">Live Challenge Board</span></h2>
              <p className={styles.boardSubtitle}>These leaders have been nominated and are next in the chain.</p>
            </div>
            <Link href="/leaderboard" className="btn-premium btn-primary" style={{ fontSize: "0.8rem", minHeight: "44px", padding: "0.75rem 1.5rem" }}>
              View Full Honour Roll
            </Link>
          </div>
        </FadeIn>

        <div className={styles.pledgeGrid}>
          {pledges.filter(p => p.status === "pending" || p.status === "awaiting_payment").map((p, i) => {
            const deadlineDate = new Date(p.deadline);
            const today = new Date();
            const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

            let urgencyLabel = p.status === "awaiting_payment" ? "Awaiting Payment" : "Pending";
            let badgeClass = p.status === "awaiting_payment" ? styles.badgeBurning : styles.badgePending;
            let isBurning = false;

            if (p.status === "pending") {
              if (diffDays < 0) { urgencyLabel = "Overdue"; badgeClass = styles.badgeOverdue; }
              else if (diffDays <= 2) { urgencyLabel = "Burning"; badgeClass = styles.badgeBurning; isBurning = true; }
            }

            return (
              <FadeIn key={p.id} direction="up" delay={i * 80}>
                <div className={`${styles.pledgeCard} glass-card card-hover`}>
                  {isBurning && <div className={styles.burningEffect} />}
                  <div className={styles.cardTop}>
                    <div className={styles.pledgerInfo}>
                      <h3>{p.fullName}</h3>
                      <p>{p.organization}</p>
                    </div>
                    <span className={`${styles.urgencyBadge} ${badgeClass}`}>{urgencyLabel}</span>
                  </div>
                  <div className={styles.cardMeta}>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Challenged By</span>
                      <span className={styles.metaValue}>{p.challengedBy}</span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Time Remaining</span>
                      <span className={styles.metaValue} style={{ color: isBurning ? "#ef4444" : "inherit" }}>
                        {p.status === "awaiting_payment" ? "Payment pending" : diffDays < 0 ? "Overdue" : `${diffDays} days`}
                      </span>
                    </div>
                    <div className={styles.metaItem}>
                      <span className={styles.metaLabel}>Target</span>
                      <span className={styles.metaValue}>R{p.amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* Info Cards */}
      <main className={styles.content}>
        <FadeIn direction="left">
          <div className={styles.card}>
            <div className={styles.iconCircle}><Heart size={28} /></div>
            <h2>Our Mission</h2>
            <p>
              The WRSA Foundation preserves biodiversity through strategic
              industry partnership. The Wildlife Pledge Chain is our flagship initiative
              driving direct conservation impact.
            </p>
          </div>
        </FadeIn>

        <FadeIn direction="right">
          <div className={styles.card}>
            <div className={styles.iconCircle}><Users size={28} /></div>
            <h2>The Chain Reaction</h2>
            <p>
              Accept the challenge, commit your pledge, and nominate the next
              leader to carry the torch. Every link in the chain strengthens
              our collective legacy.
            </p>
            <Link href="/donate" className={styles.textLink}>
              How it works <ArrowRight size={16} />
            </Link>
          </div>
        </FadeIn>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <div style={{ opacity: 0.6, display: "flex", alignItems: "center", gap: "8px" }}>
          <ShieldCheck size={16} /> Secure Wildlife Conservation Platform
        </div>
      </footer>
    </div>
  );
}
