export default function ArchDiagram() {
  const sources = ["AUF Official Site", "X / Social Feeds", "Sports News Sites"];
  const arrows = "→";

  const box = (label, sub, color, textColor = "#fff") => (
    <div style={{
      background: color,
      color: textColor,
      borderRadius: 10,
      padding: "10px 16px",
      minWidth: 140,
      textAlign: "center",
      fontFamily: "'Georgia', serif",
      boxShadow: "0 2px 8px rgba(0,0,0,0.18)"
    }}>
      <div style={{ fontWeight: 700, fontSize: 13 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, opacity: 0.82, marginTop: 3 }}>{sub}</div>}
    </div>
  );

  const arrow = (label) => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", color: "#888", fontSize: 11, margin: "2px 0" }}>
      <div style={{ fontSize: 18, lineHeight: 1 }}>↓</div>
      {label && <div style={{ fontSize: 10, color: "#aaa", marginTop: 1 }}>{label}</div>}
    </div>
  );

  const harrow = (label) => (
    <div style={{ display: "flex", alignItems: "center", color: "#888", fontSize: 11, margin: "0 6px" }}>
      <div style={{ fontSize: 16 }}>→</div>
    </div>
  );

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f1117",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "40px 20px",
      fontFamily: "'Georgia', serif",
      color: "#e8e4d9"
    }}>
      <div style={{ fontSize: 11, letterSpacing: 4, color: "#6b7a8d", textTransform: "uppercase", marginBottom: 8 }}>MVP Architecture</div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: "#e8e4d9", marginBottom: 32, letterSpacing: 1 }}>Uruguay Tracker — System Overview</h1>

      {/* Sources row */}
      <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 4 }}>
        {sources.map((s, i) => (
          <div key={i}>{box(s, null, "#1e2a3a", "#a8c4e0")}</div>
        ))}
      </div>

      {arrow("daily cron scrape / RSS / API")}

      {/* Ingest layer */}
      {box("Ingest & Fetch Layer", "Next.js API Route + Cron (Vercel)", "#1a3a2a", "#7ec8a0")}

      {arrow("raw content")}

      {/* AI layer */}
      {box("AI Filtering & Summarisation", "Gemini / Groq free tier — relevance scoring, noise removal, structured extraction", "#2a1a3a", "#c4a8e0")}

      {arrow("structured JSON")}

      {/* DB */}
      {box("Database", "Neon or Supabase (free tier) — stores processed briefing + history", "#1a2a3a", "#a8c4e0")}

      {arrow("query")}

      {/* Frontend */}
      {box("Frontend", "Next.js on Vercel — clean feed + persistent team briefing", "#2a1e10", "#e0c87e")}

      {arrow("")}

      {/* User */}
      {box("You", "Read signal, no noise", "#1c1c1c", "#e8e4d9")}

      {/* Legend */}
      <div style={{
        marginTop: 40,
        border: "1px solid #2a2a3a",
        borderRadius: 10,
        padding: "14px 20px",
        maxWidth: 420,
        fontSize: 11,
        color: "#888",
        lineHeight: 1.8
      }}>
        <div style={{ color: "#6b7a8d", letterSpacing: 2, textTransform: "uppercase", fontSize: 10, marginBottom: 6 }}>Notes</div>
        <div>🕐 Cron runs once daily (configurable)</div>
        <div>🤖 AI layer filters noise + extracts facts (injuries, dates, squads)</div>
        <div>🗄 DB persists briefing — solves the memory problem</div>
        <div>🌐 All free-tier infra for POC</div>
        <div>📐 Ingest layer abstracted → generalises to other topics later</div>
      </div>
    </div>
  );
}
