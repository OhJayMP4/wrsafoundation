import Link from "next/link";
import { ArrowRight, Shield, Eye, Leaf, Users } from "lucide-react";

export default function AboutPage() {
  return (
    <div style={{ background: "var(--background)", minHeight: "100vh" }}>

      {/* Hero */}
      <div style={{ background: "var(--primary)", color: "white", padding: "5rem 2rem 6rem" }}>
        <div style={{ maxWidth: "860px", margin: "0 auto" }}>
          <p style={{ color: "var(--accent)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", fontSize: "0.8rem", marginBottom: "1rem" }}>Who We Are</p>
          <h1 style={{ color: "white", fontSize: "clamp(2.2rem,5vw,3.5rem)", marginBottom: "1.5rem", maxWidth: "700px" }}>
            Protecting Southern Africa's Wildlife for Future Generations
          </h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "620px" }}>
            The WRSA Foundation is a non-profit conservation organisation dedicated to preserving biodiversity across Southern Africa through strategic industry partnership, community engagement, and direct field conservation.
          </p>
        </div>
      </div>

      {/* Mission + Values */}
      <div style={{ maxWidth: "860px", margin: "0 auto", padding: "5rem 2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "5rem" }}>
          {[
            { icon: <Shield size={28} />, title: "Conservation First", body: "Every decision we make is measured against one question: does this protect and sustain wildlife? Our fieldwork, partnerships, and funding all serve this singular purpose." },
            { icon: <Eye size={28} />, title: "Transparency", body: "We publish detailed impact reports so donors know exactly where their money goes. From anti-poaching patrols to habitat restoration, every rand is accounted for." },
            { icon: <Leaf size={28} />, title: "Ecological Integrity", body: "We work within ecosystems, not against them. Our programmes are designed by ecologists and vetted by conservation scientists to ensure long-term viability." },
            { icon: <Users size={28} />, title: "Industry Partnership", body: "Southern Africa's wildlife industry is uniquely positioned to lead conservation. We build bridges between game reserves, lodges, and conservation bodies to multiply impact." },
          ].map((card) => (
            <div key={card.title} className="glass-card" style={{ padding: "2.25rem" }}>
              <div style={{ color: "var(--accent)", marginBottom: "1rem" }}>{card.icon}</div>
              <h3 style={{ marginBottom: "0.75rem", fontSize: "1.15rem" }}>{card.title}</h3>
              <p style={{ opacity: 0.65, fontSize: "0.95rem", lineHeight: 1.7 }}>{card.body}</p>
            </div>
          ))}
        </div>

        {/* Our story */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", marginBottom: "5rem" }}>
          <div>
            <h2 style={{ fontSize: "clamp(1.6rem,3vw,2.2rem)", marginBottom: "1.25rem" }}>Our Story</h2>
            <p style={{ opacity: 0.7, lineHeight: 1.85, marginBottom: "1rem" }}>
              The WRSA Foundation was established by a group of wildlife ranching and conservation professionals who recognised that the industry's survival depends on its collective commitment to biodiversity.
            </p>
            <p style={{ opacity: 0.7, lineHeight: 1.85, marginBottom: "1rem" }}>
              South Africa is home to some of the world's most extraordinary wildlife — rhino, elephant, lion, cheetah, and thousands of other species that exist nowhere else on earth. Yet population pressures, habitat loss, and poaching continue to threaten these species at an alarming rate.
            </p>
            <p style={{ opacity: 0.7, lineHeight: 1.85 }}>
              We believe that those who profit from wildlife have a responsibility to protect it. The Wildlife Pledge Chain is our flagship initiative — a peer-to-peer commitment mechanism that turns individual generosity into a collective conservation movement.
            </p>
          </div>
          <div style={{ background: "var(--primary)", borderRadius: "var(--radius-md)", height: "360px", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "0.5rem", color: "rgba(255,255,255,0.4)", fontSize: "0.85rem" }}>
            <Leaf size={48} color="rgba(197,160,89,0.4)" />
            <span>Foundation photography</span>
          </div>
        </div>

        {/* Where the money goes */}
        <div className="glass-card" style={{ padding: "3rem" }}>
          <h2 style={{ fontSize: "clamp(1.6rem,3vw,2rem)", marginBottom: "2rem" }}>Where Your Pledge Goes</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1.5rem" }}>
            {[
              { pct: "40%", label: "Anti-Poaching Operations" },
              { pct: "25%", label: "Habitat Restoration" },
              { pct: "20%", label: "Community Education" },
              { pct: "15%", label: "Research & Monitoring" },
            ].map((item) => (
              <div key={item.label} style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 800, fontFamily: "var(--font-heading)", color: "var(--accent)", marginBottom: "0.5rem" }}>{item.pct}</div>
                <div style={{ opacity: 0.65, fontSize: "0.9rem", lineHeight: 1.5 }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "4rem" }}>
          <Link href="/donate" className="btn-premium btn-accent">
            Make Your Pledge <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}
