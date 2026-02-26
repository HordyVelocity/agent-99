import tdmLogo from '../assets/tdm-logo.png'

const CHARCOAL = "#101213"
const GOLD = "#B8973A"
const OFF_WHITE = "#F7F6F4"
const BORDER = "#E4E2DD"
const FONT = "'Montserrat', system-ui, sans-serif"

const NAV_LINKS = [
  "New Case",
  "Case Register",
  "Appointment Preparation",
  "Get Support",
]

const HEADER_STYLES = `
  .tdm-header {
    background: #FFFFFF;
    border-bottom: 1px solid ${BORDER};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    height: 56px;
    position: sticky;
    top: 0;
    z-index: 20;
    font-family: ${FONT};
  }

  .tdm-header__logo {
    height: 36px;
    width: auto;
    display: block;
    flex-shrink: 0;
  }

  .tdm-header__nav {
    display: none;
    align-items: center;
    gap: 32px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
  }

  .tdm-header__nav-link {
    color: ${CHARCOAL};
    font-size: 0.82rem;
    font-weight: 500;
    letter-spacing: 0.03em;
    cursor: pointer;
    white-space: nowrap;
    background: none;
    border: none;
    padding: 0;
    font-family: ${FONT};
    transition: color 0.15s ease;
  }

  .tdm-header__nav-link:hover {
    color: ${GOLD};
  }

  .tdm-header__right {
    display: none;
    align-items: center;
    gap: 10px;
  }

  .tdm-header__user-label {
    color: ${CHARCOAL};
    font-size: 0.8rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    font-family: ${FONT};
  }

  .tdm-header__avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${OFF_WHITE};
    border: 1.5px solid ${BORDER};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .tdm-header__hamburger {
    display: flex;
    flex-direction: column;
    gap: 5px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
  }

  .tdm-header__hamburger span {
    display: block;
    width: 22px;
    height: 2px;
    background: ${CHARCOAL};
    border-radius: 2px;
  }

  @media (min-width: 1024px) {
    .tdm-header {
      padding: 0 40px;
    }
    .tdm-header__nav {
      display: flex;
    }
    .tdm-header__right {
      display: flex;
    }
    .tdm-header__hamburger {
      display: none;
    }
  }

  @media (max-width: 1023px) {
    .tdm-header {
      height: 50px;
      padding: 0 20px;
    }
    .tdm-header__logo {
      height: 30px;
    }
  }
`

export function TdmHeader() {
  return (
    <>
      <style>{HEADER_STYLES}</style>
      <nav className="tdm-header">
        {/* Logo */}
        <img src={tdmLogo} alt="Tax Debt Manager" className="tdm-header__logo" />

        {/* Desktop centre nav */}
        <div className="tdm-header__nav">
          {NAV_LINKS.map(link => (
            <button key={link} className="tdm-header__nav-link">{link}</button>
          ))}
        </div>

        {/* Desktop right + mobile hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Desktop: Hi [firstName] + avatar */}
          <div className="tdm-header__right">
            <span className="tdm-header__user-label">Hi [firstName]</span>
            <div className="tdm-header__avatar">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CHARCOAL} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>

          {/* Mobile: hamburger */}
          <button className="tdm-header__hamburger" aria-label="Menu">
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </>
  )
}
