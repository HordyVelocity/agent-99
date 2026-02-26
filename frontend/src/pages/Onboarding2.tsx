import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'
import heroAdvisor from '../assets/hero-advisor.jpg'

const BTN_COLOR = "#4A5568"
const CHARCOAL = "#2D2D2D"
const OFF_WHITE = "#FAF8F5"
const LIGHT_GREY = "#F7F7F7"
const BORDER = "#D4D4D4"
const MUTED = "#6B6B6B"
const WHITE = "#FFFFFF"
const ACCENT = "#5B5FC7"
const FONT = "'Montserrat', system-ui, sans-serif"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: ${FONT}; }

  .ob2-hero {
    width: 100%;
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .ob2-hero {
      height: 130px;
    }
  }
`

const VIDEO_POINTS = [
  "Why ATO negotiation requires a structured approach",
  "How the assessment helps us understand your situation",
  "What you can expect from the Ascend team throughout the process",
]

export function Onboarding2() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      {/* Hero section */}
      <div
        className="ob2-hero"
        style={{
          backgroundImage: `url(${heroAdvisor})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: WHITE, marginBottom: "6px", lineHeight: 1.25, maxWidth: "520px" }}>
            A Message From Zelly
          </h1>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "400px", margin: "0 auto" }}>
            Why this matters and what to expect
          </p>
        </div>
      </div>

      {/* Card content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: "720px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "40px 36px" }}>

        {/* Video placeholder */}
        <div style={{ position: "relative", aspectRatio: "16/9", background: "#1A1A1A", borderRadius: "8px", overflow: "hidden", marginBottom: "24px" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1A1A1A">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", padding: "16px 16px 12px" }}>
            <p style={{ color: WHITE, fontSize: "0.8rem", fontWeight: 500, marginBottom: "2px" }}>Introduction to ATO Negotiation Process</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>3:42</p>
          </div>
        </div>

        {/* Info box — cool grey, charcoal bullets */}
        <div style={{ background: LIGHT_GREY, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "18px 20px", marginBottom: "28px" }}>
          <p style={{ fontSize: "0.92rem", fontWeight: 600, color: CHARCOAL, marginBottom: "10px" }}>In this video:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "7px" }}>
            {VIDEO_POINTS.map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                <span style={{ color: ACCENT, fontSize: "0.65rem", marginTop: "4px", flexShrink: 0 }}>●</span>
                <span style={{ fontSize: "0.85rem", color: MUTED, lineHeight: 1.6 }}>{point}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA — pill style */}
        <div style={{ textAlign: "center" }}>
        <button
          onClick={() => { window.location.href = 'https://ascend-membership.flutterflow.app/' }}
          style={{ height: "44px", background: BTN_COLOR, color: WHITE, border: "none", borderRadius: "24px", padding: "0 48px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", fontFamily: FONT }}
        >
          Start Assessment →
        </button>
        </div>
      </div>
      </div>
    </div>
  )
}
