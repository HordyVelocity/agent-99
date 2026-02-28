import { TdmHeader } from './TdmHeader'

export default function Layout({ children, activePage: _activePage }: { children: React.ReactNode, activePage?: string }) {
  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F4", fontFamily: "'Montserrat', system-ui, sans-serif" }}>
      <TdmHeader />
      <main>{children}</main>
    </div>
  )
}
