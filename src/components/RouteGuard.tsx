"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      // If no user is logged in and they are trying to access admin (except login)
      if (!user && pathname !== "/admin/login") {
        router.push("/admin/login");
      }
      
      // If user is logged in but not an admin
      if (user && !isAdmin && pathname !== "/admin/login") {
        // We can redirect or show an access denied state
        // For now, let's allow them on login page to see the error
        console.warn("Unauthorized access attempt by", user.email);
      }
    }
  }, [user, isAdmin, loading, pathname, router]);

  // Show nothing while checking auth state
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--primary)', color: 'white' }}>
        <p style={{ letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.5 }}>Authenticating...</p>
      </div>
    );
  }

  // If not on login page and not authorized, we prevent rendering
  if (!user && pathname !== "/admin/login") {
    return null;
  }

  return <>{children}</>;
}
