import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MurphyAIPanel from './MurphyAIPanel.jsx'
import SpoModal from './SpoModal.jsx'
import '../styles/start.css'
import '../styles/buyer.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const STATUS_COLORS = {
  'Pending Signature' : { bg:'#fff8e1', color:'#b45309' },
  'Signed'            : { bg:'#e8f5ee', color:'#1a6b3c' },
  'In Progress'       : { bg:'#e8f0fe', color:'#185FA5' },
  'Amended'           : { bg:'#f3eeff', color:'#6B3FA0' },
  'Completed'         : { bg:'#e8f5ee', color:'#1a6b3c' },
  'Approved'          : { bg:'#e8f5ee', color:'#1a6b3c' },
  'Rejected'          : { bg:'#fff3f3', color:'#c00'    },
  'On Hold'           : { bg:'#fff3cd', color:'#856404' },
  'Cancelled'         : { bg:'#f0f0f0', color:'#777'    },
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg:'#f0f0f0', color:'#555' }
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20, whiteSpace:'nowrap', fontFamily:'Arial' }}>
      {status || 'Unknown'}
    </span>
  )
}

function KpiCard({ label, value, color, sub }) {
  return (
    <div style={{ background:'#fff', border:`1px solid ${color}30`, borderTop:`3px solid ${color}`, borderRadius:10, padding:'16px 18px', flex:1, minWidth:120, fontFamily:'Arial', boxShadow:'0 2px 8px rgba(0,0,0,0.04)' }}>
      <div style={{ fontSize:28, fontWeight:700, color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:10, color:'#888', marginTop:5, fontWeight:600, textTransform:'uppercase', letterSpacing:0.4 }}>{label}</div>
      {sub && <div style={{ fontSize:10, color:'#bbb', marginTop:2 }}>{sub}</div>}
    </div>
  )
}

function statusOf(item) {
  return item.ProgressStatus0?.Value || item.ProgressStatus?.Value || ''
}

// ── Buyer workload stats ──────────────────────────────────────
function buildBuyerStats(items) {
  const map = {}
  items.forEach(item => {
    const buyer = item.Assignt || 'Unassigned'
    if (!map[buyer]) map[buyer] = { name: buyer, assigned:0, inProgress:0, completed:0, blocked:0, pending:0 }
    map[buyer].assigned++
    const s = statusOf(item)
    if      (s === 'In Progress')                                  map[buyer].inProgress++
    else if (['Completed','Approved','Signed'].includes(s))        map[buyer].completed++
    else if (['On Hold','Rejected','Cancelled'].includes(s))       map[buyer].blocked++
    else if (s === 'Pending Signature')                            map[buyer].pending++
  })
  return Object.values(map).sort((a,b) => b.assigned - a.assigned)
}

function NumCell({ value, color }) {
  return (
    <td style={{ textAlign:'center', fontFamily:'Arial', fontSize:13, fontWeight:700, color: value ? color : '#ccc' }}>
      {value || '—'}
    </td>
  )
}

const ZONE_BADGE = {
  Central : { bg:'#f3eeff', color:'#6B3FA0', border:'#e0d4f7' },
  West    : { bg:'#e8f0fe', color:'#185FA5', border:'#c2d4f8' },
  East    : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b8ddc8' },
}

function getPlantZone(item) {
  if (item.PlantZone) return item.PlantZone
  try {
    const fd = typeof item.FormDataJSON === 'string' ? JSON.parse(item.FormDataJSON) : item.FormDataJSON
    return fd?.plantZone || ''
  } catch { return '' }
}

export default function MgrDashboard({ onBack, manager }) {
  const [items, setItems]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [filter, setFilter]     = useState('')
  const [myZoneOnly, setMyZoneOnly] = useState(false)
  const [spoItem, setSpoItem]   = useState(null)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/manager/all-requests`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:'{}',
    })
      .then(r => r.json())
      .then(d => { if (d.success) setItems(d.items||[]); else setError(d.error || 'Unable to load requests.') })
      .catch(err => setError(`Cannot reach backend at ${BACKEND_URL} — is the server running? (${err.message})`))
      .finally(() => setLoading(false))
  }, [])

  const kpi = {
    total     : items.length,
    pending   : items.filter(i => statusOf(i)==='Pending Signature').length,
    inProgress: items.filter(i => statusOf(i)==='In Progress').length,
    completed : items.filter(i => ['Completed','Approved','Signed'].includes(statusOf(i))).length,
    other     : items.filter(i => ['Amended','Rejected','On Hold','Cancelled'].includes(statusOf(i))).length,
    totalSpend: items.reduce((s,i) => s+(parseFloat(i.EstimatedValue)||0), 0),
  }

  const buyerStats = buildBuyerStats(items)

  const displayed = items.filter(item => {
    if (myZoneOnly && manager?.zone && getPlantZone(item) !== manager.zone) return false
    if (!filter.trim()) return true
    const q = filter.toLowerCase()
    return (item.Title||'').toLowerCase().includes(q) ||
           (item.Requester||'').toLowerCase().includes(q) ||
           (item.Branch||'').toLowerCase().includes(q) ||
           (statusOf(item)).toLowerCase().includes(q)
  })

  return (
    <div className="start-wrapper">
      <Header />

      {/* MAIN ROW: content + MurphyAI side panel */}
      <div style={{ display:'flex', flex:1, overflow:'hidden', minHeight:0 }}>

        {/* ── MAIN CONTENT ────────────────────────────────────── */}
        <div className="mgr-body" style={{ flex:1, overflowY:'auto' }}>

          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:0, marginBottom:20, fontFamily:'Arial' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Manager Corner
          </button>

          <div className="mgr-page-title" style={{ display:'flex', alignItems:'center', gap:10, flexWrap:'wrap' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
            {manager?.zone && (() => { const b = ZONE_BADGE[manager.zone] || ZONE_BADGE.Central; return (
              <span style={{ fontSize:10, fontWeight:700, padding:'3px 11px', borderRadius:20, background:b.bg, color:b.color, border:`1px solid ${b.border}` }}>
                {manager.zone} Zone
              </span>
            )})()}
          </div>

          {loading && <div className="buyer-empty">Loading requests...</div>}
          {error   && <div className="buyer-error">⚠️ {error}</div>}

          {!loading && !error && (
            <>
              {/* KPI ROW */}
              <div style={{ display:'flex', gap:10, marginBottom:24, flexWrap:'wrap' }}>
                <KpiCard label="Total"            value={kpi.total}      color="#6B3FA0" />
                <KpiCard label="Pending Sig."     value={kpi.pending}    color="#b45309" />
                <KpiCard label="In Progress"      value={kpi.inProgress} color="#185FA5" />
                <KpiCard label="Completed"        value={kpi.completed}  color="#1a6b3c" />
                <KpiCard label="Other"            value={kpi.other}      color="#999" />
                <KpiCard
                  label="Est. Spend"
                  value={kpi.totalSpend>0 ? `$${kpi.totalSpend.toLocaleString('en-CA',{maximumFractionDigits:0})}` : '—'}
                  color="#6B3FA0"
                  sub="total across all"
                />
              </div>

              {/* ── BUYER WORKLOAD TABLE ─────────────────────── */}
              <div style={{ marginBottom:28 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#6B3FA0', fontFamily:'Arial', marginBottom:10 }}>
                  Buyer Workload
                </div>
                <div className="buyer-table-wrap">
                  <table className="buyer-table">
                    <thead>
                      <tr>
                        <th style={{ textAlign:'left' }}>Buyer</th>
                        <th style={{ textAlign:'center' }}>Assigned</th>
                        <th style={{ textAlign:'center' }}>In Progress</th>
                        <th style={{ textAlign:'center' }}>Completed</th>
                        <th style={{ textAlign:'center' }}>Blocked</th>
                        <th style={{ textAlign:'center' }}>Pending Sig.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {buyerStats.length === 0 ? (
                        <tr><td colSpan={6} style={{ textAlign:'center', color:'#aaa', padding:20, fontSize:12, fontFamily:'Arial' }}>No data</td></tr>
                      ) : buyerStats.map((b, i) => (
                        <tr key={i} className="buyer-table-row">
                          <td>
                            <div style={{ fontWeight:600, fontSize:12, fontFamily:'Arial', color: b.name==='Unassigned'?'#ccc':'#333' }}>{b.name}</div>
                          </td>
                          <NumCell value={b.assigned}   color="#6B3FA0" />
                          <NumCell value={b.inProgress} color="#185FA5" />
                          <NumCell value={b.completed}  color="#1a6b3c" />
                          <NumCell value={b.blocked}    color="#c00"    />
                          <NumCell value={b.pending}    color="#b45309" />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── ALL REQUESTS TABLE ───────────────────────── */}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10, flexWrap:'wrap', gap:8 }}>
                <div style={{ fontSize:13, fontWeight:700, color:'#6B3FA0', fontFamily:'Arial' }}>
                  All Requests
                  <span style={{ fontSize:11, fontWeight:400, color:'#aaa', marginLeft:8 }}>— {displayed.length} of {items.length}</span>
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  {/* My Zone Only toggle */}
                  {manager?.zone && (
                    <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:11, fontFamily:'Arial', color: myZoneOnly ? ZONE_BADGE[manager.zone]?.color : '#888',
                      background: myZoneOnly ? ZONE_BADGE[manager.zone]?.bg : '#f7f7f8',
                      border:`1px solid ${myZoneOnly ? ZONE_BADGE[manager.zone]?.border : '#eee'}`,
                      borderRadius:7, padding:'5px 10px', transition:'all 0.15s', fontWeight: myZoneOnly ? 700 : 400 }}>
                      <input type="checkbox" checked={myZoneOnly} onChange={e => setMyZoneOnly(e.target.checked)} style={{ accentColor: ZONE_BADGE[manager.zone]?.color, cursor:'pointer' }} />
                      My Zone Only ({manager.zone})
                    </label>
                  )}
                  <div style={{ display:'flex', alignItems:'center', border:'1px solid #dde3f0', borderRadius:7, overflow:'hidden', background:'#fff' }}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:9 }}>
                      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                    <input type="text" placeholder="Filter..." value={filter} onChange={e=>setFilter(e.target.value)}
                      style={{ border:'none', outline:'none', padding:'6px 9px', fontSize:11, fontFamily:'Arial', width:200, background:'transparent' }}
                    />
                    {filter && <button onClick={()=>setFilter('')} style={{ border:'none', background:'none', cursor:'pointer', padding:'0 7px', color:'#aaa', fontSize:14 }}>×</button>}
                  </div>
                </div>
              </div>

              <div className="buyer-table-wrap">
                <table className="buyer-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Client</th>
                      <th>Branch</th>
                      <th>Type</th>
                      <th>Status</th>
                      <th>Zone</th>
                      <th>Assigned To</th>
                      <th>Est. Cost</th>
                      <th>Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayed.length === 0 ? (
                      <tr><td colSpan={10} style={{ textAlign:'center', color:'#aaa', padding:32, fontFamily:'Arial', fontSize:13 }}>
                        {filter ? 'No requests match.' : 'No requests found.'}
                      </td></tr>
                    ) : displayed.map((item, i) => (
                      <tr key={i} className="buyer-table-row">
                        <td><span className="buyer-id" style={{ color:'#6B3FA0' }}>{item.Title}</span></td>
                        <td style={{ fontSize:12 }}>{item.Requester||'—'}</td>
                        <td style={{ fontSize:11 }}>{item.Branch||'—'}</td>
                        <td style={{ fontSize:11 }}>{item.RequirementType||'—'}</td>
                        <td><StatusBadge status={statusOf(item)} /></td>
                        <td>{(() => { const z = getPlantZone(item); const b = ZONE_BADGE[z]; return z && b ? <span style={{ fontSize:9, fontWeight:700, padding:'2px 7px', borderRadius:12, background:b.bg, color:b.color, border:`1px solid ${b.border}`, whiteSpace:'nowrap' }}>{z}</span> : <span style={{ color:'#ddd', fontSize:10 }}>—</span> })()}</td>
                        <td style={{ fontSize:11 }}>{item.Assignt||<span style={{ color:'#ccc' }}>Unassigned</span>}</td>
                        <td style={{ fontSize:11 }}>
                          {item.EstimatedValue ? `$${Number(item.EstimatedValue).toLocaleString('en-CA',{maximumFractionDigits:0})}` : '—'}
                        </td>
                        <td style={{ fontSize:11 }}>
                          {item.DateReceived ? new Date(item.DateReceived).toLocaleDateString('en-CA') : item.Modified ? new Date(item.Modified).toLocaleDateString('en-CA') : '—'}
                        </td>
                        <td>
                          <button
                            onClick={() => setSpoItem(item)}
                            style={{ padding:'3px 10px', background:'#f3eeff', color:'#6B3FA0', border:'1px solid #d4bff7', borderRadius:4, fontSize:10, fontWeight:600, cursor:'pointer', fontFamily:'Arial', whiteSpace:'nowrap' }}
                          >
                            SPO List
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* ── MURPHYAI SIDE PANEL ──────────────────────────────── */}
        <MurphyAIPanel items={items} />

      </div>

      <Footer />

      {/* SPO MODAL */}
      {spoItem && <SpoModal item={spoItem} onClose={() => setSpoItem(null)} />}
    </div>
  )
}
