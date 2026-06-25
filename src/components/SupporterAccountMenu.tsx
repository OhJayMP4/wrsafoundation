"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { UserCircle, LayoutDashboard, LogIn, UserPlus, LogOut } from "lucide-react";
import { useSupporterAuth } from "@/context/SupporterAuthContext";

export default function SupporterAccountMenu({ onNavigate }: { onNavigate?: () => void }) {
  const { supporter, logOut } = useSupporterAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const close = () => {
    setOpen(false);
    onNavigate?.();
  };

  const handleLogout = async () => {
    await logOut();
    close();
    router.push("/");
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        title={supporter ? supporter.email || "My Account" : "Sign in"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          background: supporter ? "rgba(197,160,89,0.2)" : "rgba(255,255,255,0.08)",
          border: supporter ? "1.5px solid var(--accent)" : "1.5px solid rgba(255,255,255,0.25)",
          color: supporter ? "var(--accent)" : "white",
          cursor: "pointer",
          flexShrink: 0,
        }}
      >
        <UserCircle size={20} />
      </button>

      {open && (
        <div style={{
          position: "absolute",
          top: "calc(100% + 10px)",
          right: 0,
          background: "white",
          borderRadius: "var(--radius-sm)",
          boxShadow: "0 12px 32px rgba(28,46,36,0.22)",
          minWidth: "230px",
          overflow: "hidden",
          zIndex: 1000,
        }}>
          {supporter ? (
            <>
              <div style={{ padding: "0.875rem 1.1rem", borderBottom: "1px solid rgba(28,46,36,0.07)" }}>
                <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.07em", opacity: 0.5, fontWeight: 700, marginBottom: "2px" }}>Signed in as</div>
                <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {supporter.displayName || supporter.email}
                </div>
              </div>
              <Link href="/support-monthly/dashboard" onClick={close}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1.1rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
                <LayoutDashboard size={16} /> My Dashboard
              </Link>
              <button onClick={handleLogout}
                style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", textAlign: "left", padding: "0.875rem 1.1rem", color: "#dc2626", fontWeight: 600, fontSize: "0.9rem", background: "none", border: "none", borderTop: "1px solid rgba(28,46,36,0.07)", cursor: "pointer" }}>
                <LogOut size={16} /> Log Out
              </button>
            </>
          ) : (
            <>
              <div style={{ padding: "0.875rem 1.1rem 0.5rem", fontSize: "0.8rem", opacity: 0.6, lineHeight: 1.5 }}>
                Sign in to manage your monthly debit order.
              </div>
              <Link href="/support-monthly/login" onClick={close}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1.1rem", color: "var(--primary)", fontWeight: 600, fontSize: "0.9rem", textDecoration: "none" }}>
                <LogIn size={16} /> Log In
              </Link>
              <Link href="/support-monthly/signup" onClick={close}
                style={{ display: "flex", alignItems: "center", gap: "10px", padding: "0.875rem 1.1rem", color: "var(--accent)", fontWeight: 700, fontSize: "0.9rem", textDecoration: "none", borderTop: "1px solid rgba(28,46,36,0.07)" }}>
                <UserPlus size={16} /> Create Account
              </Link>
            </>
          )}
        </div>
      )}
    </div>
  );
}
