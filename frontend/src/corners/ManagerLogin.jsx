import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'

// ── Manager credentials & zone config ──────────────────────────
const MANAGERS = [
  { email: 'kudas.ganesan@agr.gc.ca',  name: 'Kudas Ganesan',  zone: 'Central' },
  { email: 'chris.ragasa@agr.gc.ca',   name: 'Chris Ragasa',   zone: 'West'    },
  { email: 'michael.frost@agr.gc.ca',  name: 'Michael Frost',  zone: 'East'    },
]

const PASSWORD = '123456'

export const ZONE_CONFIG = {
  Central: {
    color  : '#6B3FA0',
    buyers : [
      { label: 'Kudas Ganesan',  value: 'kudas.ganesan@agr.gc.ca'  },
      { label: 'Employee C-2',   value: 'employeec2@agr.gc.ca'     },
      { label: 'Employee C-3',   value: 'employeec3@agr.gc.ca'     },
      { label: 'Employee C-4',   value: 'employeec4@agr.gc.ca'     },
      { label: 'Employee C-5',   value: 'employeec5@agr.gc.ca'     },
    ],
  },
  West: {
    color  : '#185FA5',
    buyers : [
      { label: 'Chris Ragasa',   value: 'chris.ragasa@agr.gc.ca'   },
      { label: 'Employee W-2',   value: 'employeew2@agr.gc.ca'     },
      { label: 'Employee W-3',   value: 'employeew3@agr.gc.ca'     },
      { label: 'Employee W-4',   value: 'employeew4@agr.gc.ca'     },
      { label: 'Employee W-5',   value: 'employeew5@agr.gc.ca'     },
    ],
  },
  East: {
    color  : '#1a6b3c',
    buyers : [
      { label: 'Michael Frost',  value: 'michael.frost@agr.gc.ca'  },
      { label: 'Employee E-2',   value: 'employeee2@agr.gc.ca'     },
      { label: 'Employee E-3',   value: 'employeee3@agr.gc.ca'     },
      { label: 'Employee E-4',   value: 'employeee4@agr.gc.ca'     },
      { label: 'Employee E-5',   value: 'employeee5@agr.gc.ca'     },
    ],
  },
}

// ── Zone badge colours ──────────────────────────────────────────
const ZONE_BADGE = {
  Central : { bg:'#f3eeff', color:'#6B3FA0', border:'#e0d4f7' },
  West    : { bg:'#e8f0fe', color:'#185FA5', border:'#c2d4f8' },
  East    : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b8ddc8' },
}

const INPUT_STYLE = {
  width:'100%', padding:'10px 12px', border:'1px solid #dde3f0',
  borderRadius:8, fontSize:13, fontFamily:'Arial', outline:'none',
  boxSizing:'border-box',
}

export default function ManagerLogin({ onBack, onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSignIn = () => {
    setError('')
    const mgr = MANAGERS.find(m => m.email.toLowerCase() === email.trim().toLowerCase())
    if (!mgr || password !== PASSWORD) {
      setError('Invalid email or password. Please try again.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onLogin({
        email  : mgr.email,
        name   : mgr.name,
        zone   : mgr.zone,
        color  : ZONE_CONFIG[mgr.zone].color,
        buyers : ZONE_CONFIG[mgr.zone].buyers,
      })
    }, 400)
  }

  return (
    <div className="start-wrapper">
      <Header />

      <div className="start-body">

        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:0, marginBottom:28, fontFamily:'Arial' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </button>

        {/* ── LOGIN CARD ─────────────────────────────────────── */}
        <div style={{ maxWidth:400, margin:'0 auto', background:'#fff', borderRadius:14, boxShadow:'0 4px 28px rgba(107,63,160,0.13)', border:'1px solid #e8dffa', padding:'36px 36px 30px', fontFamily:'Arial' }}>

          {/* Icon + title */}
          <div style={{ textAlign:'center', marginBottom:22 }}>
            <div style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:58, height:58, borderRadius:'50%', background:'#f3eeff', marginBottom:12 }}>
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div style={{ fontSize:20, fontWeight:700, color:'#6B3FA0', marginBottom:4 }}>Manager Corner</div>
            <div style={{ fontSize:12, color:'#888' }}>Sign in to access your zone dashboard</div>
          </div>

          {/* Zone badges */}
          <div style={{ display:'flex', gap:6, justifyContent:'center', marginBottom:24 }}>
            {Object.entries(ZONE_BADGE).map(([zone, s]) => (
              <span key={zone} style={{ fontSize:10, fontWeight:600, padding:'3px 11px', borderRadius:20, background:s.bg, color:s.color, border:`1px solid ${s.border}` }}>
                {zone}
              </span>
            ))}
          </div>

          {/* Email */}
          <div style={{ marginBottom:14 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#444', marginBottom:5, textTransform:'uppercase', letterSpacing:0.4 }}>
              Work Email
            </label>
            <input
              type="email"
              placeholder="name@agr.gc.ca"
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              autoFocus
              style={INPUT_STYLE}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#444', marginBottom:5, textTransform:'uppercase', letterSpacing:0.4 }}>
              Password
            </label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={e => { setPassword(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleSignIn()}
              style={INPUT_STYLE}
            />
          </div>

          {/* Error */}
          {error && (
            <div style={{ background:'#fff3f3', border:'1px solid #fcc', borderRadius:7, padding:'8px 12px', fontSize:12, color:'#c00', marginBottom:14, display:'flex', alignItems:'center', gap:6 }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* Sign In */}
          <button
            onClick={handleSignIn}
            disabled={loading}
            style={{ width:'100%', padding:'11px', background: loading ? '#c9aef0' : '#6B3FA0', color:'#fff', border:'none', borderRadius:8, fontSize:14, fontWeight:600, cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Arial', transition:'background 0.15s' }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>

          <div style={{ fontSize:11, color:'#ccc', textAlign:'center', marginTop:16 }}>
            Access restricted to authorized procurement managers
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}
