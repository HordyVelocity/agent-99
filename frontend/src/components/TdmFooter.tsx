import tpbLogo from '../assets/tpb-logo.jpg'

const FOOTER_BG = "#1A1F2E"
const FOOTER_TEXT = "rgba(255,255,255,0.55)"
const FOOTER_LINK = "rgba(255,255,255,0.7)"
const FONT = "'Montserrat', system-ui, sans-serif"

export function TdmFooter() {
  const linkStyle = { color: FOOTER_LINK, textDecoration: "none", fontSize: "0.75rem", lineHeight: 2, display: "block" } as const
  const headingStyle = { color: "#FFFFFF", fontSize: "0.78rem", fontWeight: 700, marginBottom: "12px", textTransform: "uppercase" as const, letterSpacing: "0.06em" }

  return (
    <footer style={{ background: FOOTER_BG, padding: "40px 32px 28px", fontFamily: FONT }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "24px", alignItems: "start" }}>

        <div>
          <p style={headingStyle}>Quick Links</p>
          <a href="https://taxdebtmanager.com.au" target="_blank" rel="noopener noreferrer" style={linkStyle}>Home</a>
          <a href="https://taxdebtmanager.com.au/about" target="_blank" rel="noopener noreferrer" style={linkStyle}>About</a>
          <a href="https://taxdebtmanager.com.au/faqs" target="_blank" rel="noopener noreferrer" style={linkStyle}>FAQs</a>
        </div>

        <div>
          <p style={headingStyle}>Contact Us</p>
          <span style={{ ...linkStyle, cursor: "default" }}>Tax Debt Manager</span>
          <a href="tel:0290001816" style={linkStyle}>(02) 9000 1816</a>
          <a href="mailto:negotiate@taxdebtmanager.com.au" style={linkStyle}>negotiate@taxdebtmanager.com.au</a>
        </div>

        <div>
          <p style={headingStyle}>Legal</p>
          <a href="https://taxdebtmanager.com.au/privacy-policy" target="_blank" rel="noopener noreferrer" style={linkStyle}>Privacy Policy</a>
          <a href="https://taxdebtmanager.com.au/terms" target="_blank" rel="noopener noreferrer" style={linkStyle}>Terms & Conditions</a>
        </div>

        <div>
          <p style={headingStyle}>Connect</p>
          <div style={{ display: "flex", gap: "14px", marginTop: "4px" }}>
            <a href="https://facebook.com/taxdebtmanager" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg width="22" height="22" viewBox="0 0 24 24" fill={FOOTER_LINK}><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a href="https://instagram.com/taxdebtmanager" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={FOOTER_LINK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
          </div>
        </div>

        <div style={{ textAlign: "right" }}>
          <p style={headingStyle}>Registration</p>
          <img src={tpbLogo} alt="Tax Practitioners Board Registered - Tax Agent 26311811" style={{ width: "80px", height: "auto", borderRadius: "4px", opacity: 0.9 }} />
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "24px auto 0", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px", textAlign: "center" }}>
        <p style={{ fontSize: "0.7rem", color: FOOTER_TEXT }}>{`\u00A9 ${new Date().getFullYear()} Tax Debt Manager. All rights reserved.`}</p>
      </div>
    </footer>
  )
}
