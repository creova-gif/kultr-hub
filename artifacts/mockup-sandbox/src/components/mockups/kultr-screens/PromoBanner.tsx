export function PromoBanner() {
  const features = [
    {
      icon: "🗺️",
      title: "Culture Compass",
      desc: "Discover events across 7 East African countries — Nairobi, Lagos, Accra & beyond.",
      accent: "#FF6B00",
    },
    {
      icon: "✨",
      title: "AI-Matched For You",
      desc: "Smart picks that match your vibe. Energetic, Thoughtful, Uplifting — your taste, your feed.",
      accent: "#9C27B0",
    },
    {
      icon: "💳",
      title: "Local Payments",
      desc: "M-Pesa, Airtel Money, MTN MoMo & more. Pay your way in your currency.",
      accent: "#00C853",
    },
    {
      icon: "👥",
      title: "Social Hub",
      desc: "See what friends are going to. Chat, invite, and experience events together.",
      accent: "#2196F3",
    },
    {
      icon: "🎟️",
      title: "Instant QR Tickets",
      desc: "Tickets arrive the moment you pay — live in your pocket, no printing needed.",
      accent: "#FF6B00",
    },
    {
      icon: "🎨",
      title: "Creator Studio",
      desc: "Publish events, track sales, and grow your audience — all from your phone.",
      accent: "#FF9800",
    },
  ];

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0A0A0A",
        display: "flex",
        alignItems: "stretch",
        fontFamily: "'Inter', 'SF Pro Display', system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background atmosphere ── */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {/* Diagonal stripe grid */}
        <div style={{ position: "absolute", inset: 0, opacity: 0.025, backgroundImage: "repeating-linear-gradient(60deg, #FF6B00 0px, #FF6B00 1px, transparent 1px, transparent 28px)" }} />
        {/* Orange glow top-left */}
        <div style={{ position: "absolute", top: -180, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.18) 0%, transparent 65%)" }} />
        {/* Purple glow bottom-right */}
        <div style={{ position: "absolute", bottom: -200, right: 320, width: 500, height: 500, borderRadius: "50%", background: "radial-gradient(circle, rgba(156,39,176,0.10) 0%, transparent 65%)" }} />
        {/* Centre highlight behind phone */}
        <div style={{ position: "absolute", top: "50%", right: "18%", transform: "translateY(-50%)", width: 420, height: 420, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,0,0.09) 0%, transparent 65%)" }} />
      </div>

      {/* ── LEFT PANEL — branding + features ── */}
      <div
        style={{
          flex: "0 0 58%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "52px 56px 52px 64px",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 32 }}>
          <img src="/screens/logo-icon.png" alt="K" style={{ width: 48, height: 48, borderRadius: 11 }} />
          <img src="/screens/logo-wordmark.png" alt="Kultr" style={{ width: 120, height: 38, objectFit: "contain" }} />
          <span style={{ background: "rgba(255,107,0,0.15)", border: "1px solid rgba(255,107,0,0.35)", color: "#FF6B00", fontSize: 10, fontWeight: 700, padding: "3px 9px", borderRadius: 20, letterSpacing: "0.1em", marginLeft: 4 }}>BETA</span>
        </div>

        {/* Headline */}
        <div style={{ marginBottom: 10 }}>
          <div style={{ color: "#FF6B00", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 10 }}>East Africa's Cultural Hub</div>
          <h1 style={{ margin: 0, color: "#FFFFFF", fontSize: 48, fontWeight: 900, lineHeight: 1.08, letterSpacing: "-0.02em" }}>
            Bold Culture.<br />
            <span style={{ color: "#FF6B00" }}>Timeless</span> Impact.
          </h1>
        </div>
        <p style={{ color: "#888", fontSize: 15, lineHeight: 1.6, margin: "0 0 36px 0", maxWidth: 460 }}>
          Discover, book, and experience the most vibrant events across East Africa — music, art, food, heritage, and more.
        </p>

        {/* Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px 24px",
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 14,
                padding: "14px 16px",
                transition: "all 0.2s",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: `${f.accent}18`,
                  border: `1px solid ${f.accent}30`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 17,
                  flexShrink: 0,
                }}
              >
                {f.icon}
              </div>
              <div>
                <div style={{ color: "#F0F0F0", fontSize: 13, fontWeight: 700, marginBottom: 3, letterSpacing: "0.01em" }}>{f.title}</div>
                <div style={{ color: "#666", fontSize: 11, lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA row */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 32 }}>
          <div
            style={{
              background: "#FF6B00",
              color: "#fff",
              fontSize: 14,
              fontWeight: 800,
              padding: "12px 28px",
              borderRadius: 32,
              letterSpacing: "0.02em",
              boxShadow: "0 8px 32px rgba(255,107,0,0.35)",
            }}
          >
            Download Now →
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {["🇰🇪", "🇳🇬", "🇬🇭", "🇺🇬", "🇹🇿", "🇷🇼", "🇪🇹"].map((flag, i) => (
              <span key={i} style={{ fontSize: 20 }}>{flag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — phone mockup stack ── */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          zIndex: 1,
          paddingRight: 40,
        }}
      >
        {/* Back phone (tilted, smaller) */}
        <div
          style={{
            position: "absolute",
            right: 30,
            top: "50%",
            transform: "translateY(-58%) rotate(8deg)",
            width: 200,
            height: 432,
            borderRadius: 34,
            background: "#0E0E0E",
            border: "2px solid #222",
            padding: 8,
            boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px #181818",
            opacity: 0.65,
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 26, overflow: "hidden", background: "#111" }}>
            <img src="/screens/ai.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", width: 72, height: 4, background: "#2A2A2A", borderRadius: 2 }} />
        </div>

        {/* Third phone (left, tilted other way) */}
        <div
          style={{
            position: "absolute",
            right: 255,
            top: "50%",
            transform: "translateY(-42%) rotate(-6deg)",
            width: 190,
            height: 410,
            borderRadius: 32,
            background: "#0E0E0E",
            border: "2px solid #222",
            padding: 8,
            boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px #181818",
            opacity: 0.55,
          }}
        >
          <div style={{ width: "100%", height: "100%", borderRadius: 24, overflow: "hidden", background: "#111" }}>
            <img src="/screens/social.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
          </div>
          <div style={{ position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)", width: 68, height: 4, background: "#2A2A2A", borderRadius: 2 }} />
        </div>

        {/* Main / hero phone */}
        <div
          style={{
            position: "relative",
            width: 240,
            height: 512,
            borderRadius: 40,
            background: "linear-gradient(160deg, #1A1A1A 0%, #0E0E0E 100%)",
            border: "2px solid #2A2A2A",
            padding: 10,
            boxShadow: "0 48px 120px rgba(0,0,0,0.8), 0 0 0 1px #1E1E1E, 0 0 80px rgba(255,107,0,0.12)",
            zIndex: 3,
            marginRight: 10,
          }}
        >
          {/* Notch */}
          <div style={{ position: "absolute", top: 14, left: "50%", transform: "translateX(-50%)", width: 76, height: 24, background: "#0E0E0E", borderRadius: 14, zIndex: 10, border: "1px solid #1E1E1E" }} />

          {/* Side buttons */}
          <div style={{ position: "absolute", right: -3, top: 100, width: 3, height: 52, background: "#222", borderRadius: "0 2px 2px 0" }} />
          <div style={{ position: "absolute", left: -3, top: 90, width: 3, height: 32, background: "#222", borderRadius: "2px 0 0 2px" }} />
          <div style={{ position: "absolute", left: -3, top: 132, width: 3, height: 32, background: "#222", borderRadius: "2px 0 0 2px" }} />

          {/* Screen */}
          <div style={{ width: "100%", height: "100%", borderRadius: 32, overflow: "hidden", background: "#111111", position: "relative" }}>
            <img
              src="/screens/discovery.png"
              alt="Kultr Discovery"
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
            {/* Orange accent glow at bottom of screen */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 80, background: "linear-gradient(to top, rgba(255,107,0,0.18), transparent)" }} />
          </div>

          {/* Home indicator */}
          <div style={{ position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)", width: 88, height: 4, background: "#333", borderRadius: 2 }} />

          {/* Glow ring around hero phone */}
          <div style={{ position: "absolute", inset: -2, borderRadius: 42, boxShadow: "0 0 40px rgba(255,107,0,0.15), 0 0 80px rgba(255,107,0,0.05)", pointerEvents: "none" }} />
        </div>
      </div>

      {/* Vertical divider line */}
      <div style={{ position: "absolute", left: "58%", top: "8%", bottom: "8%", width: 1, background: "linear-gradient(to bottom, transparent, rgba(255,107,0,0.2) 30%, rgba(255,107,0,0.2) 70%, transparent)", pointerEvents: "none" }} />
    </div>
  );
}
