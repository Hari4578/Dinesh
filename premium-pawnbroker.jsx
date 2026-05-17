import { useState, useEffect, useRef } from "react";

// ─── Color Tokens ──────────────────────────────────────────────────────────
const G = {
  gold: "#D4AF37",
  goldLight: "#FFD700",
  goldDim: "#A8892A",
  goldGlow: "rgba(212,175,55,0.18)",
  black: "#000000",
  dark: "#0A0A0A",
  panel: "#111111",
  panelHover: "#181818",
  border: "rgba(212,175,55,0.22)",
  borderHover: "rgba(212,175,55,0.5)",
  text: "#F5F0E8",
  muted: "#9A9080",
  danger: "#E05050",
  success: "#50C878",
};

// ─── Styles ────────────────────────────────────────────────────────────────
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Montserrat:wght@300;400;500;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; color: #F5F0E8; font-family: 'Montserrat', sans-serif; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #0A0A0A; }
  ::-webkit-scrollbar-thumb { background: #D4AF37; border-radius: 2px; }
  @keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:.6} }
  @keyframes fadeIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(212,175,55,0.4)} 50%{box-shadow:0 0 20px 4px rgba(212,175,55,0.15)} }
  @keyframes countUp { from{opacity:0} to{opacity:1} }
  @keyframes spin { to{transform:rotate(360deg)} }
  @keyframes slideIn { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
`;

// ─── Reusable Components ───────────────────────────────────────────────────
const GoldBtn = ({ children, onClick, outline, small, style = {} }) => (
  <button onClick={onClick} style={{
    background: outline ? "transparent" : `linear-gradient(135deg, ${G.gold}, ${G.goldLight})`,
    color: outline ? G.gold : "#000",
    border: `1.5px solid ${G.gold}`,
    borderRadius: 2,
    padding: small ? "7px 18px" : "12px 28px",
    fontSize: small ? 12 : 13,
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    cursor: "pointer",
    transition: "all 0.2s",
    animation: outline ? "" : "pulse 3s infinite",
    ...style,
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = `0 6px 24px ${G.goldGlow}`; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
  >{children}</button>
);

const GoldCard = ({ children, style = {}, onClick }) => (
  <div onClick={onClick} style={{
    background: "rgba(17,17,17,0.9)",
    border: `1px solid ${G.border}`,
    borderRadius: 4,
    padding: "24px",
    backdropFilter: "blur(12px)",
    transition: "all 0.25s",
    cursor: onClick ? "pointer" : "default",
    ...style,
  }}
    onMouseEnter={onClick ? e => { e.currentTarget.style.borderColor = G.borderHover; e.currentTarget.style.background = "rgba(26,22,14,0.95)"; } : undefined}
    onMouseLeave={onClick ? e => { e.currentTarget.style.borderColor = G.border; e.currentTarget.style.background = "rgba(17,17,17,0.9)"; } : undefined}
  >{children}</div>
);

const SectionTitle = ({ children, sub }) => (
  <div style={{ textAlign: "center", marginBottom: 48 }}>
    <div style={{ fontSize: 11, letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase", fontWeight: 500, marginBottom: 12 }}>— {sub} —</div>
    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 42, fontWeight: 300, color: G.text, lineHeight: 1.1 }}>{children}</h2>
    <div style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${G.gold}, transparent)`, margin: "16px auto 0" }} />
  </div>
);

const Input = ({ label, value, onChange, type = "text", placeholder }) => (
  <div style={{ marginBottom: 16 }}>
    <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", color: G.gold, textTransform: "uppercase", marginBottom: 6, fontWeight: 500 }}>{label}</label>
    <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
      style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}`, borderRadius: 2, padding: "10px 14px", color: G.text, fontSize: 13, fontFamily: "'Montserrat', sans-serif", outline: "none" }}
      onFocus={e => e.target.style.borderColor = G.gold}
      onBlur={e => e.target.style.borderColor = G.border}
    />
  </div>
);

const Stat = ({ label, value, prefix = "" }) => {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const target = parseInt(value.replace(/\D/g, ""));
    const step = Math.ceil(target / 60);
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setDisplay(current);
      if (current >= target) clearInterval(timer);
    }, 30);
    return () => clearInterval(timer);
  }, [value]);
  return (
    <GoldCard style={{ textAlign: "center", padding: "28px 20px" }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 46, fontWeight: 300, color: G.gold }}>{prefix}{display.toLocaleString()}+</div>
      <div style={{ fontSize: 11, letterSpacing: "0.15em", color: G.muted, textTransform: "uppercase", marginTop: 6 }}>{label}</div>
    </GoldCard>
  );
};

// ─── Data ──────────────────────────────────────────────────────────────────
const INITIAL_RECORDS = [
  { id: "PB001", name: "Arjun Sharma", phone: "9876543210", item: "Gold Necklace 22K", weight: "25g", value: 125000, date: "2024-01-15", rate: 2, status: "active", paid: 0 },
  { id: "PB002", name: "Priya Mehta", phone: "9123456780", item: "Diamond Ring", weight: "5g", value: 85000, date: "2023-11-20", rate: 2.5, status: "overdue", paid: 4250 },
  { id: "PB003", name: "Ramesh Kumar", phone: "9988776655", item: "Gold Bangles x4", weight: "60g", value: 310000, date: "2024-02-10", rate: 2, status: "active", paid: 0 },
  { id: "PB004", name: "Sunita Patel", phone: "9012345678", item: "Silver Anklets", weight: "120g", value: 18000, date: "2024-03-01", rate: 2, status: "redeemed", paid: 18000 },
  { id: "PB005", name: "Vijay Nair", phone: "9345678901", item: "Gold Chain 18K", weight: "18g", value: 72000, date: "2024-02-28", rate: 2, status: "active", paid: 0 },
];

// ─── Pages ─────────────────────────────────────────────────────────────────

// HOME
const Home = ({ setPage }) => (
  <div>
    {/* Hero */}
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "0 24px", textAlign: "center" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,175,55,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", top: "12%", left: "8%", width: 300, height: 300, borderRadius: "50%", border: `1px solid ${G.border}`, opacity: 0.3, animation: "pulse 6s infinite" }} />
      <div style={{ position: "absolute", bottom: "15%", right: "5%", width: 200, height: 200, borderRadius: "50%", border: `1px solid ${G.border}`, opacity: 0.2, animation: "pulse 8s infinite 2s" }} />

      <div style={{ fontSize: 11, letterSpacing: "0.35em", color: G.gold, textTransform: "uppercase", marginBottom: 20, animation: "fadeIn 0.8s ease" }}>Est. 1987 · Bengaluru</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 7vw, 80px)", fontWeight: 300, lineHeight: 1.08, color: G.text, marginBottom: 24, animation: "fadeIn 1s ease 0.2s both", maxWidth: 800 }}>
        Trusted Gold &<br /><span style={{ color: G.gold }}>Asset Pawn</span> Services
      </h1>
      <p style={{ fontSize: 15, color: G.muted, maxWidth: 560, lineHeight: 1.8, marginBottom: 36, animation: "fadeIn 1s ease 0.4s both" }}>Instant liquidity against your valuable assets. Transparent valuations, competitive rates, and complete discretion guaranteed.</p>
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", animation: "fadeIn 1s ease 0.6s both" }}>
        <GoldBtn onClick={() => setPage("calculator")}>Get Instant Loan</GoldBtn>
        <GoldBtn outline onClick={() => setPage("services")}>Check Pawn Value</GoldBtn>
      </div>
      <div style={{ position: "absolute", bottom: 32, left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, opacity: 0.4 }}>
        <div style={{ width: 1, height: 40, background: G.gold }} />
        <span style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: G.gold }}>Scroll</span>
      </div>
    </div>

    {/* Stats */}
    <div style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20 }}>
        <Stat label="Happy Customers" value="12500" />
        <Stat label="Crores Disbursed" value="850" prefix="₹" />
        <Stat label="Years of Trust" value="37" />
        <Stat label="Daily Transactions" value="200" />
      </div>
    </div>

    {/* Services Preview */}
    <div style={{ padding: "80px 40px", maxWidth: 1100, margin: "0 auto" }}>
      <SectionTitle sub="What We Offer">Our Premium Services</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
        {[
          { icon: "💍", title: "Gold & Jewellery Loans", desc: "Immediate loans against 18K–24K gold, diamonds, and certified gemstone jewellery at best market rates." },
          { icon: "⌚", title: "Luxury Asset Pawn", desc: "Premium watches, branded handbags, fine art, and collectibles evaluated by certified experts." },
          { icon: "📱", title: "Electronics & Gadgets", desc: "Smartphones, laptops, cameras, and professional equipment with fair market valuations." },
          { icon: "🏆", title: "Silver & Precious Metals", desc: "Silver bars, coins, and antique silverware accepted with full transparency on current spot rates." },
          { icon: "💎", title: "Diamond Valuation", desc: "GIA-certified diamond graders assess your stones for accurate, competitive loan offers." },
          { icon: "🔐", title: "Secure Storage", desc: "Bank-grade vault storage for your assets with full insurance coverage throughout the loan period." },
        ].map(s => (
          <GoldCard key={s.title} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ fontSize: 32 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: G.text }}>{s.title}</div>
            <div style={{ fontSize: 13, color: G.muted, lineHeight: 1.7 }}>{s.desc}</div>
            <div style={{ marginTop: "auto", paddingTop: 12 }}>
              <span style={{ fontSize: 11, color: G.gold, letterSpacing: "0.1em", cursor: "pointer" }} onClick={() => setPage("services")}>LEARN MORE →</span>
            </div>
          </GoldCard>
        ))}
      </div>
    </div>

    {/* Testimonials */}
    <div style={{ padding: "80px 40px", background: "rgba(212,175,55,0.04)", borderTop: `1px solid ${G.border}`, borderBottom: `1px solid ${G.border}` }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <SectionTitle sub="Client Voices">What Our Clients Say</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {[
            { quote: "Got ₹3 lakhs within 45 minutes against my gold chain. Zero hassle, full transparency.", name: "Arjun S.", city: "Bengaluru" },
            { quote: "Best rates in the city. They explained everything clearly and returned my items perfectly.", name: "Priya M.", city: "Mysuru" },
            { quote: "Trusted them with my late mother's jewellery. Professional, respectful, and fair.", name: "Ramesh K.", city: "Bengaluru" },
          ].map(t => (
            <GoldCard key={t.name}>
              <div style={{ fontSize: 32, color: G.gold, fontFamily: "serif", lineHeight: 1, marginBottom: 12 }}>"</div>
              <p style={{ fontSize: 14, color: G.text, lineHeight: 1.8, marginBottom: 16 }}>{t.quote}</p>
              <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: G.gold }}>{t.name}</div>
                <div style={{ fontSize: 11, color: G.muted }}>{t.city}</div>
              </div>
            </GoldCard>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// ABOUT
const About = () => (
  <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 40px" }}>
    <SectionTitle sub="Our Story">Legacy of Trust Since 1987</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center", marginBottom: 60 }}>
      <div>
        <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.9, marginBottom: 16 }}>Founded in the heart of Bengaluru, Premium Pawn Brokers has served generations of families with unmatched integrity and expertise in gold and asset valuation.</p>
        <p style={{ fontSize: 15, color: G.muted, lineHeight: 1.9 }}>Our team of certified appraisers brings decades of combined experience across gold, diamonds, luxury watches, and precious metals. Every transaction is handled with the discretion and respect it deserves.</p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {[["Licensed & Regulated", "RBI-compliant pawn broker with all required certifications"], ["Certified Appraisers", "GIA, BIS, and hallmarking expertise on staff"], ["Secure Vault Storage", "ISO-certified vault with 24/7 CCTV monitoring"], ["Transparent Pricing", "Live gold rate pricing with no hidden fees"]].map(([t, d]) => (
          <div key={t} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
            <div style={{ width: 6, height: 6, background: G.gold, borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: G.text, marginBottom: 2 }}>{t}</div>
              <div style={{ fontSize: 12, color: G.muted }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
      {[["37+", "Years of Service"], ["5", "Expert Appraisers"], ["₹850Cr+", "Disbursed"]].map(([v, l]) => (
        <GoldCard key={l} style={{ textAlign: "center", padding: "32px 20px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: G.gold }}>{v}</div>
          <div style={{ fontSize: 11, letterSpacing: "0.15em", color: G.muted, textTransform: "uppercase", marginTop: 6 }}>{l}</div>
        </GoldCard>
      ))}
    </div>
  </div>
);

// SERVICES
const Services = ({ setPage }) => (
  <div style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 40px" }}>
    <SectionTitle sub="Pawn Services">What We Accept</SectionTitle>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28 }}>
      {[
        { icon: "🥇", cat: "Gold Jewellery", items: ["Necklaces, chains, bangles", "Rings, earrings, anklets", "18K, 22K, 24K gold", "BIS hallmarked preferred"], rate: "Up to 75% of market value" },
        { icon: "💎", cat: "Diamonds & Gems", items: ["GIA/IGI certified diamonds", "Precious gemstones", "Diamond-studded jewellery", "Loose diamonds accepted"], rate: "Up to 60% of appraised value" },
        { icon: "⌚", cat: "Luxury Watches", items: ["Rolex, Omega, Patek Philippe", "All major luxury brands", "Working condition required", "Box & papers increase value"], rate: "Up to 70% of market value" },
        { icon: "🥈", cat: "Silver Articles", items: ["Coins, bars, antiques", "Silverware & cutlery", "Pure silver 925+", "Decorative items"], rate: "Up to 65% of market value" },
        { icon: "💻", cat: "Electronics", items: ["iPhones, MacBooks, iPads", "Professional cameras", "Gaming consoles", "Max 2 years old"], rate: "Up to 50% of market value" },
        { icon: "🎨", cat: "Art & Collectibles", items: ["Authenticated artworks", "Rare coins & stamps", "Antique furniture", "Subject to appraisal"], rate: "Case-by-case basis" },
      ].map(s => (
        <GoldCard key={s.cat}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: G.text, marginBottom: 12 }}>{s.cat}</h3>
          <ul style={{ listStyle: "none", marginBottom: 16 }}>
            {s.items.map(i => <li key={i} style={{ fontSize: 12, color: G.muted, padding: "4px 0", borderBottom: `1px solid rgba(212,175,55,0.08)`, display: "flex", gap: 8 }}><span style={{ color: G.gold }}>›</span>{i}</li>)}
          </ul>
          <div style={{ background: "rgba(212,175,55,0.08)", border: `1px solid ${G.border}`, borderRadius: 2, padding: "8px 12px", fontSize: 12, color: G.gold, textAlign: "center" }}>{s.rate}</div>
        </GoldCard>
      ))}
    </div>
    <div style={{ textAlign: "center", marginTop: 48 }}>
      <GoldBtn onClick={() => setPage("calculator")}>Calculate Your Loan Amount</GoldBtn>
    </div>
  </div>
);

// CALCULATOR
const Calculator = () => {
  const [principal, setPrincipal] = useState("100000");
  const [rate, setRate] = useState("2");
  const [months, setMonths] = useState("6");

  const P = parseFloat(principal) || 0;
  const R = parseFloat(rate) || 0;
  const T = parseFloat(months) || 0;
  const interest = (P * R * T) / 100;
  const total = P + interest;
  const monthly = T > 0 ? total / T : 0;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "80px 40px" }}>
      <SectionTitle sub="Loan Tools">Gold Loan Calculator</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <GoldCard>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: G.gold, marginBottom: 24 }}>Loan Parameters</h3>
          <Input label="Principal Amount (₹)" value={principal} onChange={setPrincipal} type="number" placeholder="e.g. 100000" />
          <Input label="Monthly Interest Rate (%)" value={rate} onChange={setRate} type="number" placeholder="e.g. 2" />
          <Input label="Loan Duration (Months)" value={months} onChange={setMonths} type="number" placeholder="e.g. 6" />
          <div style={{ marginTop: 8, padding: "10px 14px", background: "rgba(212,175,55,0.06)", border: `1px solid ${G.border}`, borderRadius: 2, fontSize: 12, color: G.muted, lineHeight: 1.7 }}>
            Formula: Interest = P × R × T / 100<br />
            Total = Principal + Interest
          </div>
        </GoldCard>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { label: "Principal Amount", value: `₹${P.toLocaleString("en-IN")}`, color: G.text },
            { label: "Total Interest", value: `₹${interest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, color: G.gold },
            { label: "Total Payable", value: `₹${total.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, color: G.goldLight },
            { label: "Monthly Installment", value: `₹${monthly.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, color: G.text },
          ].map(r => (
            <GoldCard key={r.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 24px" }}>
              <span style={{ fontSize: 12, color: G.muted, letterSpacing: "0.05em", textTransform: "uppercase" }}>{r.label}</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: r.color }}>{r.value}</span>
            </GoldCard>
          ))}

          <GoldCard style={{ padding: "20px 24px" }}>
            <div style={{ fontSize: 12, color: G.muted, marginBottom: 8 }}>Loan Breakdown</div>
            <div style={{ display: "flex", height: 16, borderRadius: 2, overflow: "hidden", marginBottom: 8 }}>
              <div style={{ flex: P, background: G.gold }} />
              <div style={{ flex: interest, background: "rgba(212,175,55,0.3)" }} />
            </div>
            <div style={{ display: "flex", gap: 16, fontSize: 11 }}>
              <span style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ width: 10, height: 10, background: G.gold, display: "inline-block" }} />Principal</span>
              <span style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ width: 10, height: 10, background: "rgba(212,175,55,0.3)", display: "inline-block" }} />Interest</span>
            </div>
          </GoldCard>
        </div>
      </div>

      {/* EMI Table */}
      <GoldCard style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: G.gold, marginBottom: 20 }}>Monthly Repayment Schedule</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${G.border}` }}>
                {["Month", "Opening Balance", "Interest", "Payment", "Closing Balance"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", fontSize: 11, letterSpacing: "0.08em", color: G.gold, textTransform: "uppercase", fontWeight: 500 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: Math.min(T, 12) }, (_, i) => {
                const open = P;
                const monthInt = (P * R) / 100;
                const payment = T > 0 ? total / T : 0;
                return (
                  <tr key={i} style={{ borderBottom: `1px solid rgba(212,175,55,0.06)` }}>
                    <td style={{ padding: "10px 14px", color: G.gold }}>{i + 1}</td>
                    <td style={{ padding: "10px 14px", color: G.muted }}>₹{open.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "10px 14px", color: G.text }}>₹{monthInt.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: "10px 14px", color: G.success }}>₹{payment.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: "10px 14px", color: G.muted }}>₹{i + 1 < T ? open.toLocaleString("en-IN") : "0"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GoldCard>
    </div>
  );
};

// RECORDS
const Records = ({ records, setRecords }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", item: "", weight: "", value: "", rate: "2", date: new Date().toISOString().split("T")[0] });

  const today = new Date();
  const filtered = records.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase()) || r.item.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || r.status === filter;
    return matchSearch && matchFilter;
  });

  const getDuration = (dateStr) => {
    const pawnDate = new Date(dateStr);
    const diff = today - pawnDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const months = Math.floor(days / 30);
    return { days, months, years: Math.floor(months / 12) };
  };

  const calcInterest = (r) => {
    const { months } = getDuration(r.date);
    return (r.value * r.rate * Math.max(months, 1)) / 100;
  };

  const addRecord = () => {
    const newRec = { ...form, id: `PB${String(records.length + 1).padStart(3, "0")}`, value: parseFloat(form.value), rate: parseFloat(form.rate), status: "active", paid: 0 };
    setRecords([...records, newRec]);
    setForm({ name: "", phone: "", item: "", weight: "", value: "", rate: "2", date: new Date().toISOString().split("T")[0] });
    setShowAdd(false);
  };

  const statusColor = { active: G.gold, overdue: G.danger, redeemed: G.success };

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase", marginBottom: 8 }}>Management System</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: G.text }}>Customer Records</h2>
        </div>
        <GoldBtn small onClick={() => setShowAdd(true)}>+ New Record</GoldBtn>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, ID, or item…"
          style={{ flex: 1, minWidth: 200, background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}`, borderRadius: 2, padding: "10px 16px", color: G.text, fontSize: 13, fontFamily: "'Montserrat', sans-serif", outline: "none" }} />
        <div style={{ display: "flex", gap: 8 }}>
          {["all", "active", "overdue", "redeemed"].map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: "8px 16px", background: filter === s ? G.gold : "transparent", color: filter === s ? "#000" : G.muted, border: `1px solid ${filter === s ? G.gold : G.border}`, borderRadius: 2, fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Montserrat', sans-serif", fontWeight: 600 }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "Total Loans", value: records.length },
          { label: "Active", value: records.filter(r => r.status === "active").length, color: G.gold },
          { label: "Overdue", value: records.filter(r => r.status === "overdue").length, color: G.danger },
          { label: "Redeemed", value: records.filter(r => r.status === "redeemed").length, color: G.success },
        ].map(s => (
          <GoldCard key={s.label} style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: 28, fontFamily: "'Cormorant Garamond', serif", color: s.color || G.text }}>{s.value}</div>
            <div style={{ fontSize: 11, color: G.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 4 }}>{s.label}</div>
          </GoldCard>
        ))}
      </div>

      {/* Table */}
      <GoldCard style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(212,175,55,0.06)", borderBottom: `1px solid ${G.border}` }}>
                {["ID", "Customer", "Item", "Value", "Duration", "Interest", "Total Due", "Status", "Actions"].map(h => (
                  <th key={h} style={{ padding: "14px 16px", textAlign: "left", fontSize: 10, letterSpacing: "0.12em", color: G.gold, textTransform: "uppercase", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => {
                const dur = getDuration(r.date);
                const interest = calcInterest(r);
                const totalDue = r.value + interest - r.paid;
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid rgba(212,175,55,0.06)`, cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(212,175,55,0.04)"}
                    onMouseLeave={e => e.currentTarget.style.background = ""}
                    onClick={() => setSelected(r)}>
                    <td style={{ padding: "14px 16px", color: G.gold, fontWeight: 600, fontFamily: "monospace" }}>{r.id}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: G.text, fontWeight: 500 }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: G.muted }}>📞 {r.phone}</div>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <div style={{ color: G.text }}>{r.item}</div>
                      <div style={{ fontSize: 11, color: G.muted }}>{r.weight}</div>
                    </td>
                    <td style={{ padding: "14px 16px", color: G.text }}>₹{r.value.toLocaleString("en-IN")}</td>
                    <td style={{ padding: "14px 16px", color: G.muted }}>{dur.months}m {dur.days % 30}d</td>
                    <td style={{ padding: "14px 16px", color: G.gold }}>₹{interest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: "14px 16px", color: r.status === "redeemed" ? G.success : G.goldLight, fontWeight: 600 }}>₹{Math.max(0, totalDue).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: statusColor[r.status], border: `1px solid ${statusColor[r.status]}`, borderRadius: 2, padding: "3px 8px", fontWeight: 600 }}>{r.status}</span>
                    </td>
                    <td style={{ padding: "14px 16px" }}>
                      <span style={{ fontSize: 10, color: G.gold, cursor: "pointer", letterSpacing: "0.05em" }}>VIEW →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: "center", color: G.muted }}>No records found.</div>}
        </div>
      </GoldCard>

      {/* Add Record Modal */}
      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }}>
          <GoldCard style={{ width: "100%", maxWidth: 560, animation: "fadeIn 0.3s ease" }}>
            <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: G.gold, marginBottom: 24 }}>New Pawn Record</h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
              <Input label="Customer Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
              <Input label="Phone Number" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
              <div style={{ gridColumn: "1 / -1" }}>
                <Input label="Item Description" value={form.item} onChange={v => setForm({ ...form, item: v })} />
              </div>
              <Input label="Weight / Quantity" value={form.weight} onChange={v => setForm({ ...form, weight: v })} />
              <Input label="Pawn Value (₹)" value={form.value} onChange={v => setForm({ ...form, value: v })} type="number" />
              <Input label="Monthly Rate (%)" value={form.rate} onChange={v => setForm({ ...form, rate: v })} type="number" />
              <Input label="Pawn Date" value={form.date} onChange={v => setForm({ ...form, date: v })} type="date" />
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <GoldBtn onClick={addRecord} style={{ flex: 1 }}>Save Record</GoldBtn>
              <GoldBtn outline onClick={() => setShowAdd(false)} style={{ flex: 1 }}>Cancel</GoldBtn>
            </div>
          </GoldCard>
        </div>
      )}

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.9)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 24 }} onClick={() => setSelected(null)}>
          <GoldCard style={{ width: "100%", maxWidth: 520, animation: "fadeIn 0.3s ease" }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
              <div>
                <div style={{ fontSize: 11, letterSpacing: "0.2em", color: G.gold, marginBottom: 4 }}>PAWN RECEIPT · {selected.id}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, color: G.text }}>{selected.name}</h3>
              </div>
              <span onClick={() => setSelected(null)} style={{ cursor: "pointer", fontSize: 20, color: G.muted, lineHeight: 1 }}>✕</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 0", fontSize: 13, marginBottom: 20 }}>
              {[
                ["Item", selected.item],
                ["Weight", selected.weight],
                ["Phone", selected.phone],
                ["Pawn Date", selected.date],
                ["Principal", `₹${selected.value.toLocaleString("en-IN")}`],
                ["Rate", `${selected.rate}% / month`],
                ["Duration", `${getDuration(selected.date).months} months`],
                ["Interest", `₹${calcInterest(selected).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`],
              ].map(([l, v]) => (
                <div key={l} style={{ borderBottom: `1px solid rgba(212,175,55,0.08)`, padding: "8px 0" }}>
                  <div style={{ fontSize: 10, color: G.muted, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 2 }}>{l}</div>
                  <div style={{ color: G.text }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(212,175,55,0.08)", border: `1px solid ${G.border}`, borderRadius: 2, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontSize: 12, color: G.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>Total Redemption Amount</span>
              <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 32, color: G.gold }}>
                ₹{(selected.value + calcInterest(selected) - selected.paid).toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <GoldBtn small style={{ flex: 1 }} onClick={() => { setRecords(records.map(r => r.id === selected.id ? { ...r, status: "redeemed", paid: r.value } : r)); setSelected(null); }}>Mark Redeemed</GoldBtn>
              <GoldBtn small outline style={{ flex: 1 }} onClick={() => setSelected(null)}>Close</GoldBtn>
            </div>
          </GoldCard>
        </div>
      )}
    </div>
  );

  function getDuration(dateStr) {
    const pawnDate = new Date(dateStr);
    const diff = today - pawnDate;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return { days, months: Math.floor(days / 30) };
  }
  function calcInterest(r) {
    const { months } = getDuration(r.date);
    return (r.value * r.rate * Math.max(months, 1)) / 100;
  }
};

// ADMIN DASHBOARD
const Dashboard = ({ records }) => {
  const today = new Date();
  const getDuration = (dateStr) => {
    const diff = today - new Date(dateStr);
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  };
  const calcInterest = (r) => (r.value * r.rate * Math.max(getDuration(r.date), 1)) / 100;
  const totalPrincipal = records.reduce((s, r) => s + (r.status !== "redeemed" ? r.value : 0), 0);
  const totalInterest = records.reduce((s, r) => s + (r.status !== "redeemed" ? calcInterest(r) : 0), 0);
  const overdueCount = records.filter(r => r.status === "overdue").length;
  const activeCount = records.filter(r => r.status === "active").length;

  const barMax = Math.max(...records.map(r => r.value));

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 40px" }}>
      <div style={{ marginBottom: 40 }}>
        <div style={{ fontSize: 11, letterSpacing: "0.3em", color: G.gold, textTransform: "uppercase", marginBottom: 8 }}>Admin Panel</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 36, fontWeight: 300, color: G.text }}>Business Dashboard</h2>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        {[
          { label: "Total Capital Out", value: `₹${totalPrincipal.toLocaleString("en-IN")}`, trend: "+8%" },
          { label: "Accrued Interest", value: `₹${totalInterest.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`, trend: "+12%" },
          { label: "Active Loans", value: activeCount, trend: "" },
          { label: "Overdue Alerts", value: overdueCount, color: overdueCount > 0 ? G.danger : G.success, trend: "" },
        ].map(k => (
          <GoldCard key={k.label} style={{ padding: "20px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.1em" }}>{k.label}</span>
              {k.trend && <span style={{ fontSize: 10, color: G.success, background: "rgba(80,200,120,0.1)", padding: "2px 6px", borderRadius: 2 }}>{k.trend}</span>}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, color: k.color || G.gold }}>{k.value}</div>
          </GoldCard>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        {/* Loan Value Chart */}
        <GoldCard>
          <h3 style={{ fontSize: 14, color: G.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Loan Portfolio Overview</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {records.filter(r => r.status !== "redeemed").map(r => {
              const pct = (r.value / barMax) * 100;
              const interest = calcInterest(r);
              return (
                <div key={r.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4, fontSize: 12 }}>
                    <span style={{ color: G.text }}>{r.name} <span style={{ color: G.muted, fontSize: 11 }}>· {r.item}</span></span>
                    <span style={{ color: G.gold }}>₹{r.value.toLocaleString("en-IN")}</span>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: r.status === "overdue" ? G.danger : `linear-gradient(90deg, ${G.gold}, ${G.goldLight})`, borderRadius: 3 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GoldCard>

        {/* Status Breakdown */}
        <GoldCard>
          <h3 style={{ fontSize: 14, color: G.gold, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 20 }}>Loan Status</h3>
          {[
            { label: "Active", count: activeCount, color: G.gold, total: records.length },
            { label: "Overdue", count: overdueCount, color: G.danger, total: records.length },
            { label: "Redeemed", count: records.filter(r => r.status === "redeemed").length, color: G.success, total: records.length },
          ].map(s => (
            <div key={s.label} style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: G.muted }}>{s.label}</span>
                <span style={{ color: s.color, fontWeight: 600 }}>{s.count} / {s.total}</span>
              </div>
              <div style={{ height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
                <div style={{ width: `${(s.count / s.total) * 100}%`, height: "100%", background: s.color, borderRadius: 2 }} />
              </div>
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 16, marginTop: 8 }}>
            <div style={{ fontSize: 10, color: G.muted, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10 }}>Recent Activity</div>
            {records.slice(-3).reverse().map(r => (
              <div key={r.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid rgba(212,175,55,0.06)`, fontSize: 12 }}>
                <span style={{ color: G.text }}>{r.name}</span>
                <span style={{ color: G.gold }}>₹{r.value.toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>
        </GoldCard>
      </div>

      {/* Overdue Alerts */}
      {overdueCount > 0 && (
        <GoldCard style={{ marginTop: 24, border: `1px solid ${G.danger}`, background: "rgba(224,80,80,0.04)" }}>
          <h3 style={{ fontSize: 14, color: G.danger, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>⚠ Overdue Loan Alerts</h3>
          {records.filter(r => r.status === "overdue").map(r => (
            <div key={r.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid rgba(224,80,80,0.1)`, fontSize: 13 }}>
              <div>
                <span style={{ color: G.text, fontWeight: 500 }}>{r.name}</span>
                <span style={{ color: G.muted, fontSize: 11, marginLeft: 12 }}>{r.item} · {getDuration(r.date)} months overdue</span>
              </div>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ color: G.danger }}>₹{(r.value + calcInterest(r)).toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                <GoldBtn small style={{ background: "transparent", border: `1px solid ${G.danger}`, color: G.danger, animation: "none" }}>Send Reminder</GoldBtn>
              </div>
            </div>
          ))}
        </GoldCard>
      )}
    </div>
  );
};

// CONTACT
const Contact = () => {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "80px 40px" }}>
      <SectionTitle sub="Reach Out">Contact Us</SectionTitle>
      {!sent ? (
        <GoldCard>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
            <Input label="Full Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <Input label="Phone Number" value={form.phone} onChange={v => setForm({ ...form, phone: v })} />
            <div style={{ gridColumn: "1 / -1" }}><Input label="Email Address" value={form.email} onChange={v => setForm({ ...form, email: v })} type="email" /></div>
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={{ display: "block", fontSize: 11, letterSpacing: "0.1em", color: G.gold, textTransform: "uppercase", marginBottom: 6, fontWeight: 500 }}>Message</label>
              <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5}
                style={{ width: "100%", background: "rgba(255,255,255,0.04)", border: `1px solid ${G.border}`, borderRadius: 2, padding: "10px 14px", color: G.text, fontSize: 13, fontFamily: "'Montserrat', sans-serif", outline: "none", resize: "vertical" }} />
            </div>
          </div>
          <div style={{ marginTop: 8 }}>
            <GoldBtn onClick={() => setSent(true)} style={{ width: "100%" }}>Send Message</GoldBtn>
          </div>
        </GoldCard>
      ) : (
        <GoldCard style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✨</div>
          <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 28, color: G.gold, marginBottom: 12 }}>Message Received</h3>
          <p style={{ color: G.muted, fontSize: 14 }}>We'll contact you within 2 business hours. For urgent queries call <span style={{ color: G.gold }}>+91 98765 43210</span></p>
          <div style={{ marginTop: 24 }}><GoldBtn outline onClick={() => setSent(false)}>Send Another</GoldBtn></div>
        </GoldCard>
      )}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 32 }}>
        {[["📍", "Location", "123, Gold Bazaar Road\nBengaluru – 560001"], ["📞", "Phone", "+91 98765 43210\n+91 80 2345 6789"], ["🕐", "Hours", "Mon – Sat: 9am – 7pm\nSun: 10am – 2pm"]].map(([icon, t, v]) => (
          <GoldCard key={t} style={{ textAlign: "center", padding: "20px" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 11, color: G.gold, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>{t}</div>
            <div style={{ fontSize: 12, color: G.muted, lineHeight: 1.8 }}>{v.split("\n").map((l, i) => <span key={i}>{l}{i < 1 && <br />}</span>)}</div>
          </GoldCard>
        ))}
      </div>
    </div>
  );
};

// ─── Nav ───────────────────────────────────────────────────────────────────
const NAV = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "calculator", label: "Calculator" },
  { id: "records", label: "Records" },
  { id: "dashboard", label: "Dashboard" },
  { id: "contact", label: "Contact" },
];

// ─── App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [records, setRecords] = useState(INITIAL_RECORDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { window.scrollTo({ top: 0, behavior: "smooth" }); }, [page]);

  const navigate = (id) => { setPage(id); setMenuOpen(false); };

  return (
    <div style={{ minHeight: "100vh", background: G.black, fontFamily: "'Montserrat', sans-serif" }}>
      <style>{globalStyle}</style>

      {/* Nav */}
      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 900, background: scrolled ? "rgba(0,0,0,0.95)" : "transparent", borderBottom: scrolled ? `1px solid ${G.border}` : "none", backdropFilter: scrolled ? "blur(16px)" : "none", transition: "all 0.4s", padding: "0 40px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
          <div onClick={() => navigate("home")} style={{ cursor: "pointer" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, color: G.gold, letterSpacing: "0.05em" }}>PREMIUM</div>
            <div style={{ fontSize: 9, letterSpacing: "0.35em", color: G.muted, textTransform: "uppercase", marginTop: -2 }}>Pawn Brokers</div>
          </div>
          <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
            {NAV.map(n => (
              <span key={n.id} onClick={() => navigate(n.id)} style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: page === n.id ? G.gold : G.muted, cursor: "pointer", transition: "color 0.2s", fontWeight: page === n.id ? 600 : 400, borderBottom: page === n.id ? `1px solid ${G.gold}` : "1px solid transparent", paddingBottom: 2 }}>{n.label}</span>
            ))}
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={{ paddingTop: 68, animation: "fadeIn 0.4s ease" }}>
        {page === "home" && <Home setPage={setPage} />}
        {page === "about" && <About />}
        {page === "services" && <Services setPage={setPage} />}
        {page === "calculator" && <Calculator />}
        {page === "records" && <Records records={records} setRecords={setRecords} />}
        {page === "dashboard" && <Dashboard records={records} />}
        {page === "contact" && <Contact />}
      </div>

      {/* Footer */}
      <footer style={{ background: G.dark, borderTop: `1px solid ${G.border}`, padding: "48px 40px 28px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 40, marginBottom: 32 }}>
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: G.gold, marginBottom: 12 }}>Premium Pawn Brokers</div>
              <p style={{ fontSize: 13, color: G.muted, lineHeight: 1.8, maxWidth: 320 }}>Bengaluru's most trusted pawn brokerage, offering transparent loans against gold, jewellery, and luxury assets since 1987.</p>
            </div>
            <div>
              <div style={{ fontSize: 11, color: G.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Quick Links</div>
              {NAV.map(n => <div key={n.id} onClick={() => navigate(n.id)} style={{ fontSize: 12, color: G.muted, padding: "4px 0", cursor: "pointer" }}>{n.label}</div>)}
            </div>
            <div>
              <div style={{ fontSize: 11, color: G.gold, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Contact</div>
              {["📍 123 Gold Bazaar Rd, Bengaluru", "📞 +91 98765 43210", "✉ info@premiumpawn.in", "🕐 Mon–Sat: 9am–7pm"].map(c => <div key={c} style={{ fontSize: 12, color: G.muted, padding: "4px 0" }}>{c}</div>)}
            </div>
          </div>
          <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${G.goldDim}, transparent)`, margin: "0 0 20px" }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: G.muted }}>
            <span>© 2024 Premium Pawn Brokers. All rights reserved.</span>
            <span style={{ color: G.goldDim }}>RBI Licensed · BIS Certified · Insured</span>
          </div>
        </div>
      </footer>

      {/* WhatsApp Float */}
      <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer"
        style={{ position: "fixed", bottom: 28, right: 28, width: 52, height: 52, background: "#25D366", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, textDecoration: "none", boxShadow: "0 4px 20px rgba(37,211,102,0.4)", zIndex: 800, transition: "transform 0.2s" }}
        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.1)"}
        onMouseLeave={e => e.currentTarget.style.transform = ""}>
        💬
      </a>
    </div>
  );
}
