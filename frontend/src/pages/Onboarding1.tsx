import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'

const BTN_COLOR = "#4A5568"
const CHARCOAL = "#2D2D2D"
const OFF_WHITE = "#FAF8F5"
const BORDER = "#D4D4D4"
const MUTED = "#6B6B6B"
const WHITE = "#FFFFFF"
const ACCENT = "#5B5FC7"
const FONT = "'Montserrat', system-ui, sans-serif"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; font-family: ${FONT}; }
`

const ITEMS = [
  {
    title: "Why we do this",
    body: "Every ATO situation is different. This assessment helps us understand your circumstances so we can provide tailored guidance \u2014 not a one-size-fits-all approach.",
  },
  {
    title: "What it does",
    body: "The questionnaire evaluates your readiness and the complexity of your situation, so our team can determine the most effective negotiation strategy for you.",
  },
  {
    title: "What you'll need",
    body: "Have any recent ATO notices or correspondence handy if possible. The assessment takes 10\u201315 minutes and you can save progress at any time.",
  },
]

export function Onboarding1() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
      <div style={{ width: "100%", maxWidth: "600px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "40px 36px" }}>

        {/* Heading with accent line */}
        <h1 style={{ fontSize: "1.4rem", fontWeight: 600, color: CHARCOAL, marginBottom: "6px", lineHeight: 1.3 }}>
          Before You Begin
        </h1>
        <div style={{ width: "60px", height: "3px", background: ACCENT, borderRadius: "2px", marginBottom: "12px" }} />
        <p style={{ fontSize: "0.85rem", color: MUTED, lineHeight: 1.6, marginBottom: "32px" }}>
          Here's what you need to know about the assessment process
        </p>

        {/* Info rows — outline checkmark circles */}
        <div style={{ display: "flex", flexDirection: "column", gap: "22px", marginBottom: "36px" }}>
          {ITEMS.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
              <div style={{ flexShrink: 0, width: "32px", height: "32px", borderRadius: "50%", background: "transparent", border: `2px solid ${CHARCOAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "2px" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: CHARCOAL, marginBottom: "4px" }}>{item.title}</p>
                <p style={{ fontSize: "0.85rem", color: MUTED, lineHeight: 1.6 }}>{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Continue button — FF matched: slate colour, auto width, 44px height, pill */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => navigate('/onboarding-2')}
            style={{
              height: "44px",
              background: BTN_COLOR,
              color: WHITE,
              border: "none",
              borderRadius: "24px",
              padding: "0 48px",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.02em",
              fontFamily: FONT,
            }}
          >
            Continue →
          </button>
        </div>
      </div>
      </div>
    </div>
  )
}
