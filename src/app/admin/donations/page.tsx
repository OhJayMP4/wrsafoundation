"use client";

import { useState, useMemo } from "react";
import styles from "../admin.module.css";
import { Download, Search, CreditCard } from "lucide-react";
import { useApp } from "@/context/AppContext";

export default function DonationsPage() {
  const { donations } = useApp();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDonations = useMemo(() => {
    if (!searchQuery) return donations;
    const q = searchQuery.toLowerCase();
    return donations.filter(
      (d) =>
        d.donorName.toLowerCase().includes(q) ||
        d.type.toLowerCase().includes(q) ||
        d.method.toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q)
    );
  }, [donations, searchQuery]);

  const handleExportCSV = () => {
    const headers = ["ID", "Donor", "Date", "Type", "Method", "Amount (R)"];
    const rows = donations.map((d) => [
      d.id,
      d.donorName,
      d.date,
      d.type,
      d.method,
      d.amount,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wrsa-donations-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalShown = filteredDonations.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Donation <span className="text-accent">History</span></h1>
          <p className={styles.pageSubtitle}>
            {filteredDonations.length} record{filteredDonations.length !== 1 ? "s" : ""} — R{totalShown.toLocaleString()} total
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="btn-premium"
          style={{ border: "1px solid rgba(0,0,0,0.05)", color: "var(--primary)", padding: "0.75rem 1.5rem" }}
        >
          <Download size={18} className="mr-2" /> Export CSV
        </button>
      </header>

      <div className={`${styles.contentCard} glass-card`} style={{ padding: "0" }}>
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", gap: "1rem", alignItems: "center" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
            <input
              type="text"
              placeholder="Search by donor, type or method..."
              className={styles.inputField}
              style={{ marginBottom: 0, paddingLeft: "2.5rem", background: "#f8faf9", border: "none" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <table className={styles.premiumTable}>
          <thead style={{ background: "#fcfcfb" }}>
            <tr>
              <th style={{ paddingLeft: "2rem" }}>Transaction ID</th>
              <th>Donor</th>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th style={{ paddingRight: "2rem" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredDonations.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>
                  No donations match your search.
                </td>
              </tr>
            )}
            {filteredDonations.map((d) => (
              <tr key={d.id}>
                <td style={{ paddingLeft: "2rem" }}>
                  <code style={{ fontSize: "0.7rem", background: "rgba(0,0,0,0.03)", padding: "4px 8px", borderRadius: "4px" }}>
                    {d.id.slice(0, 12)}…
                  </code>
                </td>
                <td>
                  <div className={styles.tableMainText}>{d.donorName}</div>
                  <div className={styles.tableSubText} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <CreditCard size={12} /> {d.method}
                  </div>
                </td>
                <td>
                  <div className={styles.tableSubText}>{d.date}</div>
                </td>
                <td>
                  <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "4px 8px", borderRadius: "4px", background: d.type === "Pledge Pay" ? "rgba(197, 160, 89, 0.1)" : "rgba(0,0,0,0.05)", color: d.type === "Pledge Pay" ? "var(--accent)" : "var(--primary)" }}>
                    {d.type.toUpperCase()}
                  </span>
                </td>
                <td className={styles.tableWeight}>R{d.amount.toLocaleString()}</td>
                <td style={{ paddingRight: "2rem" }}>
                  <span className={`${styles.badge} ${styles.badgeCompleted}`}>confirmed</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
