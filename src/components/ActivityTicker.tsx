"use client";

import styles from "./ActivityTicker.module.css";
import { useApp } from "@/context/AppContext";
import { usePathname } from "next/navigation";

function relativeTime(dateStr: string): string {
  if (!dateStr || dateStr === "Just now" || dateStr === "Recently") return "Recently";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const diff = Date.now() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 2) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return date.toLocaleDateString("en-ZA", { day: "numeric", month: "short" });
}

export default function ActivityTicker() {
  const { activities } = useApp();
  const pathname = usePathname();

  if (pathname?.startsWith("/admin")) return null;
  if (activities.length === 0) return null;

  return (
    <div className={styles.tickerWrapper}>
      <div className={styles.tickerContent}>
        {[...activities, ...activities].map((activity, index) => (
          <div key={`${activity.id}-${index}`} className={styles.tickerItem}>
            <span className={styles.dot} />
            <span>{activity.message}</span>
            <span className={styles.date}>{relativeTime(activity.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
