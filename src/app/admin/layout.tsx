import Link from "next/link";
import styles from "./admin.module.css";
import { LayoutDashboard, Users, CreditCard, LogOut, Settings, Award } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.adminContainer}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 1rem' }}>
          <div style={{ width: '40px', height: '40px', background: 'var(--accent)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
            <Award size={24} />
          </div>
          <span style={{ fontWeight: 800, letterSpacing: '0.05em' }}>WRSA ADMIN</span>
        </div>

        <nav className={styles.nav}>
          <Link href="/admin/dashboard" className={styles.navItem}>
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link href="/admin/pledges" className={styles.navItem}>
            <Users size={20} /> Pledge Chain
          </Link>
          <Link href="/admin/donations" className={styles.navItem}>
            <CreditCard size={20} /> Donations
          </Link>
          <Link href="/admin/settings" className={styles.navItem} style={{ marginTop: 'auto' }}>
            <Settings size={20} /> Settings
          </Link>
          <Link href="/admin/login" className={styles.navItem}>
            <LogOut size={20} /> Logout
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
}
