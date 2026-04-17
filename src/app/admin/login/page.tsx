"use client";

import { useState } from "react";
import styles from "../../donate/donate.module.css";
import { Lock, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8faf9' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--primary)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', color: 'white' }}>
            <Lock size={32} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Admin Portal</h1>
          <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Secure access for WRSA Foundation staff</p>
        </div>

        <div className={styles.formCard} style={{ padding: '2rem' }}>
          <label className={styles.label}>Email Address</label>
          <input 
            type="email" 
            className={styles.input} 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@wrsa.org"
          />

          <label className={styles.label}>Password</label>
          <input 
            type="password" 
            className={styles.input} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />

          <button className="w-full bg-[#1B3022] text-white font-bold py-3 rounded-md hover:brightness-125 transition-all uppercase tracking-widest mt-2">
            Sign In
          </button>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', opacity: 0.5 }}>
          Authorized Personnel Only. | <Link href="/" style={{ textDecoration: 'underline' }}>Back to Public Site</Link>
        </p>
      </div>
    </div>
  );
}
