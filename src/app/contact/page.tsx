"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    // Send via the email API — reuses the admin-notify pattern
    try {
      await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pledge_admin_notify",
          pledgerName: `${formData.name} (Contact Form)`,
          pledgerEmail: formData.email,
          pledgerMessage: `Subject: ${formData.subject}\n\n${formData.message}`,
          amount: 0,
        }),
      });
    } catch {
      // fail silently — message still shows as submitted
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>
      <div style={{ background: "var(--primary)", color: "white", padding: "5rem 2rem 6rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem", marginBottom: "1rem" }}>Get in Touch</p>
          <h1 style={{ color: "white", fontSize: "clamp(2.2rem,5vw,3.5rem)", marginBottom: "1.25rem" }}>Contact the WRSA Foundation</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.05rem", lineHeight: 1.75, maxWidth: "560px" }}>
            Whether you have a question about the pledge chain, need payment confirmation, or want to discuss a partnership, we're here to help.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "4rem 2rem 6rem", display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "3rem", alignItems: "start" }}>

        {/* Contact details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h2 style={{ fontSize: "1.1rem", marginBottom: "1.25rem" }}>Contact Details</h2>
            {[
              { icon: <Mail size={18} />, label: "Email", value: "info@wrsafoundation.co.za", href: "mailto:info@wrsafoundation.co.za" },
              { icon: <Phone size={18} />, label: "Phone", value: "+27 (0)12 000 0000", href: "tel:+27120000000" },
              { icon: <MapPin size={18} />, label: "Location", value: "Pretoria, South Africa", href: undefined },
            ].map((item) => (
              <div key={item.label} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                <div style={{ color: "var(--accent)", flexShrink: 0, marginTop: "2px" }}>{item.icon}</div>
                <div>
                  <div style={{ fontSize: "0.72rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", opacity: 0.5, marginBottom: "2px" }}>{item.label}</div>
                  {item.href ? (
                    <a href={item.href} style={{ color: "var(--primary)", fontWeight: 600, fontSize: "0.95rem" }}>{item.value}</a>
                  ) : (
                    <span style={{ fontWeight: 600, fontSize: "0.95rem" }}>{item.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="glass-card" style={{ padding: "1.75rem", background: "var(--primary)" }}>
            <h3 style={{ color: "var(--accent)", marginBottom: "0.75rem", fontSize: "1rem" }}>Payment Queries</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.9rem", lineHeight: 1.7 }}>
              If you've made an EFT payment and your Honour Roll status hasn't updated after 2 business days, please email us with your payment reference number and we'll resolve it promptly.
            </p>
          </div>
        </div>

        {/* Contact form */}
        <div className="glass-card" style={{ padding: "2.5rem" }}>
          {submitted ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <CheckCircle2 size={48} color="var(--accent)" style={{ margin: "0 auto 1.25rem" }} />
              <h3 style={{ marginBottom: "0.75rem", fontSize: "1.3rem" }}>Message Sent</h3>
              <p style={{ opacity: 0.65, lineHeight: 1.7 }}>Thank you for reaching out. We'll be in touch within one business day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <h2 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>Send a Message</h2>
              <input
                type="text" required
                placeholder="Your Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{ width: "100%", padding: "1rem 1.25rem", border: "1.5px solid rgba(28,46,36,0.12)", borderRadius: "var(--radius-sm)", fontSize: "1rem", fontFamily: "var(--font-body)", minHeight: "52px" }}
              />
              <input
                type="email" required
                placeholder="Email Address *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{ width: "100%", padding: "1rem 1.25rem", border: "1.5px solid rgba(28,46,36,0.12)", borderRadius: "var(--radius-sm)", fontSize: "1rem", fontFamily: "var(--font-body)", minHeight: "52px" }}
              />
              <input
                type="text"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                style={{ width: "100%", padding: "1rem 1.25rem", border: "1.5px solid rgba(28,46,36,0.12)", borderRadius: "var(--radius-sm)", fontSize: "1rem", fontFamily: "var(--font-body)", minHeight: "52px" }}
              />
              <textarea
                required rows={5}
                placeholder="Your message *"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ width: "100%", padding: "1rem 1.25rem", border: "1.5px solid rgba(28,46,36,0.12)", borderRadius: "var(--radius-sm)", fontSize: "1rem", fontFamily: "var(--font-body)", resize: "vertical" }}
              />
              <button type="submit" disabled={sending} className="btn-premium btn-accent" style={{ width: "100%", marginTop: "0.5rem" }}>
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
