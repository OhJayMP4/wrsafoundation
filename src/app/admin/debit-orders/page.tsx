"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, onSnapshot, query, orderBy, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import styles from "../admin.module.css";
import { DebitOrder } from "@/types/debitOrder";
import { Search, Eye, Trash2, X, Building2, User, CheckCircle, XCircle } from "lucide-react";

type FilterStatus = "all" | "pending" | "active" | "completed" | "cancelled";
type FilterType = "all" | "individual" | "business";

export default function DebitOrdersPage() {
  const [orders, setOrders] = useState<DebitOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterType, setFilterType] = useState<FilterType>("all");

  const [viewOrder, setViewOrder] = useState<DebitOrder | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "debitOrders"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setOrders(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as DebitOrder[]);
      setLoading(false);
    }, (err) => {
      console.error("Error loading debit orders:", err);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const name = (o.applicantType === "individual" ? o.fullName : o.companyName) || "";
      const matchesSearch = !searchQuery ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = filterStatus === "all" || o.status === filterStatus;
      const matchesType = filterType === "all" || o.applicantType === filterType;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [orders, searchQuery, filterStatus, filterType]);

  const totalMonthly = filtered.filter(o => o.status === "active").reduce((sum, o) => sum + o.amount, 0);

  const updateStatus = async (id: string, status: DebitOrder["status"]) => {
    await updateDoc(doc(db, "debitOrders", id), { status });
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "debitOrders", id));
    setConfirmDelete(null);
    setViewOrder(null);
  };

  const statusBadgeClass = (status: DebitOrder["status"]) => {
    switch (status) {
      case "active": return styles.badgeCompleted;
      case "pending": return styles.badgePending;
      case "completed": return styles.badgeCompleted;
      case "cancelled": return styles.badgeDenied;
      default: return styles.badgePending;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Debit <span className="text-accent">Orders</span></h1>
          <p className={styles.pageSubtitle}>
            {filtered.length} mandate{filtered.length !== 1 ? "s" : ""} · R{totalMonthly.toLocaleString()}/month from active orders
          </p>
        </div>
      </header>

      <div className={`${styles.contentCard} glass-card`} style={{ padding: "0" }}>
        {/* Filters */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
            <input
              type="text" placeholder="Search by name or email..."
              className={styles.inputField}
              style={{ marginBottom: 0, paddingLeft: "2.5rem", background: "#f8faf9", border: "none" }}
              value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["all", "individual", "business"] as FilterType[]).map((t) => (
              <button key={t} onClick={() => setFilterType(t)}
                style={{ padding: "0.5rem 0.875rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid", cursor: "pointer", textTransform: "capitalize", background: filterType === t ? "var(--primary)" : "transparent", color: filterType === t ? "white" : "var(--primary)", borderColor: filterType === t ? "var(--primary)" : "rgba(0,0,0,0.1)" }}>
                {t}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {(["all", "pending", "active", "completed", "cancelled"] as FilterStatus[]).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s)}
                style={{ padding: "0.5rem 0.875rem", borderRadius: "999px", fontSize: "0.75rem", fontWeight: 700, border: "1px solid", cursor: "pointer", textTransform: "capitalize", background: filterStatus === s ? "var(--primary)" : "transparent", color: filterStatus === s ? "white" : "var(--primary)", borderColor: filterStatus === s ? "var(--primary)" : "rgba(0,0,0,0.1)" }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.premiumTable}>
            <thead style={{ background: "#fcfcfb" }}>
              <tr>
                <th style={{ paddingLeft: "2rem" }}>Supporter</th>
                <th>Type</th>
                <th>Monthly Amount</th>
                <th>Debit Day</th>
                <th>Commitment</th>
                <th>Status</th>
                <th style={{ paddingRight: "2rem" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan={7} style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>No debit orders found.</td></tr>
              )}
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td style={{ paddingLeft: "2rem" }}>
                    <div className={styles.tableMainText}>{o.applicantType === "individual" ? o.fullName : o.companyName}</div>
                    <div className={styles.tableSubText}>{o.email}</div>
                  </td>
                  <td>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", fontSize: "0.8rem", opacity: 0.7, textTransform: "capitalize" }}>
                      {o.applicantType === "individual" ? <User size={13} /> : <Building2 size={13} />} {o.applicantType}
                    </span>
                  </td>
                  <td className={styles.tableWeight}>R{o.amount.toLocaleString()}</td>
                  <td><div className={styles.dateBadge}>{o.debitDay}{o.debitDay === 1 ? "st" : "th"}</div></td>
                  <td><div className={styles.tableSubText}>{o.commitmentMonths} months</div></td>
                  <td><span className={`${styles.badge} ${statusBadgeClass(o.status)}`}>{o.status}</span></td>
                  <td style={{ paddingRight: "2rem" }}>
                    <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end" }}>
                      {o.status === "pending" && (
                        <button onClick={() => updateStatus(o.id, "active")} title="Activate mandate"
                          style={{ background: "var(--accent)", color: "var(--primary)", border: "none", borderRadius: "6px", padding: "0.375rem 0.625rem", cursor: "pointer", fontWeight: 700, fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px" }}>
                          <CheckCircle size={13} /> Activate
                        </button>
                      )}
                      {o.status === "active" && (
                        <button onClick={() => updateStatus(o.id, "cancelled")} title="Cancel mandate"
                          style={{ background: "none", border: "1px solid rgba(220,38,38,0.3)", color: "#dc2626", borderRadius: "6px", padding: "0.375rem 0.625rem", cursor: "pointer", fontWeight: 700, fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px" }}>
                          <XCircle size={13} /> Cancel
                        </button>
                      )}
                      <button onClick={() => setViewOrder(o)} title="View full details" style={{ opacity: 0.5, padding: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "inherit" }}>
                        <Eye size={16} />
                      </button>
                      <button onClick={() => setConfirmDelete(o.id)} title="Delete" style={{ opacity: 0.5, padding: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "#dc2626" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {viewOrder && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`} style={{ maxWidth: "560px" }}>
            <div className={styles.cardHeader}>
              <h3>{viewOrder.applicantType === "individual" ? viewOrder.fullName : viewOrder.companyName}</h3>
              <button onClick={() => setViewOrder(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "0.5rem" }}>Contact</div>
                <div style={{ fontSize: "0.9rem" }}>{viewOrder.email} {viewOrder.phone && `· ${viewOrder.phone}`}</div>
                {viewOrder.applicantType === "individual" && viewOrder.idNumber && (
                  <div style={{ fontSize: "0.9rem", opacity: 0.7, marginTop: "0.25rem" }}>ID: {viewOrder.idNumber}</div>
                )}
                {viewOrder.applicantType === "business" && (
                  <div style={{ fontSize: "0.9rem", opacity: 0.7, marginTop: "0.25rem" }}>
                    Reg: {viewOrder.registrationNumber} · Contact: {viewOrder.contactPerson}
                  </div>
                )}
              </div>

              <div style={{ background: "#faf8f4", borderRadius: "var(--radius-sm)", padding: "1.25rem" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "0.75rem" }}>Banking Details</div>
                <table style={{ width: "100%", fontSize: "0.875rem" }}>
                  <tbody>
                    <tr><td style={{ padding: "0.3rem 0", opacity: 0.6 }}>Bank</td><td style={{ padding: "0.3rem 0", fontWeight: 700, textAlign: "right" }}>{viewOrder.bankName}</td></tr>
                    <tr><td style={{ padding: "0.3rem 0", opacity: 0.6 }}>Account Holder</td><td style={{ padding: "0.3rem 0", fontWeight: 700, textAlign: "right" }}>{viewOrder.accountHolder}</td></tr>
                    <tr><td style={{ padding: "0.3rem 0", opacity: 0.6 }}>Account Number</td><td style={{ padding: "0.3rem 0", fontWeight: 700, textAlign: "right", fontFamily: "monospace" }}>{viewOrder.accountNumber}</td></tr>
                    <tr><td style={{ padding: "0.3rem 0", opacity: 0.6 }}>Branch Code</td><td style={{ padding: "0.3rem 0", fontWeight: 700, textAlign: "right" }}>{viewOrder.branchCode}</td></tr>
                    <tr><td style={{ padding: "0.3rem 0", opacity: 0.6 }}>Account Type</td><td style={{ padding: "0.3rem 0", fontWeight: 700, textAlign: "right" }}>{viewOrder.bankAccountType}</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "0.4rem" }}>Monthly Amount</div>
                  <div style={{ fontWeight: 800, fontSize: "1.3rem", color: "var(--accent)", fontFamily: "var(--font-heading)" }}>R{viewOrder.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "0.4rem" }}>Debit Day</div>
                  <div style={{ fontWeight: 700 }}>{viewOrder.debitDay}{viewOrder.debitDay === 1 ? "st" : "th"} of month</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "0.4rem" }}>Commitment</div>
                  <div style={{ fontWeight: 700 }}>{viewOrder.commitmentMonths} months</div>
                </div>
                <div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "0.4rem" }}>First Debit</div>
                  <div style={{ fontWeight: 700 }}>{viewOrder.startDate}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`} style={{ maxWidth: "420px" }}>
            <div className={styles.cardHeader}>
              <h3>Delete Mandate</h3>
              <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <p style={{ opacity: 0.7, marginBottom: "1.5rem", lineHeight: 1.6 }}>
              This will permanently delete this debit order mandate, including banking details. This cannot be undone.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setConfirmDelete(null)} className="btn-premium btn-primary" style={{ flex: 1, minHeight: "44px" }}>Cancel</button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, minHeight: "44px", background: "#dc2626", color: "white", border: "none", borderRadius: "999px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)", fontSize: "0.875rem" }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
