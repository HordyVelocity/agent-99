import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'
import heroBroker from '../assets/hero-broker.jpg'

const BTN_COLOR = "#4A5568"
const CHARCOAL = "#2D2D2D"
const LIGHT_GREY = "#F7F7F7"
const OFF_WHITE = "#FAF8F5"
const BORDER = "#D4D4D4"
const MUTED = "#6B6B6B"
const WHITE = "#FFFFFF"
const ACCENT = "#5B5FC7"
const FONT = "'Montserrat', system-ui, sans-serif"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: ${FONT}; }

  .post-hero {
    width: 100%;
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .post-hero {
      height: 130px;
    }
  }
`

const STEPS = [
  "Our team will review your assessment results within 1\u20132 business days.",
  "We'll contact you to discuss your specific situation and recommended strategy.",
  "You will receive a tailored action plan outlining next steps.",
  "We begin formal negotiations with the ATO on your behalf.",
]

export function PostAssessmentVideo() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      {/* Hero section */}
      <div
        className="post-hero"
        style={{
          backgroundImage: `url(${heroBroker})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: WHITE, marginBottom: "6px", lineHeight: 1.25, maxWidth: "520px" }}>
            What Happens Next
          </h1>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "400px", margin: "0 auto" }}>
            Your assessment is complete. Here's how we take it from here.
          </p>
        </div>
      </div>

      {/* Card content */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ maxWidth: "720px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "40px 36px" }}>

        {/* Video placeholder */}
        <div style={{ position: "relative", aspectRatio: "16/9", background: "#1A1A1A", borderRadius: "8px", overflow: "hidden", marginBottom: "28px" }}>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: "64px", height: "64px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#1A1A1A">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
          </div>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", padding: "16px 16px 12px" }}>
            <p style={{ color: WHITE, fontSize: "0.8rem", fontWeight: 500, marginBottom: "2px" }}>What Happens After Your Assessment</p>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem" }}>2:15</p>
          </div>
        </div>

        {/* Steps with numbered circles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "18px", marginBottom: "28px" }}>
          {STEPS.map((step, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "50%", background: "transparent", border: `2px solid ${CHARCOAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: CHARCOAL }}>{i + 1}</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: MUTED, lineHeight: 1.6, paddingTop: "5px" }}>{step}</p>
            </div>
          ))}
        </div>

        {/* Info box */}
        <div style={{ background: LIGHT_GREY, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "16px 20px", marginBottom: "28px" }}>
          <p style={{ fontSize: "0.82rem", color: MUTED, lineHeight: 1.6 }}>
            <span style={{ fontWeight: 600, color: CHARCOAL }}>Need help sooner?</span> You can contact our support team directly through the Get Support page in your dashboard.
          </p>
        </div>

        {/* CTA — pill style */}
        <button
          onClick={() => window.location.href='https://ascend-membership.flutterflow.app/page005NewCase_V4'}
          style={{ height: "44px", background: BTN_COLOR, color: WHITE, border: "none", borderRadius: "24px", padding: "0 48px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", fontFamily: FONT }}
        >
          Submit Your Case →
        </button>
      </div>
      </div>
    </div>
  )
}
