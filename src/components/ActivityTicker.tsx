"use client";

import styles from "./ActivityTicker.module.css";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";

export default function ActivityTicker() {
  const { activities } = useApp();
  const pathname = usePathname();

  // Hide the ticker entirely on the admin login page
  if (pathname === "/admin/login") {
    return null;
  }

  return (
    <div className={styles.tickerWrapper}>
      <div className={styles.tickerContent}>
        {/* Duplicate list for seamless loop */}
        {[...activities, ...activities].map((activity, index) => (
          <div key={`${activity.id}-${index}`} className={styles.tickerItem}>
            <span className={styles.dot} />
            <span className={styles.message}>{activity.message}</span>
            <span className={styles.date}>{activity.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
