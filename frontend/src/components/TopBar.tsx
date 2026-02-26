const CHARCOAL = "#101213"
const GOLD = "#B8973A"
const MUTED = "#8A8680"
const WHITE = "#FFFFFF"
const FONT = "'Montserrat', system-ui, sans-serif"

export function TopBar() {
  return (
    <nav style={{ background: CHARCOAL, padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 20, fontFamily: FONT }}>
      {/* Logo */}
      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
        <span style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: "0.15em", color: GOLD, lineHeight: 1 }}>TDM</span>
        <span style={{ fontSize: "0.55rem", fontWeight: 600, letterSpacing: "0.25em", color: MUTED, textTransform: "uppercase", lineHeight: 1 }}>Tax Debt Manager</span>
      </div>

      {/* Hamburger */}
      <button style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", gap: "5px", padding: "4px" }} aria-label="Menu">
        <span style={{ display: "block", width: "22px", height: "2px", background: WHITE, borderRadius: "2px" }} />
        <span style={{ display: "block", width: "22px", height: "2px", background: WHITE, borderRadius: "2px" }} />
        <span style={{ display: "block", width: "22px", height: "2px", background: WHITE, borderRadius: "2px" }} />
      </button>
    </nav>
  )
}
