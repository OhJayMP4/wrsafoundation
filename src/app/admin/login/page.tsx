"use client";

import { useState, useEffect } from "react";
import styles from "../../donate/donate.module.css";
import { Lock, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If already logged in and authorized, skip login page
    if (!loading && user && isAdmin) {
      router.push("/admin/dashboard");
    }
  }, [user, isAdmin, loading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // The useEffect will handle redirection once the Auth state updates
    } catch (err: any) {
      console.error("Login Error:", err);
      if (err.code === "auth/user-not-found" || err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setError("Invalid email or password.");
      } else {
        setError("An error occurred during sign-in. Please try again.");
      }
      setIsSubmitting(false);
    }
  };

  // If user is logged in but NOT an admin, show a specific error
  const showAuthError = user && !isAdmin && !loading;

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
          {error && (
            <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {showAuthError && (
            <div style={{ background: '#fffbeb', color: '#92400e', padding: '1rem', borderRadius: '8px', fontSize: '0.875rem', marginBottom: '1.5rem', display: 'flex', gap: '8px', alignItems: 'center' }}>
              <AlertCircle size={16} /> 
              <span>Your account (<strong>{user.email}</strong>) is not authorized for admin access.</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <label className={styles.label}>Email Address</label>
            <input 
              type="email" 
              required
              className={styles.input} 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wrsa.org"
              disabled={isSubmitting}
            />

            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              required
              className={styles.input} 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isSubmitting}
            />

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#1B3022] text-white font-bold py-3 rounded-md hover:brightness-125 transition-all uppercase tracking-widest mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.75rem', opacity: 0.5 }}>
          Authorized Personnel Only. | <Link href="/" style={{ textDecoration: 'underline' }}>Back to Public Site</Link>
        </p>
      </div>
    </div>
  );
}
