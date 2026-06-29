import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// ── Status → colour map ───────────────────────────────────────
const STATUS_STYLE = {
  'Pending Signature' : { bg:'#fff8e1', color:'#b45309', border:'#fde68a' },
  'Signed'            : { bg:'#e8f0fe', color:'#185FA5', border:'#c2d4f8' },
  'In Progress'       : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b3ddc8' },
  'Amended'           : { bg:'#f3eeff', color:'#6B3FA0', border:'#e0d4f7' },
  'Completed'         : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b3ddc8' },
  'Approved'          : { bg:'#e8f5ee', color:'#1a6b3c', border:'#b3ddc8' },
  'Rejected'          : { bg:'#fff3f3', color:'#c00',    border:'#fcc'    },
  'On Hold'           : { bg:'#fff3cd', color:'#856404', border:'#fde68a' },
  'Cancelled'         : { bg:'#f0f0f0', color:'#777',    border:'#ddd'    },
}

// ── Progress stages ───────────────────────────────────────────
const STAGES = [
  { label:'Submitted',   icon:'📋', statuses:['Pending Signature'] },
  { label:'Signed',      icon:'✍️',  statuses:['Signed'] },
  { label:'In Progress', icon:'⚙️',  statuses:['In Progress','Amended','On Hold'] },
  { label:'Completed',   icon:'✅',  statuses:['Completed','Approved'] },
]

function getStageIdx(status) {
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (STAGES[i].statuses.includes(status)) return i
  }
  return 0
}

function statusOf(item) {
  return item?.ProgressStatus0?.Value || item?.ProgressStatus?.Value || 'Pending Signature'
}

// ── Helper: pull field from record or FormDataJSON ────────────
function fromForm(item, key) {
  try {
    const fd = typeof item.FormDataJSON === 'string'
      ? JSON.parse(item.FormDataJSON) : (item.FormDataJSON || {})
    return fd[key] || ''
  } catch { return '' }
}

export default function BORequestStatus({ onBack }) {
  const [reqId,     setReqId]     = useState('')
  const [email,     setEmail]     = useState('')
  const [searching, setSearching] = useState(false)
  const [record,    setRecord]    = useState(null)
  const [error,     setError]     = useState('')

  // ── Search + email verification ───────────────────────────
  const handleSearch = async () => {
    setError(''); setRecord(null)
    if (!reqId.trim())  { setError('Please enter your Request ID.'); return }
    if (!email.trim())  { setError('Please enter your email address.'); return }

    setSearching(true)
    try {
      const res    = await fetch(`${BACKEND_URL}/api/buyer/search`, {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ query: reqId.trim().toUpperCase() }),
      })
      const result = await res.json()

      if (!res.ok || !result.items?.length) {
        setError('Request not found. Please check your Request ID and try again.')
        return
      }

      const item = result.items[0]

      // verify email against client / business owner
      const entered = email.trim().toLowerCase()
      const checks  = [
        item.ClientEmail, item.RequesterEmail,
        item.BusinessOwnerEmail, item.OwnerEmail,
        fromForm(item, 'clientEmail'),
        fromForm(item, 'businessOwnerEmail'),
      ].map(e => (e || '').toLowerCase()).filter(Boolean)

      if (checks.length && !checks.includes(entered)) {
        setError('The email address does not match our records for this request. Please verify and try again.')
        return
      }

      setRecord(item)
    } catch {
      setError('Unable to connect to the server. Please try again later.')
    } finally {
      setSearching(false)
    }
  }

  // ── Derived values ────────────────────────────────────────
  const status      = statusOf(record)
  const stIdx       = getStageIdx(status)
  const ss          = STATUS_STYLE[status] || { bg:'#f0f0f0', color:'#555', border:'#ddd' }
  const isComplete  = ['Completed','Approved'].includes(status)
  const isRejected  = ['Rejected','Cancelled'].includes(status)
  const isOnHold    = status === 'On Hold'
  const assignedTo  = record?.Assignt || ''
  const submittedAt = record?.DateReceived
    ? new Date(record.DateReceived).toLocaleDateString('en-CA', { year:'numeric', month:'long', day:'numeric' })
    : record?.Modified
    ? new Date(record.Modified).toLocaleDateString('en-CA',   { year:'numeric', month:'long', day:'numeric' })
    : '—'

  const estimatedCost = record?.EstimatedValue
    ? `$${Number(record.EstimatedValue).toLocaleString('en-CA', { maximumFractionDigits:2 })}`
    : '—'

  const reqType = record?.RequirementType || [
    fromForm(record,'goodsSelected')        && 'Goods',
    fromForm(record,'servicesSelected')     && 'Services',
    fromForm(record,'constructionSelected') && 'Construction',
  ].filter(Boolean).join(', ') || '—'

  return (
    <div className="start-wrapper">
      <Header />

      <div className="buyer-body" style={{ maxWidth:720, margin:'0 auto' }}>

        {/* ── BACK ── */}
        <button onClick={onBack}
          style={{ display:'flex', alignItems:'center', gap:6, background:'none',
            border:'none', color:'#555', fontSize:13, cursor:'pointer',
            padding:0, marginBottom:20, fontFamily:'Arial' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Business Owner Corner
        </button>

        {/* ── TITLE ── */}
        <div className="buyer-page-title" style={{ color:'#1a6b3c', marginBottom:6 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 16 14"/>
          </svg>
          Check Request Status
        </div>
        <p style={{ fontSize:12, color:'#888', fontFamily:'Arial', marginBottom:24, marginTop:0 }}>
          Enter your Request ID and email to view the current status of your procurement request.
        </p>

        {/* ── LOOKUP FORM ── */}
        <div style={{ background:'#f8fdf9', border:'1px solid #d0ead8', borderRadius:12,
          padding:'20px 24px', marginBottom:24 }}>

          <div style={{ display:'flex', gap:12, flexWrap:'wrap' }}>
            {/* Request ID */}
            <div style={{ flex:1, minWidth:180 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600,
                color:'#1a6b3c', marginBottom:6, fontFamily:'Arial', textTransform:'uppercase', letterSpacing:.4 }}>
                Request ID
              </label>
              <input
                type="text"
                placeholder="e.g. ESC-2627-5"
                value={reqId}
                onChange={e => setReqId(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid #b3ddc8',
                  borderRadius:7, fontSize:13, fontFamily:'Arial', outline:'none',
                  boxSizing:'border-box', background:'#fff', fontWeight:600, letterSpacing:.5 }}
              />
            </div>

            {/* Email */}
            <div style={{ flex:2, minWidth:220 }}>
              <label style={{ display:'block', fontSize:11, fontWeight:600,
                color:'#1a6b3c', marginBottom:6, fontFamily:'Arial', textTransform:'uppercase', letterSpacing:.4 }}>
                Your Email Address
              </label>
              <input
                type="email"
                placeholder="your.name@agr.gc.ca"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ width:'100%', padding:'9px 12px', border:'1px solid #b3ddc8',
                  borderRadius:7, fontSize:13, fontFamily:'Arial', outline:'none',
                  boxSizing:'border-box', background:'#fff' }}
              />
            </div>

            {/* Button */}
            <div style={{ display:'flex', alignItems:'flex-end' }}>
              <button onClick={handleSearch} disabled={searching}
                style={{ padding:'9px 22px', background: searching ? '#aaa' : '#1a6b3c',
                  color:'#fff', border:'none', borderRadius:7, fontSize:13, fontWeight:600,
                  cursor: searching ? 'not-allowed' : 'pointer', fontFamily:'Arial',
                  whiteSpace:'nowrap', transition:'background .15s' }}>
                {searching ? 'Searching…' : 'Check Status'}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div style={{ marginTop:14, padding:'10px 14px', background:'#fff3f3',
              border:'1px solid #fcc', borderRadius:7, fontSize:12,
              color:'#c00', fontFamily:'Arial' }}>
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* ── STATUS RESULT ── */}
        {record && (
          <div style={{ animation:'fadeInUp .35s ease-out' }}>
            <style>{`@keyframes fadeInUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}`}</style>

            {/* ── TOP CARD — Request ID + Status badge ── */}
            <div style={{ background:'#fff', border:'1px solid #e0ead8', borderRadius:14,
              padding:'22px 26px', marginBottom:16,
              boxShadow:'0 2px 12px rgba(26,107,60,.07)' }}>

              <div style={{ display:'flex', justifyContent:'space-between',
                alignItems:'flex-start', flexWrap:'wrap', gap:12 }}>
                <div>
                  <div style={{ fontSize:10, fontWeight:600, color:'#aaa',
                    textTransform:'uppercase', letterSpacing:.6, fontFamily:'Arial' }}>
                    Request ID
                  </div>
                  <div style={{ fontSize:22, fontWeight:700, color:'#1a6b3c',
                    fontFamily:'Arial', marginTop:2, letterSpacing:.5 }}>
                    {record.Title}
                  </div>
                  <div style={{ fontSize:12, color:'#888', marginTop:4, fontFamily:'Arial' }}>
                    Submitted: {submittedAt}
                  </div>
                </div>

                {/* Status badge */}
                <div style={{ background:ss.bg, color:ss.color, border:`1.5px solid ${ss.border}`,
                  borderRadius:10, padding:'10px 20px', textAlign:'center',
                  boxShadow:'0 2px 8px rgba(0,0,0,.06)' }}>
                  <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase',
                    letterSpacing:.6, fontFamily:'Arial', marginBottom:4 }}>Current Status</div>
                  <div style={{ fontSize:16, fontWeight:700, fontFamily:'Arial' }}>{status}</div>
                </div>
              </div>
            </div>

            {/* ── PROGRESS TIMELINE ── */}
            {!isRejected && (
              <div style={{ background:'#fff', border:'1px solid #e0ead8', borderRadius:14,
                padding:'22px 26px', marginBottom:16,
                boxShadow:'0 2px 12px rgba(26,107,60,.07)' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'#555',
                  fontFamily:'Arial', marginBottom:18, textTransform:'uppercase', letterSpacing:.5 }}>
                  Progress
                </div>

                {/* Timeline */}
                <div style={{ display:'flex', alignItems:'center', position:'relative' }}>
                  {STAGES.map((stage, i) => {
                    const done    = i < stIdx
                    const current = i === stIdx
                    const upcoming = i > stIdx
                    return (
                      <div key={i} style={{ display:'flex', alignItems:'center', flex: i < STAGES.length-1 ? 1 : 'none' }}>
                        {/* Step */}
                        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', zIndex:1 }}>
                          <div style={{
                            width:42, height:42, borderRadius:'50%', display:'flex',
                            alignItems:'center', justifyContent:'center', fontSize:18,
                            border: done ? 'none' : current ? '2.5px solid #1a6b3c' : '2px solid #ddd',
                            background: done ? '#1a6b3c' : current ? '#f8fdf9' : '#fafafa',
                            boxShadow: current ? '0 0 0 4px rgba(26,107,60,.12)' : 'none',
                            transition:'all .3s',
                          }}>
                            {done ? (
                              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                                stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            ) : (
                              <span style={{ fontSize:16, opacity: upcoming ? .4 : 1 }}>{stage.icon}</span>
                            )}
                          </div>
                          <div style={{ fontSize:10, fontWeight: current ? 700 : 500,
                            color: done ? '#1a6b3c' : current ? '#1a6b3c' : '#bbb',
                            marginTop:8, fontFamily:'Arial', whiteSpace:'nowrap',
                            textAlign:'center', maxWidth:70 }}>
                            {stage.label}
                          </div>
                        </div>
                        {/* Connector line */}
                        {i < STAGES.length - 1 && (
                          <div style={{ flex:1, height:3, margin:'0 6px', marginBottom:22,
                            background: i < stIdx ? '#1a6b3c' : '#eee',
                            borderRadius:2, transition:'background .3s' }}/>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* ── INFO CARDS ── */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))',
              gap:12, marginBottom:16 }}>

              {[
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                    </svg>
                  ),
                  label: 'Assigned Buyer',
                  value: assignedTo || 'Not yet assigned',
                  faded: !assignedTo,
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                    </svg>
                  ),
                  label: 'Branch',
                  value: record.Branch || '—',
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  ),
                  label: 'Estimated Cost',
                  value: estimatedCost,
                },
                {
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
                    </svg>
                  ),
                  label: 'Type',
                  value: reqType,
                },
              ].map((card, i) => (
                <div key={i} style={{ background:'#fff', border:'1px solid #e0ead8',
                  borderRadius:10, padding:'14px 16px',
                  boxShadow:'0 1px 6px rgba(26,107,60,.05)' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:8 }}>
                    {card.icon}
                    <span style={{ fontSize:10, fontWeight:600, color:'#888',
                      textTransform:'uppercase', letterSpacing:.5, fontFamily:'Arial' }}>
                      {card.label}
                    </span>
                  </div>
                  <div style={{ fontSize:13, fontWeight:600, fontFamily:'Arial',
                    color: card.faded ? '#bbb' : '#333', wordBreak:'break-all' }}>
                    {card.value}
                  </div>
                </div>
              ))}
            </div>

            {/* ── STATUS MESSAGES ── */}

            {/* Rejected / Cancelled */}
            {isRejected && (
              <div style={{ background:'#fff3f3', border:'1px solid #fcc',
                borderRadius:12, padding:'18px 22px', fontFamily:'Arial' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#c00', marginBottom:6 }}>
                  ❌ Request {status}
                </div>
                <div style={{ fontSize:12, color:'#a00', lineHeight:1.6 }}>
                  Your procurement request has been {status.toLowerCase()}.
                  Please contact your designated procurement team for more information or to submit a new request.
                </div>
              </div>
            )}

            {/* On Hold */}
            {isOnHold && (
              <div style={{ background:'#fff3cd', border:'1px solid #fde68a',
                borderRadius:12, padding:'18px 22px', fontFamily:'Arial', marginBottom:12 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#856404', marginBottom:6 }}>
                  ⏸️ Request On Hold
                </div>
                <div style={{ fontSize:12, color:'#7a5c00', lineHeight:1.6 }}>
                  Your request is currently on hold. Your procurement team may need additional
                  information. Please check back soon or contact your procurement officer directly.
                </div>
              </div>
            )}

            {/* Completed */}
            {isComplete && (
              <div style={{ background:'#e8f5ee', border:'1px solid #b3ddc8',
                borderRadius:12, padding:'18px 22px', fontFamily:'Arial' }}>
                <div style={{ fontSize:14, fontWeight:700, color:'#1a6b3c', marginBottom:6 }}>
                  🎉 Request Completed
                </div>
                <div style={{ fontSize:12, color:'#155c30', lineHeight:1.6 }}>
                  Your procurement request has been successfully completed. Thank you for using the
                  AAFC Procurement System. Please retain your Request ID <strong>{record.Title}</strong> for your records.
                </div>
              </div>
            )}

            {/* In Progress / Not yet complete */}
            {!isComplete && !isRejected && (
              <div style={{ background:'#f0f7ff', border:'1px solid #c2d4f8',
                borderRadius:12, padding:'18px 22px', fontFamily:'Arial' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#185FA5"
                    strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                  <span style={{ fontSize:13, fontWeight:700, color:'#185FA5' }}>
                    Please check back again for status updates
                  </span>
                </div>
                <div style={{ fontSize:12, color:'#2c4a80', lineHeight:1.7 }}>
                  Your request is currently <strong>{status}</strong> and is being processed by
                  {assignedTo
                    ? <> your assigned procurement officer <strong>{assignedTo}</strong>.</>
                    : ' our procurement team and will be assigned shortly.'
                  }
                  <br/>
                  There is no action required from you at this time. You will be notified by
                  email when the status of your request changes.
                </div>
              </div>
            )}

          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
