const NAV = [{ label: 'New Case', page: '005' }, { label: 'Case Register', page: '006' }, { label: 'Appointment Preparation', page: '009' }, { label: 'Get Support', page: '010' }, { label: 'Frequent Scenarios', page: '011' }, { label: 'Legal Info', page: '012' }]
export default function Layout({ children, activePage }: { children: React.ReactNode, activePage?: string }) {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>
      <nav className="bg-white border-b border-gray-100 px-6 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <img src="/src/assets/tdm-logo.png" alt="Tax Debt Manager" style={{ height: '44px', width: 'auto' }} />
        <div className="hidden md:flex items-center gap-6">
          {NAV.map(item => (<span key={item.page} style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.05em', cursor: 'pointer', color: activePage === item.page ? '#3D5C5E' : '#9ca3af', borderBottom: activePage === item.page ? '2px solid #3D5C5E' : 'none', paddingBottom: activePage === item.page ? '2px' : '0' }}>{item.label}</span>))}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#3D5C5E', fontWeight: 600 }}>Hi [firstName] 👤</div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
