"use client";

import Link from "next/link";
import styles from "./admin.module.css";
import { LayoutDashboard, Users, CreditCard, LogOut, Settings, Award, User } from "lucide-react";
import { RouteGuard } from "@/components/RouteGuard";
import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <RouteGuard>
        {children}
      </RouteGuard>
    );
  }

  return (
    <RouteGuard>
      <div className={styles.adminContainer}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 1rem', marginBottom: '1rem' }}>
            <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
              <Award size={24} />
            </div>
            <span style={{ fontWeight: 800, letterSpacing: '0.05em' }}>WRSA ADMIN</span>
          </div>

          <div style={{ padding: '0 1rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem' }}>
              <User size={14} style={{ opacity: 0.5 }} />
              <span style={{ opacity: 0.8, overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email || "Admin User"}</span>
            </div>
          </div>

          <nav className={styles.nav}>
            <Link href="/admin/dashboard" className={`${styles.navItem} ${isActive('/admin/dashboard') ? styles.navItemActive : ''}`}>
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/admin/pledges" className={`${styles.navItem} ${isActive('/admin/pledges') ? styles.navItemActive : ''}`}>
              <Users size={20} /> Pledge Chain
            </Link>
            <Link href="/admin/donations" className={`${styles.navItem} ${isActive('/admin/donations') ? styles.navItemActive : ''}`}>
              <CreditCard size={20} /> Donations
            </Link>
            
            <Link href="/admin/settings" className={`${styles.navItem} ${isActive('/admin/settings') ? styles.navItemActive : ''}`} style={{ marginTop: 'auto' }}>
              <Settings size={20} /> Settings
            </Link>
            <div className={styles.navItem} onClick={() => logout()} style={{ color: '#fca5a5' }}>
              <LogOut size={20} /> Logout
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </RouteGuard>
  );
}
