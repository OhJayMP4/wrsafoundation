"use client";

import { useEffect, useState } from "react";

export default function PageLoader() {
  const [fading, setFading] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Only show once per browser session
    if (sessionStorage.getItem("loader_seen")) {
      setGone(true);
      return;
    }
    sessionStorage.setItem("loader_seen", "1");

    const t1 = setTimeout(() => setFading(true), 1400);
    const t2 = setTimeout(() => setGone(true), 1900);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: 10000,
      background: "#1c2e24",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "1.75rem",
      opacity: fading ? 0 : 1,
      pointerEvents: fading ? "none" : "all",
      transition: "opacity 0.5s ease",
    }}>
      {/* Spinning ring */}
      <div style={{
        width: "64px",
        height: "64px",
        borderRadius: "50%",
        border: "3px solid rgba(197,160,89,0.2)",
        borderTopColor: "#c5a059",
        animation: "loaderSpin 0.85s linear infinite",
      }} />

      <div style={{ textAlign: "center" }}>
        <div style={{
          color: "white",
          fontFamily: "var(--font-heading)",
          fontWeight: 800,
          fontSize: "1.1rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.4rem",
        }}>
          Wildlife Pledge Chain
        </div>
        <div style={{
          color: "#c5a059",
          fontSize: "0.75rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}>
          WRSA Foundation
        </div>
      </div>

      <style>{`
        @keyframes loaderSpin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
