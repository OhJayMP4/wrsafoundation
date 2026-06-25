"use client";

import { usePathname } from "next/navigation";
import PageTransition from "@/components/PageTransition";
import Footer from "@/components/Footer";

// Applies correct top padding based on route:
// Public  → nav (64px). ActivityTicker is currently hidden — when restored, add its height back here.
// Admin   → 0 (admin layout manages its own spacing)
export default function RootShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div style={{ paddingTop: isAdmin ? 0 : "64px" }} className={isAdmin ? "" : "public-shell"}>
      <PageTransition>
        {children}
      </PageTransition>
      <Footer />
    </div>
  );
}
