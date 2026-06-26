"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronUp } from "lucide-react";
import PageHero from "@/components/PageHero";

const FAQS = [
  {
    q: "What is the difference between a Pledge and Monthly Support?",
    a: "A Pledge is a once-off commitment — you choose an amount, pay it via EFT, and your name appears on the Honour Roll. You can also nominate someone else to continue the chain. Monthly Support is a recurring debit order — you create a supporter account, set up a monthly amount (or custom figure) and a commitment period of 6 to 12 months, and your contribution is debited from your account automatically each month on a date you choose. Pledges are ideal for a one-time impact and growing the chain through nominations; Monthly Support is for those who want to provide sustained, predictable funding over time.",
  },
  {
    q: "Do I need to create an account to set up a monthly debit order?",
    a: "Yes. Monthly Support requires a free supporter account so you can securely manage your debit order details and check its status at any time. Pledges do not require an account — they're a single form submission.",
  },
  {
    q: "Can I cancel my monthly debit order before the commitment period ends?",
    a: "Monthly Support requires a minimum commitment of 6 months, up to a maximum of 12. If your circumstances change, please contact us directly — we're happy to discuss adjusting or pausing your debit order.",
  },
  {
    q: "Is there a minimum pledge amount?",
    a: "There is no formal minimum. Any amount is genuinely welcome and appreciated — what matters most is your commitment to conservation.",
  },
  {
    q: "How do I make payment after pledging?",
    a: "Once you submit your pledge, you will receive an email containing our banking details and your unique payment reference number. Simply make an EFT into the WRSA Foundation's bank account using that reference. Do not pay via the website — all payments are made directly by bank transfer.",
  },
  {
    q: "How long does it take for my name to appear on the Honour Roll?",
    a: "Once we receive and confirm your EFT payment, our team will update your pledge status manually. This typically takes 1–2 business days. You will receive a confirmation email once your name is live on the Honour Roll.",
  },
  {
    q: "Do I have to nominate someone?",
    a: "Nominating the next person is entirely optional. The chain grows through nominations, but if you would prefer to pledge without nominating anyone, that is completely fine. Your contribution is equally valued.",
  },
  {
    q: "What happens if I nominate someone and they don't accept?",
    a: "If a nominated person declines the challenge, their status will be shown as 'Declined' on the Live Challenge Board temporarily. It does not affect your own pledge or Honour Roll status in any way.",
  },
  {
    q: "Is my donation tax-deductible?",
    a: "The WRSA Foundation is a registered non-profit organisation. Please contact us directly for our Section 18A certificate details, which may allow you to claim a tax deduction on your contribution.",
  },
  {
    q: "Can I make an anonymous pledge?",
    a: "Yes. If you would prefer not to appear publicly on the Honour Roll, please note this in the message field when submitting your pledge and we will honour that request.",
  },
  {
    q: "What is the money used for?",
    a: "Funds are allocated across anti-poaching operations (40%), habitat restoration (25%), community education programmes (20%), and research and wildlife monitoring (15%). We publish detailed annual impact reports.",
  },
  {
    q: "I received a nomination email — what do I do?",
    a: "Click the link in the email to view your challenge. You will have the option to accept or decline. If you accept, follow the steps on screen to commit your pledge and receive banking details. You have 7 days from the date of nomination to respond.",
  },
  {
    q: "How do I contact the WRSA Foundation directly?",
    a: "Visit our Contact page or email us. Our team is based in South Africa and will typically respond within one business day.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderBottom: "1px solid rgba(28,46,36,0.08)" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "1.5rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem", textAlign: "left" }}
      >
        <span style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1.05rem", color: "var(--primary)", lineHeight: 1.4 }}>{q}</span>
        <span style={{ color: "var(--accent)", flexShrink: 0 }}>{open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}</span>
      </button>
      {open && (
        <div style={{ paddingBottom: "1.5rem" }}>
          <p style={{ opacity: 0.7, lineHeight: 1.8, fontSize: "0.95rem" }}>{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <PageHero image="/faq-hero.jpg">
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "5rem 2rem 6rem", color: "white" }}>
          <p style={{ color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem", marginBottom: "1rem" }}>Questions & Answers</p>
          <h1 style={{ color: "white", fontSize: "clamp(2.2rem,5vw,3.5rem)", marginBottom: "1.25rem" }}>Frequently Asked Questions</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", lineHeight: 1.75 }}>
            Everything you need to know about the Wildlife Pledge Chain and how your contribution makes a difference.
          </p>
        </div>
      </PageHero>

      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "4rem 2rem 6rem" }}>
        <div className="glass-card" style={{ padding: "1rem 2.5rem" }}>
          {FAQS.map((faq) => <FAQItem key={faq.q} q={faq.q} a={faq.a} />)}
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <p style={{ opacity: 0.6, marginBottom: "1.5rem" }}>Still have a question we haven't answered?</p>
          <Link href="/contact" className="btn-premium btn-primary">Get in Touch</Link>
        </div>
      </div>
    </div>
  );
}
