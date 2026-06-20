import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import MurphyAIPanel from './MurphyAIPanel.jsx'
import SpoModal from './SpoModal.jsx'
import '../styles/start.css'
import '../styles/buyer.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const ZONE_STYLE = {
  Central : { bg:'#f3eeff', color:'#6B3FA0', border:'#e0d4f7', accent:'#6B3FA0', light:'#faf7ff' },
  West    : { bg:'#e8f0fe', color:'#185FA5', border:'#c2d4f8', accent:'#185FA5', light:'#f0f5ff' },
  East    : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b8ddc8', accent:'#1a6b3c', light:'#f0faf4' },
}

const STATUS_COLORS = {
  'Pending Signature':{ bg:'#fff8e1', color:'#b45309' },
  'Signed'           :{ bg:'#e8f5ee', color:'#1a6b3c' },
  'In Progress'      :{ bg:'#e8f0fe', color:'#185FA5' },
  'Amended'          :{ bg:'#f3eeff', color:'#6B3FA0' },
  'Completed'        :{ bg:'#e8f5ee', color:'#1a6b3c' },
  'Approved'         :{ bg:'#e8f5ee', color:'#1a6b3c' },
  'Rejected'         :{ bg:'#fff3f3', color:'#c00'    },
  'On Hold'          :{ bg:'#fff3cd', color:'#856404' },
}

function StatusBadge({ status }) {
  const s = STATUS_COLORS[status] || { bg:'#f0f0f0', color:'#555' }
  return (
    <span style={{ background:s.bg, color:s.color, fontSize:10, fontWeight:600, padding:'3px 8px', borderRadius:20, whiteSpace:'nowrap', fontFamily:'Arial' }}>
      {status || 'Unknown'}
    </span>
  )
}

function statusOf(item) {
  return item.ProgressStatus0?.Value || item.ProgressStatus?.Value || ''
}

function Initials({ name, color }) {
  const parts = (name || '?').split(' ')
  const init = (parts[0]?.[0] || '') + (parts[1]?.[0] || '')
  return (
    <div style={{ width:34, height:34, borderRadius:'50%', background:`${color}18`, border:`2px solid ${color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:12, fontWeight:700, color, fontFamily:'Arial', flexShrink:0, letterSpacing:0.5 }}>
      {init.toUpperCase()}
    </div>
  )
}

function getPlantZone(item) {
  if (item.PlantZone) return item.PlantZone
  try {
    const fd = typeof item.FormDataJSON === 'string' ? JSON.parse(item.FormDataJSON) : item.FormDataJSON
    return fd?.plantZone || ''
  } catch { return '' }
}

export default function MgrAssignApprove({ onBack, manager }) {
  const zoneKey  = manager?.zone || 'Central'
  const zStyle   = ZONE_STYLE[zoneKey] || ZONE_STYLE.Central

  // ── Team state (live, editable) ──────────────────────────────
  const [buyers, setBuyers]       = useState(manager?.buyers || [])
  const [addMode, setAddMode]     = useState(false)
  const [newName, setNewName]     = useState('')
  const [newEmail, setNewEmail]   = useState('')
  const [addError, setAddError]   = useState('')

  // ── Request data ─────────────────────────────────────────────
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [filter, setFilter]       = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [myZoneOnly, setMyZoneOnly]     = useState(false)
  const [rowStates, setRowStates]       = useState({})
  const [spoItem, setSpoItem]           = useState(null)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/manager/all-requests`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:'{}',
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setItems(d.items || [])
          const init = {}
          ;(d.items || []).forEach(item => {
            init[item.ID] = { assignedTo: item.Assignt || '', priority: item.Priority?.Value || '', saving: false, result: '' }
          })
          setRowStates(init)
        } else {
          setError('Unable to load requests.')
        }
      })
      .catch(() => setError('Unable to connect to server.'))
      .finally(() => setLoading(false))
  }, [])

  const setRow = (id, updates) =>
    setRowStates(prev => ({ ...prev, [id]: { ...prev[id], ...updates } }))

  const handleSave = async (item) => {
    const row = rowStates[item.ID]; if (!row) return
    setRow(item.ID, { saving: true, result: '' })
    try {
      const resp = await fetch(`${BACKEND_URL}/api/buyer/update`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ spoItemId: item.ID, fields: { assignedTo: row.assignedTo, priority: row.priority } }),
      })
      setRow(item.ID, { saving: false, result: resp.ok ? '✅ Saved' : '❌ Failed' })
    } catch { setRow(item.ID, { saving: false, result: '❌ Error' }) }
  }

  const handleDecision = async (item, decision) => {
    setRow(item.ID, { saving: true, result: '' })
    try {
      const resp = await fetch(`${BACKEND_URL}/api/manager/approve`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ spoItemId: item.ID, decision }),
      })
      const data = await resp.json()
      if (resp.ok) {
        setItems(prev => prev.map(i => i.ID === item.ID ? { ...i, ProgressStatus0: { Value: data.newStatus } } : i))
        setRow(item.ID, { saving: false, result: decision === 'approve' ? '✅ Approved' : '✅ Rejected' })
      } else {
        setRow(item.ID, { saving: false, result: '❌ Failed' })
      }
    } catch { setRow(item.ID, { saving: false, result: '❌ Error' }) }
  }

  // ── Team management ──────────────────────────────────────────
  const handleAddEmployee = () => {
    setAddError('')
    if (!newName.trim()) { setAddError('Name is required.'); return }
    if (!newEmail.trim() || !newEmail.includes('@')) { setAddError('Valid email required.'); return }
    if (buyers.find(b => b.value.toLowerCase() === newEmail.trim().toLowerCase())) {
      setAddError('This email already exists in the team.'); return
    }
    setBuyers(prev => [...prev, { label: newName.trim(), value: newEmail.trim().toLowerCase() }])
    setNewName(''); setNewEmail(''); setAddMode(false)
  }

  const handleRemoveEmployee = (value) => {
    setBuyers(prev => prev.filter(b => b.value !== value))
  }

  const displayed = items.filter(item => {
    if (myZoneOnly && manager?.zone && getPlantZone(item) !== manager.zone) return false
    const q = filter.toLowerCase()
    const matchText = !filter.trim() ||
      (item.Title||'').toLowerCase().includes(q) ||
      (item.Requester||'').toLowerCase().includes(q) ||
      (item.Branch||'').toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || statusOf(item) === filterStatus
    return matchText && matchStatus
  })

  const sel = { padding:'5px 8px', border:'1px solid #ddd', borderRadius:6, fontSize:11, fontFamily:'Arial', outline:'none', background:'#fff', cursor:'pointer' }

  return (
    <div className="start-wrapper">
      <Header />

      <div style={{ display:'flex', flex:1, overflow:'hidden', minHeight:0 }}>

        {/* ── MAIN CONTENT ───────────────────────────────────── */}
        <div className="mgr-body" style={{ flex:1, overflowY:'auto', padding:'28px 28px 28px 32px' }}>

          {/* Back + page title */}
          <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:0, marginBottom:18, fontFamily:'Arial' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Back to Manager Corner
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:24, flexWrap:'wrap' }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={zStyle.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 11 12 14 22 4"/>
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
            </svg>
            <span style={{ fontSize:20, fontWeight:700, color:'#333', fontFamily:'Arial' }}>Assign &amp; Approve</span>
            <span style={{ fontSize:10, fontWeight:700, padding:'4px 12px', borderRadius:20, background:zStyle.bg, color:zStyle.color, border:`1px solid ${zStyle.border}`, fontFamily:'Arial' }}>
              {zoneKey} Zone
            </span>
          </div>

          {/* ── TWO-COLUMN LAYOUT ─────────────────────────────── */}
          <div style={{ display:'flex', gap:20, alignItems:'flex-start' }}>

            {/* ── LEFT: TEAM PANEL ──────────────────────────── */}
            <div style={{ width:270, flexShrink:0 }}>
              <div style={{ background:'#fff', borderRadius:14, border:`1px solid ${zStyle.border}`, boxShadow:'0 2px 12px rgba(0,0,0,0.06)', overflow:'hidden' }}>

                {/* Team header */}
                <div style={{ background:`linear-gradient(135deg, ${zStyle.accent}18, ${zStyle.accent}08)`, borderBottom:`1px solid ${zStyle.border}`, padding:'14px 16px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                  <div>
                    <div style={{ fontSize:13, fontWeight:700, color:zStyle.accent, fontFamily:'Arial' }}>Zone Team</div>
                    <div style={{ fontSize:10, color:'#999', fontFamily:'Arial', marginTop:1 }}>{buyers.length} member{buyers.length !== 1 ? 's' : ''}</div>
                  </div>
                  <div style={{ width:32, height:32, borderRadius:'50%', background:zStyle.bg, border:`1px solid ${zStyle.border}`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={zStyle.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                </div>

                {/* Employee list */}
                <div style={{ padding:'10px 0', maxHeight:380, overflowY:'auto' }}>
                  {buyers.length === 0 ? (
                    <div style={{ padding:'24px 16px', textAlign:'center', color:'#bbb', fontSize:12, fontFamily:'Arial' }}>
                      No team members yet
                    </div>
                  ) : buyers.map((b, i) => (
                    <div key={b.value} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 16px', borderBottom: i < buyers.length - 1 ? '1px solid #f5f5f5' : 'none', transition:'background 0.1s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Initials name={b.label} color={zStyle.accent} />
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:12, fontWeight:600, color:'#333', fontFamily:'Arial', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.label}</div>
                        <div style={{ fontSize:10, color:'#aaa', fontFamily:'Arial', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{b.value}</div>
                      </div>
                      <button
                        onClick={() => handleRemoveEmployee(b.value)}
                        title="Remove from team"
                        style={{ width:22, height:22, borderRadius:'50%', background:'transparent', border:'1px solid #eee', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0, color:'#ccc', fontSize:13, lineHeight:1, transition:'all 0.15s' }}
                        onMouseEnter={e => { e.currentTarget.style.background='#fff3f3'; e.currentTarget.style.borderColor='#fcc'; e.currentTarget.style.color='#c00' }}
                        onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='#eee'; e.currentTarget.style.color='#ccc' }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add employee section */}
                <div style={{ borderTop:`1px solid ${zStyle.border}`, padding:'12px 16px', background:zStyle.light }}>
                  {!addMode ? (
                    <button
                      onClick={() => setAddMode(true)}
                      style={{ width:'100%', padding:'8px', background:zStyle.accent, color:'#fff', border:'none', borderRadius:8, fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Arial', display:'flex', alignItems:'center', justifyContent:'center', gap:6, transition:'opacity 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                      onMouseLeave={e => e.currentTarget.style.opacity='1'}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add Employee
                    </button>
                  ) : (
                    <div>
                      <div style={{ fontSize:11, fontWeight:600, color:zStyle.accent, marginBottom:8, fontFamily:'Arial', textTransform:'uppercase', letterSpacing:0.4 }}>New Employee</div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={newName}
                        onChange={e => { setNewName(e.target.value); setAddError('') }}
                        autoFocus
                        style={{ width:'100%', padding:'7px 10px', border:'1px solid #ddd', borderRadius:6, fontSize:12, fontFamily:'Arial', outline:'none', marginBottom:6, boxSizing:'border-box' }}
                      />
                      <input
                        type="email"
                        placeholder="email@agr.gc.ca"
                        value={newEmail}
                        onChange={e => { setNewEmail(e.target.value); setAddError('') }}
                        onKeyDown={e => e.key === 'Enter' && handleAddEmployee()}
                        style={{ width:'100%', padding:'7px 10px', border:'1px solid #ddd', borderRadius:6, fontSize:12, fontFamily:'Arial', outline:'none', marginBottom:6, boxSizing:'border-box' }}
                      />
                      {addError && (
                        <div style={{ fontSize:10, color:'#c00', marginBottom:6, fontFamily:'Arial' }}>{addError}</div>
                      )}
                      <div style={{ display:'flex', gap:6 }}>
                        <button onClick={handleAddEmployee}
                          style={{ flex:1, padding:'7px', background:zStyle.accent, color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600, cursor:'pointer', fontFamily:'Arial' }}>
                          Add
                        </button>
                        <button onClick={() => { setAddMode(false); setNewName(''); setNewEmail(''); setAddError('') }}
                          style={{ flex:1, padding:'7px', background:'none', color:'#888', border:'1px solid #ddd', borderRadius:6, fontSize:11, cursor:'pointer', fontFamily:'Arial' }}>
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {/* ── RIGHT: REQUESTS TABLE ─────────────────────── */}
            <div style={{ flex:1, minWidth:0 }}>

              {/* Filter row */}
              <div style={{ display:'flex', gap:8, marginBottom:12, flexWrap:'wrap', alignItems:'center' }}>
                <div style={{ display:'flex', alignItems:'center', border:'1px solid #dde3f0', borderRadius:8, overflow:'hidden', background:'#fff', flex:1, minWidth:180, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft:10 }}>
                    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                  </svg>
                  <input type="text" placeholder="Filter by ID, client, branch..." value={filter} onChange={e => setFilter(e.target.value)}
                    style={{ border:'none', outline:'none', padding:'8px 9px', fontSize:12, fontFamily:'Arial', flex:1, background:'transparent' }}
                  />
                  {filter && <button onClick={() => setFilter('')} style={{ border:'none', background:'none', cursor:'pointer', padding:'0 9px', color:'#aaa', fontSize:15 }}>×</button>}
                </div>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                  style={{ ...sel, padding:'8px 10px', fontSize:12, borderRadius:8, boxShadow:'0 1px 4px rgba(0,0,0,0.04)' }}>
                  <option value="all">All Statuses</option>
                  <option>Pending Signature</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>On Hold</option>
                  <option>Amended</option>
                </select>
                {/* My Zone Only toggle */}
                {manager?.zone && (
                  <label style={{ display:'flex', alignItems:'center', gap:6, cursor:'pointer', fontSize:11, fontFamily:'Arial',
                    color: myZoneOnly ? zStyle.color : '#888',
                    background: myZoneOnly ? `${zStyle.accent}12` : '#f7f7f8',
                    border:`1px solid ${myZoneOnly ? zStyle.border : '#eee'}`,
                    borderRadius:7, padding:'6px 10px', transition:'all 0.15s', fontWeight: myZoneOnly ? 700 : 400 }}>
                    <input type="checkbox" checked={myZoneOnly} onChange={e => setMyZoneOnly(e.target.checked)} style={{ accentColor: zStyle.accent, cursor:'pointer' }} />
                    My Zone ({manager.zone})
                  </label>
                )}
                <div style={{ fontSize:11, color:'#aaa', fontFamily:'Arial', whiteSpace:'nowrap', background:'#f7f7f8', padding:'6px 10px', borderRadius:7, border:'1px solid #eee' }}>
                  {displayed.length} / {items.length}
                </div>
              </div>

              {loading && (
                <div style={{ textAlign:'center', padding:'48px 20px', color:'#aaa', fontSize:13, fontFamily:'Arial' }}>
                  Loading requests...
                </div>
              )}
              {error && (
                <div style={{ background:'#fff3f3', border:'1px solid #fcc', borderRadius:10, padding:'14px 16px', color:'#c00', fontSize:13, fontFamily:'Arial' }}>
                  ⚠️ {error}
                </div>
              )}

              {!loading && !error && (
                <div style={{ background:'#fff', borderRadius:12, border:'1px solid #edf0f7', boxShadow:'0 2px 12px rgba(0,0,0,0.05)', overflow:'hidden' }}>
                  <div style={{ overflowX:'auto' }}>
                    <table style={{ width:'100%', borderCollapse:'collapse', fontFamily:'Arial' }}>
                      <thead>
                        <tr style={{ background:'#f8f9fc', borderBottom:'2px solid #edf0f7' }}>
                          {['Request ID','Client / Branch','Type','Status','Zone','Assign To','Priority','Actions',''].map((h, i) => (
                            <th key={i} style={{ padding:'11px 12px', fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:0.5, textAlign: i === 0 ? 'left' : 'left', whiteSpace:'nowrap' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {displayed.length === 0 ? (
                          <tr><td colSpan={8} style={{ textAlign:'center', color:'#bbb', padding:'40px 20px', fontSize:13 }}>
                            {filter ? 'No requests match the filter.' : 'No requests found.'}
                          </td></tr>
                        ) : displayed.map((item, i) => {
                          const row = rowStates[item.ID] || {}
                          return (
                            <tr key={i}
                              style={{ borderBottom:'1px solid #f3f4f8', transition:'background 0.1s' }}
                              onMouseEnter={e => e.currentTarget.style.background = '#fafbff'}
                              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                              <td style={{ padding:'11px 12px' }}>
                                <span style={{ fontSize:12, fontWeight:700, color:zStyle.accent, fontFamily:'Arial', letterSpacing:0.2 }}>{item.Title}</span>
                              </td>
                              <td style={{ padding:'11px 12px' }}>
                                <div style={{ fontSize:12, fontWeight:500, color:'#333' }}>{item.Requester || '—'}</div>
                                <div style={{ fontSize:10, color:'#aaa', marginTop:1 }}>{item.Branch || ''}</div>
                              </td>
                              <td style={{ padding:'11px 12px', fontSize:11, color:'#555', whiteSpace:'nowrap' }}>{item.RequirementType || '—'}</td>
                              <td style={{ padding:'11px 12px' }}><StatusBadge status={statusOf(item)} /></td>
                              <td style={{ padding:'11px 12px' }}>{(() => { const z = getPlantZone(item); const zs = ZONE_STYLE[z]; return z && zs ? <span style={{ fontSize:9, fontWeight:700, padding:'2px 8px', borderRadius:12, background:`${zs.accent}15`, color:zs.accent, border:`1px solid ${zs.border}`, whiteSpace:'nowrap' }}>{z}</span> : <span style={{ color:'#ddd', fontSize:10 }}>—</span> })()}</td>
                              <td style={{ padding:'11px 12px' }}>
                                <select style={{ ...sel, minWidth:130 }} value={row.assignedTo || ''} onChange={e => setRow(item.ID, { assignedTo: e.target.value })}>
                                  <option value="">— Unassigned —</option>
                                  {buyers.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                                </select>
                              </td>
                              <td style={{ padding:'11px 12px' }}>
                                <select style={sel} value={row.priority || ''} onChange={e => setRow(item.ID, { priority: e.target.value })}>
                                  <option value="">—</option>
                                  <option>High</option><option>Medium</option><option>Low</option>
                                </select>
                              </td>
                              <td style={{ padding:'11px 12px' }}>
                                <div style={{ display:'flex', gap:5, alignItems:'center', flexWrap:'wrap' }}>
                                  <button onClick={() => handleSave(item)} disabled={row.saving}
                                    style={{ padding:'5px 10px', background:zStyle.accent, color:'#fff', border:'none', borderRadius:5, fontSize:10, fontWeight:700, cursor:row.saving?'not-allowed':'pointer', letterSpacing:0.3 }}>
                                    {row.saving ? '...' : 'Save'}
                                  </button>
                                  <button onClick={() => handleDecision(item, 'approve')} disabled={row.saving}
                                    style={{ padding:'5px 10px', background:'#1a6b3c', color:'#fff', border:'none', borderRadius:5, fontSize:10, fontWeight:700, cursor:row.saving?'not-allowed':'pointer' }}>
                                    ✓
                                  </button>
                                  <button onClick={() => handleDecision(item, 'reject')} disabled={row.saving}
                                    style={{ padding:'5px 10px', background:'#c00', color:'#fff', border:'none', borderRadius:5, fontSize:10, fontWeight:700, cursor:row.saving?'not-allowed':'pointer' }}>
                                    ✗
                                  </button>
                                  {row.result && (
                                    <span style={{ fontSize:10, color:row.result.startsWith('✅')?'#1a6b3c':'#c00', whiteSpace:'nowrap' }}>
                                      {row.result}
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td style={{ padding:'11px 12px' }}>
                                <button onClick={() => setSpoItem(item)}
                                  style={{ padding:'4px 10px', background:zStyle.bg, color:zStyle.accent, border:`1px solid ${zStyle.border}`, borderRadius:5, fontSize:10, fontWeight:600, cursor:'pointer', whiteSpace:'nowrap' }}>
                                  SPO List
                                </button>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* ── MURPHYAI SIDE PANEL ─────────────────────────────── */}
        <MurphyAIPanel items={items} page="assign-approve" buyers={buyers} />

      </div>

      <Footer />

      {spoItem && <SpoModal item={spoItem} onClose={() => setSpoItem(null)} />}
    </div>
  )
}
