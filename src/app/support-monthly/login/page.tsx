"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, ArrowRight } from "lucide-react";
import { useSupporterAuth } from "@/context/SupporterAuthContext";
import styles from "../../donate/donate.module.css";

export default function SupporterLoginPage() {
  const { logIn } = useSupporterAuth();
  const router = useRouter();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await logIn(formData.email, formData.password);
      router.push("/support-monthly/dashboard");
    } catch {
      setError("Incorrect email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: "480px" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Welcome <span className="text-accent">Back</span></h1>
        <p>Log in to manage your monthly debit order.</p>
      </div>

      <div className={`${styles.formCard} glass-card`}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(197,160,89,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <LogIn size={26} />
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "0.875rem 1.25rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.innerForm}>
          <input type="email" required className={styles.inputField} placeholder="Email Address"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" required className={styles.inputField} placeholder="Password"
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

          <button type="submit" disabled={loading} className="btn-premium btn-accent" style={{ width: "100%", marginTop: "1rem" }}>
            {loading ? "Logging in..." : <>Log In <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.7 }}>
          Don't have an account? <Link href="/support-monthly/signup" style={{ color: "var(--accent)", fontWeight: 700 }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}
