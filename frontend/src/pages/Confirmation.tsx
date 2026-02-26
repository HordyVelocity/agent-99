import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'

const CHARCOAL = "#101213"
const GOLD = "#B8973A"
const GOLD_BG = "#FAF6ED"
const OFF_WHITE = "#F7F6F4"
const BORDER = "#E4E2DD"
const MUTED = "#8A8680"
const WHITE = "#FFFFFF"
const GREEN = "#2D6B3F"
const FONT = "'Montserrat', system-ui, sans-serif"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: ${FONT}; }
`

const NEXT_STEPS = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    text: "Your case has been assigned to a senior negotiation specialist.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 4.87 2 2 0 0 1 3.6 2.69h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.1a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.73 17z" />
      </svg>
    ),
    text: "Expect a call within 1–2 business days to discuss your strategy.",
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    text: "You'll receive a written action plan outlining next steps and timelines.",
  },
]

const STATS = [
  { value: "1–2", label: "Business Days to Contact" },
  { value: "94%", label: "Successful Negotiations" },
  { value: "12+", label: "Years ATO Experience" },
]

export function Confirmation() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: "600px", background: WHITE, borderRadius: "16px", border: `1.5px solid ${BORDER}`, boxShadow: "0 2px 12px rgba(16,18,19,0.06)", padding: "44px 40px" }}>

        {/* Success circle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
          <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(45,107,63,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GREEN} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1 style={{ fontSize: "1.45rem", fontWeight: 600, color: CHARCOAL, textAlign: "center", marginBottom: "8px", lineHeight: 1.3 }}>
          Case Successfully Submitted!
        </h1>
        <p style={{ fontSize: "0.88rem", color: MUTED, textAlign: "center", lineHeight: 1.6, marginBottom: "32px", maxWidth: "380px", margin: "0 auto 32px" }}>
          Your assessment has been received. Our team will review your details and be in touch shortly.
        </p>

        {/* Gold info box */}
        <div style={{ background: GOLD_BG, border: `1.5px solid rgba(184,151,58,0.2)`, borderRadius: "12px", padding: "20px 22px", marginBottom: "28px" }}>
          <p style={{ fontSize: "1rem", fontWeight: 600, color: CHARCOAL, marginBottom: "16px" }}>What Happens Next:</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {NEXT_STEPS.map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "50%", background: WHITE, border: `1.5px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {step.icon}
                </div>
                <p style={{ fontSize: "0.88rem", color: MUTED, lineHeight: 1.6, paddingTop: "6px" }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", marginBottom: "32px" }}>
          {STATS.map((stat, i) => (
            <div key={i} style={{ textAlign: "center", padding: "16px 12px", background: OFF_WHITE, borderRadius: "12px", border: `1.5px solid ${BORDER}` }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 700, color: GOLD, marginBottom: "4px" }}>{stat.value}</p>
              <p style={{ fontSize: "0.72rem", color: MUTED, lineHeight: 1.4 }}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ width: "100%", background: CHARCOAL, color: WHITE, border: "none", borderRadius: "12px", padding: "14px 32px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", boxShadow: "0 4px 16px rgba(16,18,19,0.25)", fontFamily: FONT }}
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/cases')}
            style={{ width: "100%", background: "transparent", color: CHARCOAL, border: `2px solid ${CHARCOAL}`, borderRadius: "12px", padding: "14px 32px", fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", fontFamily: FONT }}
          >
            View All Cases
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
