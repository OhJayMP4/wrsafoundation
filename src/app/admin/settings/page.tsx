"use client";

import styles from "../admin.module.css";
import { Mail, Key, Globe, Info } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>System <span className="text-accent">Settings</span></h1>
          <p className={styles.pageSubtitle}>Configuration for the WRSA pledging platform</p>
        </div>
      </header>

      <div style={{ display: "grid", gap: "1.5rem", maxWidth: "760px" }}>

        {/* Email config */}
        <div className={`${styles.contentCard} glass-card`} style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(197,160,89,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <Mail size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>Email Notifications</h2>
              <p style={{ fontSize: "0.8rem", opacity: 0.5, margin: 0 }}>Powered by Resend</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label className={styles.label}>RESEND_API_KEY</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.75rem 1rem", background: "#f8faf9", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
                <Key size={14} style={{ flexShrink: 0 }} />
                Set in <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>.env.local</code>
              </div>
            </div>
            <div>
              <label className={styles.label}>ADMIN_EMAIL</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.75rem 1rem", background: "#f8faf9", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
                <Mail size={14} style={{ flexShrink: 0 }} />
                Set in <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>.env.local</code>
              </div>
            </div>
            <div>
              <label className={styles.label}>RESEND_FROM_EMAIL</label>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "0.75rem 1rem", background: "#f8faf9", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
                <Globe size={14} style={{ flexShrink: 0 }} />
                Set in <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>.env.local</code>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "1.5rem", padding: "1rem", background: "rgba(197,160,89,0.08)", borderRadius: "8px", display: "flex", gap: "10px", fontSize: "0.8rem" }}>
            <Info size={14} style={{ flexShrink: 0, marginTop: "1px", color: "var(--accent)" }} />
            <span style={{ opacity: 0.8, lineHeight: 1.5 }}>
              To enable emails, create a free account at <strong>resend.com</strong>, generate an API key, and add it to your <code style={{ background: "#eee", padding: "1px 4px", borderRadius: "3px" }}>.env.local</code> file. Verify your sending domain for production use.
            </span>
          </div>
        </div>

        {/* App config */}
        <div className={`${styles.contentCard} glass-card`} style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(197,160,89,0.15)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
              <Globe size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>Application</h2>
              <p style={{ fontSize: "0.8rem", opacity: 0.5, margin: 0 }}>Base URL and environment</p>
            </div>
          </div>

          <div>
            <label className={styles.label}>NEXT_PUBLIC_APP_URL</label>
            <div style={{ padding: "0.75rem 1rem", background: "#f8faf9", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
              Set in <code style={{ background: "#eee", padding: "2px 6px", borderRadius: "4px" }}>.env.local</code> — used in challenge invite email links
            </div>
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label className={styles.label}>Firebase Project</label>
            <div style={{ padding: "0.75rem 1rem", background: "#f8faf9", borderRadius: "8px", border: "1px solid rgba(0,0,0,0.06)", fontFamily: "monospace", fontSize: "0.85rem", color: "#6b7280" }}>
              {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "wrsafoundation"}
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className={`${styles.contentCard} glass-card`} style={{ padding: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1rem" }}>
            <div style={{ width: "36px", height: "36px", background: "rgba(0,0,0,0.04)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.4 }}>
              <Key size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: "1rem", fontWeight: 800, margin: 0 }}>Payment Gateway</h2>
              <p style={{ fontSize: "0.8rem", opacity: 0.5, margin: 0 }}>PayFast integration — parked</p>
            </div>
          </div>
          <p style={{ opacity: 0.5, fontSize: "0.875rem", lineHeight: 1.6 }}>
            Payment processing via PayFast is currently disabled. The system uses manual payment confirmation via email. When you are ready to integrate PayFast, configure <code style={{ background: "#eee", padding: "1px 4px", borderRadius: "3px" }}>PAYFAST_MERCHANT_ID</code>, <code style={{ background: "#eee", padding: "1px 4px", borderRadius: "3px" }}>PAYFAST_MERCHANT_KEY</code>, and <code style={{ background: "#eee", padding: "1px 4px", borderRadius: "3px" }}>PAYFAST_PASSPHRASE</code> in your environment file.
          </p>
        </div>

      </div>
    </div>
  );
}
