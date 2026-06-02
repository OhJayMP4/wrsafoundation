import Link from "next/link";
import { ArrowRight, UserPlus, Banknote, Award, Share2 } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: <UserPlus size={28} />,
    title: "Make Your Pledge",
    body: "Visit the Pledge page and choose your contribution amount. Fill in your name and email — no payment is made at this stage. You will receive banking details by email.",
  },
  {
    number: "02",
    icon: <Banknote size={28} />,
    title: "Pay by EFT",
    body: "Use the banking details emailed to you to make an EFT payment. Include your unique reference number so we can match your payment. Once received, we will confirm your pledge.",
  },
  {
    number: "03",
    icon: <Award size={28} />,
    title: "Join the Honour Roll",
    body: "Once your payment is confirmed by the WRSA Foundation team, your name appears on the public Honour Roll as a Legacy Champion — visible to the entire industry.",
  },
  {
    number: "04",
    icon: <Share2 size={28} />,
    title: "Nominate the Next Champion",
    body: "After pledging, you have the opportunity to nominate a colleague in the wildlife industry. They will receive an email challenge with a unique link to accept and continue the chain.",
  },
];

export default function HowToPlEdgePage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>

      <div style={{ background: "var(--primary)", color: "white", padding: "5rem 2rem 6rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem", marginBottom: "1rem" }}>The Process</p>
          <h1 style={{ color: "white", fontSize: "clamp(2.2rem,5vw,3.5rem)", marginBottom: "1.5rem" }}>How the Pledge Chain Works</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "580px" }}>
            The Wildlife Pledge Chain is a peer-to-peer commitment mechanism. Each link in the chain is a person in the industry who has pledged their support and nominated the next leader to follow.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "5rem 2rem" }}>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", marginBottom: "5rem" }}>
          {STEPS.map((step, i) => (
            <div key={step.number} style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "0" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "var(--primary)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.1rem" }}>
                  {step.number}
                </div>
                {i < STEPS.length - 1 && <div style={{ width: "2px", height: "40px", background: "var(--border)" }} />}
              </div>
              <div className="glass-card" style={{ flex: 1, padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
                <div style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>{step.icon}</div>
                <div>
                  <h3 style={{ marginBottom: "0.6rem", fontSize: "1.2rem" }}>{step.title}</h3>
                  <p style={{ opacity: 0.65, lineHeight: 1.75, fontSize: "0.95rem" }}>{step.body}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important notes */}
        <div style={{ background: "var(--primary)", borderRadius: "var(--radius-md)", padding: "3rem", color: "white", marginBottom: "3rem" }}>
          <h2 style={{ color: "var(--accent)", marginBottom: "1.5rem", fontSize: "1.5rem" }}>Important to Know</h2>
          <ul style={{ display: "flex", flexDirection: "column", gap: "1rem", paddingLeft: "1.25rem" }}>
            {[
              "No payment is processed online — all payments are made by EFT directly into the WRSA Foundation's bank account.",
              "Your pledge is recorded immediately and appears on the Live Challenge Board while awaiting payment confirmation.",
              "The WRSA Foundation team manually confirms each payment, so please allow 1–2 business days for your Honour Roll status to update.",
              "Nomination is optional — you can pledge without nominating anyone.",
              "The suggested pledge amount is R36,000, but any amount is welcome and appreciated.",
            ].map((note, i) => (
              <li key={i} style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.95rem", lineHeight: 1.7 }}>{note}</li>
            ))}
          </ul>
        </div>

        <div style={{ textAlign: "center" }}>
          <Link href="/donate" className="btn-premium btn-accent">
            I'm Ready to Pledge <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
