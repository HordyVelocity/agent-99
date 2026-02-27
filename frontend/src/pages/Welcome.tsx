import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'
import { TdmFooter } from '../components/TdmFooter'
import heroWelcome from '../assets/hero-welcome.png'
import heroBroker from '../assets/hero-broker.jpg'
import heroAdvisor from '../assets/hero-advisor.jpg'

const BTN_COLOR = "#4A5568"
const CHARCOAL = "#2D2D2D"
const OFF_WHITE = "#FAF8F5"
const BORDER = "#D4D4D4"
const MUTED = "#6B6B6B"
const WHITE = "#FFFFFF"
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

export function Welcome() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      <div style={{ width: "100%", height: "180px", position: "relative", overflow: "hidden" }}>
        <div className="hero-slide" style={{ backgroundImage: `url(${heroWelcome})` }} />
        <div className="hero-slide" style={{ backgroundImage: `url(${heroBroker})` }} />
        <div className="hero-slide" style={{ backgroundImage: `url(${heroAdvisor})` }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 1 }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 24px", zIndex: 2 }}>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ display: "inline-block", background: "rgba(255,255,255,0.15)", color: WHITE, fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", borderRadius: "100px", padding: "4px 12px", border: "1px solid rgba(255,255,255,0.25)" }}>Ascend</span>
          </div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: WHITE, marginBottom: "4px", lineHeight: 1.2, maxWidth: "600px", textAlign: "center" }}>Take Control of Your ATO Debt</h1>
          <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "440px", margin: "0 auto", textAlign: "center" }}>Assess your situation. Understand your options. Get expert support.</p>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div style={{ width: "100%", maxWidth: "500px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "36px 32px", textAlign: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
          <div style={{ display: "flex", justifyContent: "center", gap: "36px", marginBottom: "28px" }}>
            {[
              { label: "Secure", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg> },
              { label: "Regulated", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 15 10" /></svg> },
              { label: "Compliant", icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg> },
            ].map(({ label, icon }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
                <div style={{ width: "46px", height: "46px", borderRadius: "50%", background: WHITE, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>{icon}</div>
                <span style={{ fontSize: "0.62rem", fontWeight: 700, color: CHARCOAL, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <button onClick={() => navigate('/onboarding-1')} style={{ height: "48px", background: BTN_COLOR, color: WHITE, border: "none", borderRadius: "24px", padding: "0 56px", fontSize: "0.84rem", fontWeight: 600, cursor: "pointer", letterSpacing: "0.02em", fontFamily: FONT }}>Start Now</button>
          </div>
          <div><a href="#learn-more" style={{ fontSize: "0.78rem", fontWeight: 500, color: MUTED, textDecoration: "underline", textUnderlineOffset: "3px", cursor: "pointer", fontFamily: FONT }}>Learn More</a></div>
          <p style={{ fontSize: "0.68rem", color: MUTED, textAlign: "center", maxWidth: "340px", lineHeight: 1.6, margin: "20px auto 0" }}>Your information is protected under our privacy policy and used solely to assist with your ATO negotiation assessment.</p>
        </div>
      </div>

      <TdmFooter />
    </div>
  )
}
