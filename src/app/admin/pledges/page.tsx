"use client";

import { useState, useMemo } from "react";
import styles from "../admin.module.css";
import { Plus, Search, Pencil, Trash2, Clock, X, Check, CheckCircle, Mail, Phone, Link2 } from "lucide-react";
import { useApp, Pledge } from "@/context/AppContext";

type FilterStatus = "all" | "pending" | "awaiting_payment" | "completed" | "overdue" | "denied";

export default function PledgesPage() {
  const { pledges, addPledge, editPledge, deletePledge, markAsPaid } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");

  // Add modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPledgeData, setNewPledgeData] = useState({ fullName: "", organization: "", amount: 36000, nomineeEmail: "" });
  const [addLoading, setAddLoading] = useState(false);

  // Edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPledgeId, setEditingPledgeId] = useState<string | null>(null);
  const [editPledgeData, setEditPledgeData] = useState<Partial<Pledge>>({});

  // Mark as paid modal
  const [isPaidModalOpen, setIsPaidModalOpen] = useState(false);
  const [paidPledge, setPaidPledge] = useState<Pledge | null>(null);
  const [paidAmount, setPaidAmount] = useState(0);
  const [paidLoading, setPaidLoading] = useState(false);

  // Copy link feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPledges = useMemo(() => {
    return pledges.filter((p) => {
      const matchesSearch =
        !searchQuery ||
        p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.nomineeEmail || "").toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = filterStatus === "all" || p.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [pledges, searchQuery, filterStatus]);

  const getUrgency = (p: Pledge): { label: string; badgeClass: string } => {
    if (p.status === "completed") return { label: "Paid", badgeClass: styles.badgeCompleted };
    if (p.status === "denied") return { label: "Denied", badgeClass: styles.badgeDenied || styles.badgeOverdue };
    if (p.status === "awaiting_payment") return { label: "Awaiting Payment", badgeClass: styles.badgeBurning };

    const deadlineDate = new Date(p.deadline);
    const today = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: "Overdue", badgeClass: styles.badgeOverdue };
    if (diffDays <= 2) return { label: "Burning", badgeClass: styles.badgeBurning };
    return { label: "Pending", badgeClass: styles.badgePending };
  };

  const handleAddPledge = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setAddLoading(true);
    try {
      const pledgeId = await addPledge({
        fullName: newPledgeData.fullName,
        organization: newPledgeData.organization,
        amount: newPledgeData.amount,
        challengedBy: "WRSA Admin",
        nomineeEmail: newPledgeData.nomineeEmail || undefined,
      });

      // If email was provided, send the challenge invitation
      if (newPledgeData.nomineeEmail) {
        const link = `${window.location.origin}/challenge/${pledgeId}`;
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "nominee_challenge",
            nomineeName: newPledgeData.fullName,
            nomineeEmail: newPledgeData.nomineeEmail,
            challengedBy: "WRSA Foundation",
            amount: newPledgeData.amount,
            challengeLink: link,
          }),
        });
      }

      setIsModalOpen(false);
      setNewPledgeData({ fullName: "", organization: "", amount: 36000, nomineeEmail: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setAddLoading(false);
    }
  };

  const handleEditClick = (pledge: Pledge) => {
    setEditingPledgeId(pledge.id);
    setEditPledgeData(pledge);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!editingPledgeId) return;
    await editPledge(editingPledgeId, editPledgeData);
    setIsEditModalOpen(false);
    setEditingPledgeId(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this pledge permanently?")) {
      await deletePledge(id);
    }
  };

  const handleMarkPaidClick = (pledge: Pledge) => {
    setPaidPledge(pledge);
    setPaidAmount(pledge.amount);
    setIsPaidModalOpen(true);
  };

  const handleMarkPaidSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!paidPledge) return;
    setPaidLoading(true);
    try {
      await markAsPaid(paidPledge.id, paidAmount);
      setIsPaidModalOpen(false);
      setPaidPledge(null);
    } catch (err) {
      console.error(err);
    } finally {
      setPaidLoading(false);
    }
  };

  const handleCopyLink = (pledgeId: string) => {
    const link = `${window.location.origin}/challenge/${pledgeId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(pledgeId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const statusOptions: { value: FilterStatus; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "awaiting_payment", label: "Awaiting Payment" },
    { value: "completed", label: "Paid" },
    { value: "overdue", label: "Overdue" },
    { value: "denied", label: "Denied" },
  ];

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.dashboardHeader}>
        <div>
          <h1 className={styles.pageTitle}>Pledge <span className="text-accent">Chain</span></h1>
          <p className={styles.pageSubtitle}>Manage and track the R36K legacy progression</p>
        </div>
        <button
          className="btn-premium btn-accent"
          style={{ padding: "0.75rem 1.5rem", fontSize: "0.8125rem" }}
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={16} className="mr-2" /> Add New Pledge
        </button>
      </header>

      <div className={`${styles.contentCard} glass-card`} style={{ padding: "0" }}>
        {/* Search + Filter Bar */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(0,0,0,0.05)", display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
            <Search size={18} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", opacity: 0.3 }} />
            <input
              type="text"
              placeholder="Search by name, org or email..."
              className={styles.inputField}
              style={{ marginBottom: 0, paddingLeft: "2.5rem", background: "#f8faf9", border: "none" }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterStatus(opt.value)}
                style={{
                  padding: "0.5rem 0.875rem",
                  borderRadius: "999px",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "1px solid",
                  cursor: "pointer",
                  background: filterStatus === opt.value ? "var(--primary)" : "transparent",
                  color: filterStatus === opt.value ? "white" : "var(--primary)",
                  borderColor: filterStatus === opt.value ? "var(--primary)" : "rgba(0,0,0,0.1)",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <table className={styles.premiumTable}>
          <thead style={{ background: "#fcfcfb" }}>
            <tr>
              <th style={{ paddingLeft: "2rem" }}>Pledger</th>
              <th>Contact</th>
              <th>Challenged By</th>
              <th>Deadline</th>
              <th>Amount</th>
              <th>Status</th>
              <th style={{ paddingRight: "2rem" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPledges.length === 0 && (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", padding: "3rem", opacity: 0.4 }}>
                  No pledges match your search.
                </td>
              </tr>
            )}
            {filteredPledges.map((p) => {
              const { label, badgeClass } = getUrgency(p);
              const contactEmail = p.pledgerEmail || p.nomineeEmail;

              return (
                <tr key={p.id}>
                  <td style={{ paddingLeft: "2rem" }}>
                    <div className={styles.tableMainText}>{p.fullName}</div>
                    <div className={styles.tableSubText}>{p.organization}</div>
                  </td>
                  <td>
                    {contactEmail ? (
                      <a href={`mailto:${contactEmail}`} style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>
                        <Mail size={12} /> {contactEmail}
                      </a>
                    ) : (
                      <span style={{ opacity: 0.3, fontSize: "0.8rem" }}>—</span>
                    )}
                    {p.pledgerPhone && (
                      <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", opacity: 0.6, marginTop: "2px" }}>
                        <Phone size={11} /> {p.pledgerPhone}
                      </div>
                    )}
                  </td>
                  <td>
                    <div className={styles.tableSubText}>{p.challengedBy}</div>
                  </td>
                  <td>
                    <div className={styles.dateBadge}>
                      <Clock size={12} /> {p.deadline}
                    </div>
                  </td>
                  <td className={styles.tableWeight}>R{p.amount.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.badge} ${badgeClass}`}>{label}</span>
                  </td>
                  <td style={{ paddingRight: "2rem" }}>
                    <div style={{ display: "flex", gap: "0.375rem", justifyContent: "flex-end", alignItems: "center" }}>
                      {/* Mark as Paid — for any pledge not yet completed or denied */}
                      {p.status !== "completed" && p.status !== "denied" && (
                        <button
                          onClick={() => handleMarkPaidClick(p)}
                          title="Mark as Paid"
                          style={{ background: "var(--accent)", color: "var(--primary)", border: "none", borderRadius: "6px", padding: "0.375rem 0.625rem", cursor: "pointer", fontWeight: 700, fontSize: "0.7rem", display: "flex", alignItems: "center", gap: "4px" }}
                        >
                          <CheckCircle size={13} /> Paid
                        </button>
                      )}
                      {/* Copy challenge link */}
                      {p.status !== "completed" && p.status !== "denied" && (
                        <button
                          onClick={() => handleCopyLink(p.id)}
                          title="Copy challenge link"
                          style={{ opacity: 0.5, padding: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "inherit" }}
                        >
                          {copiedId === p.id ? <Check size={16} color="#166534" /> : <Link2 size={16} />}
                        </button>
                      )}
                      <button onClick={() => handleEditClick(p)} style={{ opacity: 0.5, padding: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "inherit" }} title="Edit">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} style={{ opacity: 0.5, padding: "0.25rem", background: "none", border: "none", cursor: "pointer", color: "#dc2626" }} title="Delete">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Pledge Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Create New Pledge</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleAddPledge}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text" required className={styles.inputField}
                value={newPledgeData.fullName}
                onChange={(e) => setNewPledgeData({ ...newPledgeData, fullName: e.target.value })}
              />
              <label className={styles.label}>Organization</label>
              <input
                type="text" required className={styles.inputField}
                value={newPledgeData.organization}
                onChange={(e) => setNewPledgeData({ ...newPledgeData, organization: e.target.value })}
              />
              <label className={styles.label}>Pledge Amount (R)</label>
              <input
                type="number" required min={1} className={styles.inputField}
                value={newPledgeData.amount}
                onChange={(e) => setNewPledgeData({ ...newPledgeData, amount: Number(e.target.value) })}
              />
              <label className={styles.label}>Nominee Email <span style={{ fontWeight: 400, opacity: 0.5 }}>(optional — sends challenge invite)</span></label>
              <input
                type="email" className={styles.inputField}
                placeholder="nominee@example.com"
                value={newPledgeData.nomineeEmail}
                onChange={(e) => setNewPledgeData({ ...newPledgeData, nomineeEmail: e.target.value })}
              />
              <button type="submit" disabled={addLoading} className="btn-premium btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                {addLoading ? "Creating..." : newPledgeData.nomineeEmail ? "Create & Send Invite" : "Create Pledge"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Edit Pledge</h3>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text" required className={styles.inputField}
                value={editPledgeData.fullName || ""}
                onChange={(e) => setEditPledgeData({ ...editPledgeData, fullName: e.target.value })}
              />
              <label className={styles.label}>Organization</label>
              <input
                type="text" required className={styles.inputField}
                value={editPledgeData.organization || ""}
                onChange={(e) => setEditPledgeData({ ...editPledgeData, organization: e.target.value })}
              />
              <label className={styles.label}>Pledge Amount (R)</label>
              <input
                type="number" required min={1} className={styles.inputField}
                value={editPledgeData.amount || 0}
                onChange={(e) => setEditPledgeData({ ...editPledgeData, amount: Number(e.target.value) })}
              />
              <label className={styles.label}>Challenged By</label>
              <input
                type="text" required className={styles.inputField}
                value={editPledgeData.challengedBy || ""}
                onChange={(e) => setEditPledgeData({ ...editPledgeData, challengedBy: e.target.value })}
              />
              <label className={styles.label}>Nominee Email</label>
              <input
                type="email" className={styles.inputField}
                value={editPledgeData.nomineeEmail || ""}
                onChange={(e) => setEditPledgeData({ ...editPledgeData, nomineeEmail: e.target.value })}
              />
              <label className={styles.label}>Status</label>
              <select
                className={styles.inputField}
                value={editPledgeData.status || "pending"}
                onChange={(e) => setEditPledgeData({ ...editPledgeData, status: e.target.value as Pledge["status"] })}
              >
                <option value="pending">Pending</option>
                <option value="awaiting_payment">Awaiting Payment</option>
                <option value="completed">Completed (Paid)</option>
                <option value="overdue">Overdue</option>
                <option value="denied">Denied</option>
              </select>
              <button type="submit" className="btn-premium btn-accent" style={{ width: "100%", marginTop: "1rem" }}>
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mark as Paid Modal */}
      {isPaidModalOpen && paidPledge && (
        <div className={styles.modalOverlay}>
          <div className={`${styles.modalContent} glass-card`}>
            <div className={styles.cardHeader}>
              <h3>Confirm Payment Received</h3>
              <button onClick={() => setIsPaidModalOpen(false)} style={{ background: "none", border: "none", cursor: "pointer" }}><X size={20} /></button>
            </div>
            <p style={{ opacity: 0.7, marginBottom: "1.5rem", lineHeight: 1.5 }}>
              Confirm that you have received payment from <strong>{paidPledge.fullName}</strong>. This will mark the pledge as completed and update the public Honour Roll.
            </p>
            {(paidPledge.pledgerEmail || paidPledge.nomineeEmail) && (
              <p style={{ fontSize: "0.875rem", opacity: 0.6, marginBottom: "1.5rem" }}>
                A payment confirmation email will be sent to <strong>{paidPledge.pledgerEmail || paidPledge.nomineeEmail}</strong>.
              </p>
            )}
            <form onSubmit={handleMarkPaidSubmit}>
              <label className={styles.label}>Confirmed Amount Received (R)</label>
              <input
                type="number" required min={1} className={styles.inputField}
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
              />
              <button type="submit" disabled={paidLoading} className="btn-premium btn-accent" style={{ width: "100%", marginTop: "1rem", background: "#166534", borderColor: "#166534" }}>
                {paidLoading ? "Confirming..." : "Confirm Payment & Update Leaderboard"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
