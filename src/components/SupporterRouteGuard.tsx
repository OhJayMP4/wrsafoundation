"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSupporterAuth } from "@/context/SupporterAuthContext";

export function SupporterRouteGuard({ children }: { children: React.ReactNode }) {
  const { supporter, loading } = useSupporterAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !supporter) {
      router.push(`/support-monthly/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [supporter, loading, router, pathname]);

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ opacity: 0.5 }}>Loading...</p>
      </div>
    );
  }

  if (!supporter) return null;

  return <>{children}</>;
}
