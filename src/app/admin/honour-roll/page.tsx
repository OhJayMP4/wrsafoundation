"use client";

import { useMemo, useState } from "react";
import styles from "../admin.module.css";
import { Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Trophy, Plus, X } from "lucide-react";
import { useApp, Donation } from "@/context/AppContext";

export default function HonourRollPage() {
  const { donations, updateDonation, deleteDonation, addDonation } = useApp();

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addData, setAddData] = useState({ donorName: "", amount: 0, type: "Pledge Pay" as "Pledge Pay" | "General" });
  const [adding, setAdding] = useState(false);

  // Sort: by explicit order first, then by amount desc for unordered entries
  const sorted = useMemo(() => {
    return [...donations].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
      if (a.order !== undefined) return -1;
      if (b.order !== undefined) return 1;
      return b.amount - a.amount;
    });
  }, [donations]);

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const above = sorted[index - 1];
    const current = sorted[index];
    await updateDonation(current.id, { order: index - 1 });
    await updateDonation(above.id, { order: index });
  };

  const moveDown = async (index: number) => {
    if (index === sorted.length - 1) return;
    const below = sorted[index + 1];
    const current = sorted[index];
    await updateDonation(current.id, { order: index + 1 });
    await updateDonation(below.id, { order: index });
  };

  const toggleVisibility = (d: Donation) => {
    updateDonation(d.id, { visible: d.visible === false ? true : false });
  };

  const handleDelete = async (id: string) => {
    await deleteDonation(id);
    setConfirmDelete(null);
  };

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!addData.donorName || !addData.amount) return;
    setAdding(true);
    try {
      await addDonation({
        donorName: addData.donorName,
        amount: Number(addData.amount),
        type: addData.type,
        method: "Manual Entry",
      });
      setIsAddOpen(false);
      setAddData({ donorName: "", amount: 0, type: "Pledge Pay" });
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Honour <span className="text-accent">Roll</span></h1>
          <p className={styles.pageSubtitle}>Reorder, hide, or remove entries from the public leaderboard</p>
        </div>
        <button className="btn-premium btn-accent" style={{ padding: "0.75rem 1.5rem", fontSize: "0.8125rem" }} onClick={() => setIsAddOpen(true)}>
          <Plus size={16} /> Add Manual Entry
        </button>
      </header>

      <div className={`${styles.contentCard} glass-card`} style={{ padding: "0" }}>

        <div style={{ padding: "1.25rem 2rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Trophy size={16} color="var(--accent)" />
          <span style={{ fontSize: "0.875rem", opacity: 0.6 }}>
            {sorted.filter(d => d.visible !== false).length} visible · {sorted.filter(d => d.visible === false).length} hidden · {sorted.length} total
          </span>
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.premiumTable}>
            <thead style={{ background: "#fcfcfb" }}>
              <tr>
                <th style={{ paddingLeft: "1.5rem", width: "60px" }}>Pos</th>
                <th>Champion</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Visibility</th>
                <th style={{ paddingRight: "1.5rem", width: "120px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>
                    No donations recorded yet.
                  </td>
                </tr>
              )}
              {sorted.map((d, i) => (
                <tr key={d.id} style={{ opacity: d.visible === false ? 0.45 : 1, transition: "opacity 0.2s" }}>
                  <td style={{ paddingLeft: "1.5rem" }}>
                    <div style={{
                      width: "30px", height: "30px", borderRadius: "50%",
                      background: i === 0 ? "rgba(197,160,89,0.15)" : "rgba(0,0,0,0.04)",
                      color: i === 0 ? "var(--accent)" : "var(--muted)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 800, fontSize: "0.8rem", fontFamily: "var(--font-heading)",
                    }}>
                      {i + 1}
                    </div>
                  </td>
                  <td>
                    <div className={styles.tableMainText}>{d.donorName}</div>
                    <div className={styles.tableSubText}>{d.date}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "3px 8px", borderRadius: "4px", background: d.type === "Pledge Pay" ? "rgba(197,160,89,0.1)" : "rgba(0,0,0,0.05)", color: d.type === "Pledge Pay" ? "var(--accent)" : "var(--primary)" }}>
                      {d.type.toUpperCase()}
                    </span>
                  </td>
                  <td className={styles.tableWeight}>R{d.amount.toLocaleString()}</td>
                  <td>
                    <button
                      onClick={() => toggleVisibility(d)}
                      title={d.visible === false ? "Show on Honour Roll" : "Hide from Honour Roll"}
                      style={{ display: "flex", alignItems: "center", gap: "6px", background: "none", border: "none", cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, color: d.visible === false ? "#dc2626" : "#166534", padding: "0.25rem 0" }}
                    >
                      {d.visible === false
                        ? <><EyeOff size={14} /> Hidden</>
                        : <><Eye size={14} /> Visible</>}
                    </button>
                  </td>
                  <td style={{ paddingRight: "1.5rem" }}>
                    <div style={{ display: "flex", gap: "0.25rem", alignItems: "center", justifyContent: "flex-end" }}>
                      <button onClick={() => moveUp(i)} disabled={i === 0} title="Move up"
                        style={{ padding: "0.3rem", background: "none", border: "none", cursor: i === 0 ? "default" : "pointer", opacity: i === 0 ? 0.2 : 0.55, color: "var(--primary)" }}>
                        <ChevronUp size={18} />
                      </button>
                      <button onClick={() => moveDown(i)} disabled={i === sorted.length - 1} title="Move down"
                        style={{ padding: "0.3rem", background: "none", border: "none", cursor: i === sorted.length - 1 ? "default" : "pointer", opacity: i === sorted.length - 1 ? 0.2 : 0.55, color: "var(--primary)" }}>
                        <ChevronDown size={18} />
                      </button>
                      <button onClick={() => setConfirmDelete(d.id)} title="Delete permanently"
                        style={{ padding: "0.3rem", background: "none", border: "none", cursor: "pointer", opacity: 0.45, color: "#dc2626" }}>
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

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`} style={{ maxWidth: "420px" }}>
            <div className={styles.cardHeader}>
              <h3>Delete Entry</h3>
              <button onClick={() => setConfirmDelete(null)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <p style={{ opacity: 0.7, marginBottom: "1.5rem", lineHeight: 1.6 }}>
              This will permanently remove this entry from the Honour Roll and cannot be undone. To temporarily hide it, use the visibility toggle instead.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button onClick={() => setConfirmDelete(null)} className="btn-premium btn-primary" style={{ flex: 1, minHeight: "44px" }}>
                Cancel
              </button>
              <button onClick={() => handleDelete(confirmDelete)} style={{ flex: 1, minHeight: "44px", background: "#dc2626", color: "white", border: "none", borderRadius: "999px", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-heading)", fontSize: "0.875rem" }}>
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add manual entry modal */}
      {isAddOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Add Manual Entry</h3>
              <button onClick={() => setIsAddOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <p style={{ opacity: 0.6, marginBottom: "1.5rem", fontSize: "0.875rem", lineHeight: 1.5 }}>
              Manually add a champion to the Honour Roll — useful for offline donations or corrections.
            </p>
            <form onSubmit={handleAdd}>
              <label className={styles.label}>Full Name</label>
              <input type="text" required className={styles.inputField}
                placeholder="e.g. John Smith"
                value={addData.donorName}
                onChange={(e) => setAddData({ ...addData, donorName: e.target.value })}
              />
              <label className={styles.label}>Amount (R)</label>
              <input type="number" required min={1} className={styles.inputField}
                value={addData.amount || ""}
                onChange={(e) => setAddData({ ...addData, amount: Number(e.target.value) })}
              />
              <label className={styles.label}>Type</label>
              <select className={styles.inputField} value={addData.type}
                onChange={(e) => setAddData({ ...addData, type: e.target.value as "Pledge Pay" | "General" })}>
                <option value="Pledge Pay">Pledge Pay</option>
                <option value="General">General</option>
              </select>
              <button type="submit" disabled={adding} className="btn-premium btn-accent" style={{ width: "100%", marginTop: "0.5rem" }}>
                {adding ? "Adding..." : "Add to Honour Roll"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
