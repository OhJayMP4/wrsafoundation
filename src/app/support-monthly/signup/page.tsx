"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { UserPlus, ArrowRight } from "lucide-react";
import { useSupporterAuth } from "@/context/SupporterAuthContext";
import styles from "../../donate/donate.module.css";

function SignupForm() {
  const { signUp } = useSupporterAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/support-monthly/setup";

  const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.name, formData.email, formData.password);
      router.push(next);
    } catch (err: any) {
      setError(err.message?.includes("email-already-in-use")
        ? "An account already exists with this email. Try logging in instead."
        : "Could not create your account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} style={{ maxWidth: "520px" }}>
      <div className={styles.header}>
        <h1 className={styles.title}>Create Your <span className="text-accent">Account</span></h1>
        <p>A free account lets you make pledges, accept challenges, and set up monthly support — all tracked in one dashboard.</p>
      </div>

      <div className={`${styles.formCard} glass-card`}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "1.5rem" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(197,160,89,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--accent)" }}>
            <UserPlus size={26} />
          </div>
        </div>

        {error && (
          <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "0.875rem 1.25rem", borderRadius: "var(--radius-sm)", marginBottom: "1.25rem", fontSize: "0.875rem" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.innerForm}>
          <input type="text" required className={styles.inputField} placeholder="Full Name"
            value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          <input type="email" required className={styles.inputField} placeholder="Email Address"
            value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
          <input type="password" required className={styles.inputField} placeholder="Password (min. 6 characters)"
            value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
          <input type="password" required className={styles.inputField} placeholder="Confirm Password"
            value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} />

          <button type="submit" disabled={loading} className="btn-premium btn-accent" style={{ width: "100%", marginTop: "1rem" }}>
            {loading ? "Creating Account..." : <>Create Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: "0.9rem", opacity: 0.7 }}>
          Already have an account? <Link href={`/support-monthly/login?next=${encodeURIComponent(next)}`} style={{ color: "var(--accent)", fontWeight: 700 }}>Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default function SupporterSignupPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <SignupForm />
    </Suspense>
  );
}
