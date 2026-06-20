import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MurphyAIPanel from './MurphyAIPanel.jsx'
import '../styles/start.css'
import '../styles/buyer.css'

const ENV_URL = import.meta.env.VITE_POWERBI_URL || ''

export default function MgrPowerBi({ onBack }) {
  const [embedUrl, setEmbedUrl] = useState(ENV_URL)
  const [inputUrl, setInputUrl] = useState(ENV_URL)
  const [applied, setApplied]   = useState(!!ENV_URL)

  const handleApply = () => {
    const url = inputUrl.trim()
    if (!url) return
    setEmbedUrl(url)
    setApplied(true)
  }

  return (
    <div className="start-wrapper">
      <Header />

      <div style={{ display:'flex', flex:1, overflow:'hidden', minHeight:0 }}>

        {/* ── MAIN CONTENT ───────────────────────────────────── */}
        <div className="mgr-body" style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>

          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:0, marginBottom:20, fontFamily:'Arial' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Manager Corner
          </button>

          <div className="mgr-page-title">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6"  y1="20" x2="6"  y2="14"/>
            </svg>
            Power BI Analytics
          </div>

          {/* URL CONFIG */}
          <div style={{ background:'#f8f4ff', border:'1px solid #e0d4f7', borderRadius:10, padding:'12px 16px', marginBottom:16, fontFamily:'Arial' }}>
            <div style={{ fontSize:11, fontWeight:600, color:'#6B3FA0', marginBottom:7, textTransform:'uppercase', letterSpacing:0.4 }}>Power BI Embed URL</div>
            <div style={{ display:'flex', gap:8, alignItems:'center', flexWrap:'wrap' }}>
              <input
                type="text"
                placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
                value={inputUrl}
                onChange={e=>setInputUrl(e.target.value)}
                onKeyDown={e=>e.key==='Enter'&&handleApply()}
                style={{ flex:1, minWidth:200, padding:'7px 11px', border:'1px solid #ccc', borderRadius:6, fontSize:12, fontFamily:'Arial', outline:'none' }}
              />
              <button onClick={handleApply}
                style={{ padding:'7px 16px', background:'#6B3FA0', color:'#fff', border:'none', borderRadius:6, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Arial', whiteSpace:'nowrap' }}>
                Load Report
              </button>
              {applied && (
                <button onClick={()=>{setEmbedUrl('');setInputUrl('');setApplied(false)}}
                  style={{ padding:'7px 11px', background:'none', color:'#999', border:'1px solid #ddd', borderRadius:6, fontSize:12, cursor:'pointer', fontFamily:'Arial' }}>
                  Reset
                </button>
              )}
            </div>
            <div style={{ fontSize:10, color:'#999', marginTop:5 }}>
              Tip: set <code style={{ background:'#eee', padding:'1px 4px', borderRadius:3 }}>VITE_POWERBI_URL</code> in <code style={{ background:'#eee', padding:'1px 4px', borderRadius:3 }}>.env</code> to skip this step.
            </div>
          </div>

          {/* IFRAME or PLACEHOLDER */}
          {applied && embedUrl ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column' }}>
              <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:6 }}>
                <a href={embedUrl} target="_blank" rel="noopener noreferrer"
                  style={{ fontSize:11, color:'#6B3FA0', textDecoration:'none', fontFamily:'Arial', display:'flex', alignItems:'center', gap:4 }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2h6"/>
                    <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                  </svg>
                  Open in new tab
                </a>
              </div>
              <iframe
                src={embedUrl}
                title="Power BI Report"
                style={{ flex:1, minHeight:480, border:'1px solid #e0d4f7', borderRadius:10, display:'block', width:'100%' }}
                allowFullScreen
              />
            </div>
          ) : (
            <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <div style={{ textAlign:'center', border:'2px dashed #d4bff7', borderRadius:12, padding:'48px 40px', background:'#faf7ff', maxWidth:420 }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4bff7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:12 }}>
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6"  y1="20" x2="6"  y2="14"/>
                </svg>
                <div style={{ fontSize:14, fontWeight:600, color:'#6B3FA0', marginBottom:6, fontFamily:'Arial' }}>No report loaded</div>
                <div style={{ fontSize:12, color:'#888', fontFamily:'Arial', lineHeight:1.6 }}>
                  Paste your Power BI embed URL above and click <strong>Load Report</strong>.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── MURPHYAI SIDE PANEL ─────────────────────────────── */}
        <MurphyAIPanel />

      </div>

      <Footer />
    </div>
  )
}
