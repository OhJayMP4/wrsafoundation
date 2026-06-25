"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSupporterAuth } from "@/context/SupporterAuthContext";

export function SupporterRouteGuard({ children }: { children: React.ReactNode }) {
  const { supporter, loading } = useSupporterAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !supporter) {
      router.push("/support-monthly/login");
    }
  }, [supporter, loading, router]);

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
