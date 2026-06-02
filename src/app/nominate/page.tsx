"use client";

import { useState, Suspense } from "react";
import styles from "../donate/donate.module.css";
import { CheckCircle2, Share2, ArrowRight, Copy, Check } from "lucide-react";
import Link from "next/link";
import NominateModal from "@/components/NominateModal";
import { useApp } from "@/context/AppContext";
import { useSearchParams } from "next/navigation";

function NominateContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [nomineeName, setNomineeName] = useState<string>("");
  const [nomineeEmail, setNomineeEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const { addPledge } = useApp();
  const searchParams = useSearchParams();

  const nominatorName = searchParams.get("nominatorName") || "A fellow conservationist";

  const handleNominateSubmit = async (data: {
    fullName: string;
    organization: string;
    nomineeEmail: string;
    amount: number;
    challengedBy: string;
  }) => {
    const newPledgeId = await addPledge(data);
    const link = `${window.location.origin}/challenge/${newPledgeId}`;
    setGeneratedLink(link);
    setNomineeName(data.fullName);
    setNomineeEmail(data.nomineeEmail);
    setIsModalOpen(false);

    // Send the challenge email to the nominee
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "nominee_challenge",
          nomineeName: data.fullName,
          nomineeEmail: data.nomineeEmail,
          challengedBy: data.challengedBy,
          amount: data.amount,
          challengeLink: link,
        }),
      });
      const result = await res.json();
      setEmailSent(result.success === true);
    } catch {
      setEmailSent(false);
    }
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8faf9", padding: "2rem" }}>
      <div style={{ width: "100%", maxWidth: "600px" }}>

        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ background: "#dcfce7", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem", color: "#166534" }}>
            <CheckCircle2 size={40} />
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 800, marginBottom: "1rem", lineHeight: 1.2 }}>Pledge Committed.</h1>
          <p style={{ opacity: 0.6, fontSize: "1.125rem", maxWidth: "420px", margin: "0 auto" }}>
            Thank you, {nominatorName}. Your commitment has been received and the WRSA team will be in touch to finalise payment.
          </p>
        </div>

        {!generatedLink ? (
          <div className={styles.formCard} style={{ padding: "3rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Continue The Chain?</h2>
            <p style={{ opacity: 0.6, marginBottom: "2.5rem", lineHeight: 1.6 }}>
              A true movement relies on peer-to-peer accountability. Nominate a colleague in the wildlife industry to match your commitment — they will receive an email invitation directly.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn-premium btn-accent"
                style={{ padding: "1.25rem", fontSize: "1.125rem" }}
              >
                Nominate Someone <Share2 size={20} className="ml-2" />
              </button>

              <Link href="/leaderboard" className="btn-premium btn-primary" style={{ border: "1px solid var(--glass-border)", padding: "1.25rem", fontSize: "1.125rem" }}>
                End Here & View Board
              </Link>
            </div>
          </div>
        ) : (
          <div className={`${styles.formCard} animate-fade-in`} style={{ padding: "3rem", textAlign: "center" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>Nomination Sent!</h2>

            {emailSent ? (
              <p style={{ opacity: 0.6, marginBottom: "2rem", lineHeight: 1.6 }}>
                An email invitation has been dispatched to <strong>{nomineeEmail}</strong>. {nomineeName.split(" ")[0]} now has 7 days to accept the challenge.
              </p>
            ) : (
              <p style={{ opacity: 0.6, marginBottom: "2rem", lineHeight: 1.6 }}>
                {nomineeName.split(" ")[0]}'s unique challenge link has been generated. Share it with them directly — they have 7 days to accept.
              </p>
            )}

            <div style={{ background: "#fcfcfb", border: "1px solid var(--glass-border)", padding: "1.25rem", borderRadius: "8px", wordBreak: "break-all", marginBottom: "1rem", textAlign: "left" }}>
              <code style={{ color: "var(--accent)", fontWeight: 700, fontSize: "0.85rem" }}>{generatedLink}</code>
            </div>

            <button
              onClick={handleCopy}
              style={{ display: "flex", alignItems: "center", gap: "8px", margin: "0 auto 2rem", background: "none", border: "1px solid var(--glass-border)", padding: "0.5rem 1.25rem", borderRadius: "999px", cursor: "pointer", fontSize: "0.875rem", fontWeight: 600, color: copied ? "#166534" : "var(--primary)" }}
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied!" : "Copy Link"}
            </button>

            <Link href="/leaderboard" className="btn-premium btn-primary" style={{ border: "1px solid var(--glass-border)", padding: "1.25rem" }}>
              Go to Leaderboard <ArrowRight size={20} className="ml-2" />
            </Link>
          </div>
        )}

        <NominateModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleNominateSubmit}
          nominatorName={nominatorName}
        />

      </div>
    </div>
  );
}

export default function NominatePage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>Loading...</div>}>
      <NominateContent />
    </Suspense>
  );
}
