import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'

const DIRECTOR = { email: 'kudas.ganesan@agr.gc.ca', password: '123456', name: 'Kudas Ganesan', title: 'Director, Procurement Services' }

export default function DirectorLogin({ onBack, onLogin }) {
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const handleSubmit = () => {
    setError('')
    if (!email.trim() || !password)  { setError('Please enter your email and password.'); return }

    setLoading(true)
    setTimeout(() => {
      if (
        email.trim().toLowerCase() === DIRECTOR.email.toLowerCase() &&
        password === DIRECTOR.password
      ) {
        onLogin({ email: DIRECTOR.email, name: DIRECTOR.name, title: DIRECTOR.title })
      } else {
        setError('Invalid email or password. Please try again.')
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="start-wrapper">
      <Header />

      <div className="start-body">
        {/* back */}
        <button onClick={onBack}
          style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none',
            color:'#555', fontSize:13, cursor:'pointer', padding:0, marginBottom:24, fontFamily:'Arial' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </button>

        {/* icon */}
        <div style={{ width:64, height:64, borderRadius:'50%', background:'#f0f0f0',
          border:'2px solid #888', display:'flex', alignItems:'center', justifyContent:'center',
          marginBottom:14 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#666"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>

        <h1 className="start-title" style={{ fontSize:20, margin:'0 0 4px 0', color:'#444' }}>
          Director Portal
        </h1>
        <p style={{ fontSize:12, color:'#888', fontFamily:'Arial', margin:'0 0 28px 0', textAlign:'center' }}>
          Restricted access — authorized personnel only
        </p>

        {/* login card */}
        <div style={{ width:'100%', maxWidth:380, background:'#fff', border:'1px solid #ddd',
          borderRadius:12, padding:'28px 28px', boxShadow:'0 2px 16px rgba(0,0,0,.07)' }}>

          <div style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555',
              marginBottom:6, fontFamily:'Arial', textTransform:'uppercase', letterSpacing:.4 }}>
              Email Address
            </label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="director@agr.gc.ca"
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:7,
                fontSize:13, fontFamily:'Arial', outline:'none', boxSizing:'border-box' }}
              autoFocus
            />
          </div>

          <div style={{ marginBottom:20 }}>
            <label style={{ display:'block', fontSize:11, fontWeight:600, color:'#555',
              marginBottom:6, fontFamily:'Arial', textTransform:'uppercase', letterSpacing:.4 }}>
              Password
            </label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="••••••"
              style={{ width:'100%', padding:'10px 12px', border:'1px solid #ddd', borderRadius:7,
                fontSize:13, fontFamily:'Arial', outline:'none', boxSizing:'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background:'#fff3f3', border:'1px solid #fcc', borderRadius:7,
              padding:'8px 12px', fontSize:12, color:'#c00', fontFamily:'Arial', marginBottom:16 }}>
              ⚠️ {error}
            </div>
          )}

          <button onClick={handleSubmit} disabled={loading}
            style={{ width:'100%', padding:'11px', background: loading ? '#aaa' : '#444',
              color:'#fff', border:'none', borderRadius:7, fontSize:14, fontWeight:600,
              cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Arial', transition:'background .15s' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </div>
      </div>

      <Footer />
    </div>
  )
}
