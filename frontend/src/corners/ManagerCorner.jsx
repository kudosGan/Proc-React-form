import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'
import MgrDashboard    from './MgrDashboard.jsx'
import MgrAssignApprove from './MgrAssignApprove.jsx'
import MgrPowerBi      from './MgrPowerBi.jsx'

const ZONE_BADGE = {
  Central : { bg:'#f3eeff', color:'#6B3FA0', border:'#e0d4f7' },
  West    : { bg:'#e8f0fe', color:'#185FA5', border:'#c2d4f8' },
  East    : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b8ddc8' },
}

const BACK_BTN = { display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:0, fontFamily:'Arial' }

function ManagerCorner({ onBack, manager }) {
  const [screen, setScreen] = useState('menu')

  const zoneBadge = ZONE_BADGE[manager?.zone] || ZONE_BADGE.Central

  if (screen === 'dashboard')      return <MgrDashboard     manager={manager} onBack={() => setScreen('menu')} />
  if (screen === 'assign-approve') return <MgrAssignApprove manager={manager} onBack={() => setScreen('menu')} />
  if (screen === 'powerbi')        return <MgrPowerBi       manager={manager} onBack={() => setScreen('menu')} />

  const cards = [
    {
      id    : 'dashboard',
      title : 'Dashboard',
      desc  : 'Overview of all procurement requests and KPIs',
      icon  : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
      ),
    },
    {
      id    : 'assign-approve',
      title : 'Assign & Approve',
      desc  : 'Assign requests to buyers and approve or reject them',
      icon  : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 11 12 14 22 4"/>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
        </svg>
      ),
    },
    {
      id    : 'powerbi',
      title : 'Power BI Analytics',
      desc  : 'Embedded Power BI reports and procurement dashboards',
      icon  : (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6"  y1="20" x2="6"  y2="14"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="start-wrapper">
      <Header />

      <div className="start-body">

        {/* Top row: back + manager identity */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
          <button onClick={onBack} style={BACK_BTN}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Home
          </button>

          {manager && (
            <div style={{ display:'flex', alignItems:'center', gap:8, fontFamily:'Arial' }}>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontSize:11, fontWeight:600, color:'#555' }}>{manager.name}</div>
                <div style={{ fontSize:10, color:'#aaa' }}>{manager.email}</div>
              </div>
              <span style={{ fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:20, background:zoneBadge.bg, color:zoneBadge.color, border:`1px solid ${zoneBadge.border}` }}>
                {manager.zone} Zone
              </span>
              <button onClick={onBack} title="Sign out"
                style={{ background:'none', border:'1px solid #dde3f0', borderRadius:7, padding:'5px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:5, fontSize:11, color:'#888', fontFamily:'Arial' }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Sign Out
              </button>
            </div>
          )}
        </div>

        <div className="start-icon-wrap" style={{ background: '#f3eeff' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        </div>

        <h1 className="start-title" style={{ color: '#6B3FA0' }}>Manager Corner</h1>
        <p className="start-subtitle">
          Overview, assignments, analytics and AI-powered reporting
        </p>

        <div className="start-buttons">
          {cards.map(card => (
            <button key={card.id} className="start-card" onClick={() => setScreen(card.id)}>
              <div className="start-card-icon" style={{ background: '#f3eeff' }}>
                {card.icon}
              </div>
              <div className="start-card-text">
                <span className="start-card-title">{card.title}</span>
                <span className="start-card-desc">{card.desc}</span>
              </div>
              <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          ))}
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default ManagerCorner
