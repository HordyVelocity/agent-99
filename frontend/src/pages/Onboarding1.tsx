import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'
import { TdmFooter } from '../components/TdmFooter'
import heroBroker from '../assets/hero-broker.jpg'
import heroWelcome from '../assets/hero-welcome.png'
import heroAdvisor from '../assets/hero-advisor.jpg'

const BTN_COLOR = "#4A5568"
const CHARCOAL = "#2D2D2D"
const OFF_WHITE = "#FAF8F5"
const BORDER = "#D4D4D4"
const MUTED = "#6B6B6B"
const WHITE = "#FFFFFF"
const ACCENT = "#5B5FC7"
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
    background-size: 115%; background-position: center 40%;
    background-repeat: no-repeat;
    animation: heroFade 12s ease-in-out infinite;
  }

  .hero-slide:nth-child(1) { animation-delay: 0s; }
  .hero-slide:nth-child(2) { animation-delay: -8s; }
  .hero-slide:nth-child(3) { animation-delay: -4s; }
`

const TRUST_POINTS = [
  "100% focused on ATO debt resolution",
  "Fast, expert-led strategies tailored to your needs",
  "Fixed fees and results based pricing \u2014 no surprises",
  "Trusted by professionals and everyday Australians alike",
  "Registered with the Tax Practitioners Board (TPB)",
]

const SECTIONS = [
  { title: "Why we ask these questions", body: "Every ATO situation is different. By understanding your circumstances, we can tailor a strategy that fits your position \u2014 not apply a generic solution." },
  { title: "What this assessment does", body: "It gathers the key details about your tax debt, your goals, and your current situation. From there, we can outline a practical plan and advise you on the best way to approach negotiations with the ATO." },
  { title: "What you\u2019ll need", body: "If possible, have any recent ATO notices or correspondence nearby. The assessment takes around 10\u201315 minutes, and you can save your progress at any time." },
]

function BlueCheck() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="12" cy="12" r="11" fill={BLUE_CHECK} opacity="0.15" stroke={BLUE_CHECK} strokeWidth="1.5" />
      <path d="M7.5 12.5L10.5 15.5L16.5 9.5" stroke={BLUE_CHECK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Onboarding1() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      <div style={{ width: "100%", height: "180px", position: "relative", overflow: "hidden" }}>
        <div className="hero-slide" style={{ backgroundImage: `url(${heroBroker})` }} />
        <div className="hero-slide" style={{ backgroundImage: `url(${heroWelcome})` }} />
        <div className="hero-slide" style={{ backgroundImage: `url(${heroAdvisor})` }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", zIndex: 2 }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: WHITE, marginBottom: "4px", lineHeight: 1.25, maxWidth: "520px", textAlign: "center" }}>Getting Started</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>What to expect from your assessment</p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: "640px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "32px 32px" }}>

          <h1 style={{ fontSize: "1.25rem", fontWeight: 600, color: CHARCOAL, marginBottom: "5px", lineHeight: 1.3 }}>Before You Begin</h1>
          <div style={{ width: "50px", height: "3px", background: ACCENT, borderRadius: "2px", marginBottom: "10px" }} />
          <p style={{ fontSize: "0.78rem", color: MUTED, lineHeight: 1.6, marginBottom: "6px", fontStyle: "italic" }}>A few things to know before starting your assessment</p>
          <p style={{ fontSize: "0.8rem", color: CHARCOAL, lineHeight: 1.65, marginBottom: "20px" }}>
            We understand that dealing with ATO debt can feel stressful or overwhelming. This assessment is simply the first step in helping you move forward with clarity and confidence.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "20px" }}>
            {SECTIONS.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <div style={{ flexShrink: 0, width: "28px", height: "28px", borderRadius: "50%", border: `2px solid ${CHARCOAL}`, display: "flex", alignItems: "center", justifyContent: "center", marginTop: "1px" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                </div>
                <div>
                  <p style={{ fontSize: "0.88rem", fontWeight: 600, color: CHARCOAL, marginBottom: "2px" }}>{item.title}</p>
                  <p style={{ fontSize: "0.8rem", color: MUTED, lineHeight: 1.55 }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: OFF_WHITE, borderRadius: "6px", padding: "12px 14px", marginBottom: "20px", borderLeft: `3px solid ${ACCENT}` }}>
            <p style={{ fontSize: "0.8rem", color: CHARCOAL, lineHeight: 1.55, fontWeight: 500 }}>
              {`You\u2019re not committing to anything today \u2014 you\u2019re simply taking a positive step toward resolving your tax debt.`}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "24px", paddingLeft: "4px" }}>
            {TRUST_POINTS.map((point, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <BlueCheck />
                <span style={{ fontSize: "0.82rem", color: CHARCOAL, lineHeight: 1.4 }}>{point}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: "center" }}>
            <button onClick={() => navigate('/onboarding-2')} style={{ height: "48px", background: BTN_COLOR, color: WHITE, border: "none", borderRadius: "24px", padding: "0 56px", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", fontFamily: FONT }}>{`Continue \u2192`}</button>
          </div>
          <div style={{ textAlign: "center", marginTop: "10px" }}>
            <button onClick={() => navigate('/')} style={{ background: "none", border: "none", color: MUTED, fontSize: "0.78rem", cursor: "pointer", textDecoration: "underline", textUnderlineOffset: "3px", fontFamily: FONT }}>{`\u2190 Back`}</button>
          </div>
        </div>
      </div>

      <TdmFooter />
    </div>
  )
}
