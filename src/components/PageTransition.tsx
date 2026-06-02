"use client";

import { usePathname } from "next/navigation";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Changing the key forces React to remount the div on every navigation,
  // which replays the CSS animation from scratch — no opacity toggle, no glitch.
  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  );
}
