import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'
import { TdmFooter } from '../components/TdmFooter'
import heroAdvisor from '../assets/hero-advisor.jpg'
import heroWelcome from '../assets/hero-welcome.png'
import heroBroker from '../assets/hero-broker.jpg'

const BTN_COLOR = "#4A5568"
const CHARCOAL = "#2D2D2D"
const OFF_WHITE = "#FAF8F5"
const LIGHT_GREY = "#F7F7F7"
const BORDER = "#D4D4D4"
const MUTED = "#6B6B6B"
const WHITE = "#FFFFFF"
const BLUE_CHECK = "#6B7CED"
const FONT = "'Montserrat', system-ui, sans-serif"

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; }

  @keyframes heroFade {
    0%, 30% { opacity: 1; }
    33%, 63% { opacity: 0; }
    66%, 96% { opacity: 0; }
    100% { opacity: 1; }
  }

  .hero-slide {
    position: absolute; inset: 0;
    background-size: 115%; background-position: center 45%;
    background-repeat: no-repeat;
    animation: heroFade 12s ease-in-out infinite;
  }

  .hero-slide:nth-child(1) { animation-delay: 0s; }
  .hero-slide:nth-child(2) { animation-delay: -8s; }
  .hero-slide:nth-child(3) { animation-delay: -4s; }
`

const VIDEO_POINTS = [
  "Why ATO negotiation requires a structured approach",
  "How the assessment helps us understand your situation",
  "What you can expect from the Ascend team throughout the process",
]

function BlueCheck() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill={BLUE_CHECK} opacity="0.15" stroke={BLUE_CHECK} strokeWidth="1.5" />
      <path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke={BLUE_CHECK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Onboarding2() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      <div style={{ width: "100%", height: "180px", position: "relative", overflow: "hidden" }}>
        <div className="hero-slide" style={{ backgroundImage: `url(${heroAdvisor})` }} />
        <div className="hero-slide" style={{ backgroundImage: `url(${heroBroker})` }} />
        <div className="hero-slide" style={{ backgroundImage: `url(${heroWelcome})` }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", zIndex: 2 }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: WHITE, marginBottom: "4px", lineHeight: 1.25, maxWidth: "520px", textAlign: "center" }}>A Message From Zelly</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>Why this matters and what to expect</p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: "600px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "32px 32px" }}>

          <div style={{ position: "relative", aspectRatio: "16/9", background: "#1A1A1A", borderRadius: "8px", overflow: "hidden", marginBottom: "20px" }}>
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "rgba(255,255,255,0.92)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.25)" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="#1A1A1A"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              </div>
            </div>
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)", padding: "14px 14px 10px" }}>
              <p style={{ color: WHITE, fontSize: "0.76rem", fontWeight: 500, marginBottom: "2px" }}>Introduction to ATO Negotiation Process</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.66rem" }}>3:42</p>
            </div>
          </div>

          <div style={{ background: LIGHT_GREY, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "14px 16px", marginBottom: "22px" }}>
            <p style={{ fontSize: "0.86rem", fontWeight: 600, color: CHARCOAL, marginBottom: "10px" }}>In this video:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {VIDEO_POINTS.map((point, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <BlueCheck />
                  <span style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.5 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => { navigate('/onboarding-4q') }} style={{ height: "48px", background: BTN_COLOR, color: WHITE, border: "none", borderRadius: "24px", padding: "0 56px", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", fontFamily: FONT }}>{`Start Assessment \u2192`}</button>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button onClick={() => navigate('/onboarding-1')} style={{ background: "none", border: "none", color: MUTED, fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: FONT }}>{`\u2190 Back`}</button>
          </div>
        </div>
      </div>

      <TdmFooter />
    </div>
  )
}
