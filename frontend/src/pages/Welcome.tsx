import { useNavigate } from 'react-router-dom'
import { TdmHeader } from '../components/TdmHeader'
import heroWelcome from '../assets/hero-welcome.png'

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

  .welcome-hero {
    width: 100%;
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  @media (max-width: 768px) {
    .welcome-hero {
      height: 130px;
    }
  }
`

export function Welcome() {
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: "100vh", background: OFF_WHITE, display: "flex", flexDirection: "column", fontFamily: FONT }}>
      <style>{STYLES}</style>
      <TdmHeader />

      {/* Hero section */}
      <div
        className="welcome-hero"
        style={{
          backgroundImage: `url(${heroWelcome})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.55)" }} />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px" }}>
          <div style={{ marginBottom: "10px" }}>
            <span style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.15)",
              color: WHITE,
              fontSize: "0.6rem",
              fontWeight: 700,
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              borderRadius: "100px",
              padding: "5px 14px",
              border: "1px solid rgba(255,255,255,0.25)",
            }}>
              Ascend
            </span>
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: WHITE, marginBottom: "6px", lineHeight: 1.2, maxWidth: "600px" }}>
            Take Control of Your ATO Debt
          </h1>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.75)", lineHeight: 1.5, maxWidth: "440px", margin: "0 auto" }}>
            Assess your situation. Understand your options. Get expert support.
          </p>
        </div>
      </div>

      {/* White card container — matches Before You Begin style */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 24px" }}>
        <div style={{ width: "100%", maxWidth: "600px", background: WHITE, borderRadius: "12px", border: `1px solid ${BORDER}`, boxShadow: "0 1px 6px rgba(0,0,0,0.06)", padding: "40px 36px", textAlign: "center" }}>

          {/* Trust icons */}
          <div style={{ display: "flex", justifyContent: "center", gap: "40px", marginBottom: "32px" }}>
            {[
              {
                label: "Secure",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
              },
              {
                label: "Regulated",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                ),
              },
              {
                label: "Compliant",
                icon: (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
              },
            ].map(({ label, icon }) => (
              <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: WHITE, border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
                  {icon}
                </div>
                <span style={{ fontSize: "0.68rem", fontWeight: 700, color: CHARCOAL, letterSpacing: "0.1em", textTransform: "uppercase" }}>{label}</span>
              </div>
            ))}
          </div>

          {/* Start Now button — FF matched */}
          <button
            onClick={() => navigate('/onboarding-1')}
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
              marginBottom: "14px",
            }}
          >
            Start Now
          </button>

          {/* Learn More — text link */}
          <div>
            <a
              href="#learn-more"
              style={{
                fontSize: "0.82rem",
                fontWeight: 500,
                color: MUTED,
                textDecoration: "underline",
                textUnderlineOffset: "3px",
                cursor: "pointer",
                fontFamily: FONT,
              }}
            >
              Learn More
            </a>
          </div>

          {/* Footer text inside card */}
          <p style={{ fontSize: "0.72rem", color: MUTED, textAlign: "center", maxWidth: "360px", lineHeight: 1.6, margin: "28px auto 0" }}>
            Your information is protected under our privacy policy and used solely to assist with your ATO negotiation assessment.
          </p>
        </div>
      </div>
    </div>
  )
}
