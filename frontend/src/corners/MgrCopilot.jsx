import { useState, useEffect, useRef } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// ── Client-side analytics engine ─────────────────────────────
function analyze(items, question) {
  const q = question.toLowerCase()
  const statusOf = i => i.ProgressStatus0?.Value || i.ProgressStatus?.Value || 'Unknown'

  // Status breakdown
  if (q.includes('status') || q.includes('breakdown') || q.includes('overview') || q.includes('summary')) {
    const counts = {}
    items.forEach(i => { const s = statusOf(i); counts[s] = (counts[s] || 0) + 1 })
    const lines = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([s, n]) => `• **${s}**: ${n}`)
    return `**Status Breakdown** (${items.length} total)\n\n${lines.join('\n')}`
  }

  // Pending
  if (q.includes('pending')) {
    const list = items.filter(i => statusOf(i) === 'Pending Signature')
    if (!list.length) return 'No requests are currently pending signature.'
    const rows = list.slice(0, 10).map(i => `• **${i.Title}** — ${i.Requester || 'Unknown'} (${i.Branch || '—'})`).join('\n')
    return `**${list.length} request${list.length !== 1 ? 's' : ''} pending signature:**\n\n${rows}${list.length > 10 ? `\n\n_...and ${list.length - 10} more._` : ''}`
  }

  // In progress
  if (q.includes('in progress') || q.includes('progress')) {
    const list = items.filter(i => statusOf(i) === 'In Progress')
    if (!list.length) return 'No requests are currently in progress.'
    const rows = list.slice(0, 10).map(i => `• **${i.Title}** — ${i.Requester || 'Unknown'}, assigned to ${i.Assignt || 'nobody'}`).join('\n')
    return `**${list.length} request${list.length !== 1 ? 's' : ''} in progress:**\n\n${rows}${list.length > 10 ? `\n\n_...and ${list.length - 10} more._` : ''}`
  }

  // Buyer workload
  if (q.includes('buyer') || q.includes('assign') || q.includes('workload')) {
    const counts = {}
    items.forEach(i => { const b = i.Assignt || 'Unassigned'; counts[b] = (counts[b] || 0) + 1 })
    const lines = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([b,n]) => `• **${b}**: ${n} request${n !== 1 ? 's' : ''}`)
    return `**Buyer Workload**\n\n${lines.join('\n')}`
  }

  // Spend / cost
  if (q.includes('spend') || q.includes('cost') || q.includes('value') || q.includes('budget')) {
    const total = items.reduce((s, i) => s + (parseFloat(i.EstimatedValue) || 0), 0)
    const byBranch = {}
    items.forEach(i => {
      const b = i.Branch || 'Unknown Branch'
      byBranch[b] = (byBranch[b] || 0) + (parseFloat(i.EstimatedValue) || 0)
    })
    const lines = Object.entries(byBranch).sort((a,b) => b[1]-a[1])
      .map(([b, v]) => `• **${b}**: $${v.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`)
    const fmt = `$${total.toLocaleString('en-CA', { maximumFractionDigits: 0 })}`
    return `**Estimated Spend Overview**\n\nTotal across all requests: **${fmt} CAD**\n\n**By Branch:**\n${lines.join('\n')}`
  }

  // Branch breakdown
  if (q.includes('branch') || q.includes('department')) {
    const counts = {}
    items.forEach(i => { const b = i.Branch || 'Unknown'; counts[b] = (counts[b] || 0) + 1 })
    const lines = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([b, n]) => `• **${b}**: ${n}`)
    return `**Requests by Branch**\n\n${lines.join('\n')}`
  }

  // Type breakdown (Goods/Services/Construction)
  if (q.includes('type') || q.includes('goods') || q.includes('service') || q.includes('construction')) {
    const counts = {}
    items.forEach(i => { const t = i.RequirementType || 'Unknown'; counts[t] = (counts[t] || 0) + 1 })
    const lines = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([t, n]) => `• **${t}**: ${n}`)
    return `**Requests by Type**\n\n${lines.join('\n')}`
  }

  // Unassigned
  if (q.includes('unassigned')) {
    const list = items.filter(i => !i.Assignt)
    if (!list.length) return 'All requests are currently assigned.'
    const rows = list.slice(0, 10).map(i => `• **${i.Title}** — ${i.Requester || 'Unknown'} (${statusOf(i)})`).join('\n')
    return `**${list.length} unassigned request${list.length !== 1 ? 's' : ''}:**\n\n${rows}${list.length > 10 ? `\n\n_...and ${list.length - 10} more._` : ''}`
  }

  // Total count
  if (q.includes('total') || q.includes('how many') || q.includes('count')) {
    const pending = items.filter(i => statusOf(i) === 'Pending Signature').length
    const inProg  = items.filter(i => statusOf(i) === 'In Progress').length
    const done    = items.filter(i => ['Completed','Approved','Signed'].includes(statusOf(i))).length
    return `**Quick Count**\n\n• Total requests: **${items.length}**\n• Pending signature: **${pending}**\n• In progress: **${inProg}**\n• Completed / Approved / Signed: **${done}**`
  }

  return null // No local match — let backend handle it
}

// ── Simple markdown renderer ──────────────────────────────────
function MsgText({ text }) {
  const lines = text.split('\n')
  return (
    <div style={{ fontFamily:'Arial', fontSize:12, lineHeight:1.7, color:'#333' }}>
      {lines.map((line, i) => {
        const bold = line.replace(/\*\*(.*?)\*\*/g, (_, m) => `<strong>${m}</strong>`)
        const italic = bold.replace(/_(.*?)_/g, (_, m) => `<em>${m}</em>`)
        return (
          <div key={i} dangerouslySetInnerHTML={{ __html: italic || '&nbsp;' }} />
        )
      })}
    </div>
  )
}

const QUICK_PROMPTS = [
  { label: 'Status Summary',  q: 'Give me a status breakdown of all requests' },
  { label: 'Pending List',    q: 'Show me all pending signature requests' },
  { label: 'Buyer Workload',  q: 'Show buyer workload and assignments' },
  { label: 'Spend by Branch', q: 'Show estimated spend by branch' },
  { label: 'Unassigned',      q: 'Which requests are unassigned?' },
  { label: 'Total Count',     q: 'How many requests do we have in total?' },
]

function MgrCopilot({ onBack }) {
  const [items, setItems]     = useState([])
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataError, setDataError]   = useState(false)
  const [messages, setMessages]     = useState([
    { role: 'assistant', text: 'Hello! I\'m **MurphyAI**, your procurement analytics assistant. I have access to all your requests. Ask me about status summaries, buyer workloads, spending by branch, unassigned requests, or anything else about your procurement data.' }
  ])
  const [input, setInput]     = useState('')
  const [thinking, setThinking] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/manager/all-requests`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}',
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) { setItems(d.items || []); setDataLoaded(true) }
        else setDataError(true)
      })
      .catch(() => setDataError(true))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, thinking])

  const addMsg = (role, text) => setMessages(prev => [...prev, { role, text }])

  const send = async (question) => {
    const q = question || input.trim()
    if (!q || thinking) return
    setInput('')
    addMsg('user', q)
    setThinking(true)

    // Try local analytics first
    if (dataLoaded && items.length > 0) {
      const localAnswer = analyze(items, q)
      if (localAnswer) {
        await new Promise(r => setTimeout(r, 300)) // brief "thinking" pause
        addMsg('assistant', localAnswer)
        setThinking(false)
        return
      }
    }

    // Fall back to AI backend
    try {
      const systemPrompt = `You are a procurement analytics assistant for a Canadian government department (AAFC).
You have access to ${items.length} procurement requests.
Current data summary: ${JSON.stringify(items.slice(0, 20).map(i => ({
  id: i.Title, client: i.Requester, branch: i.Branch, status: i.ProgressStatus0?.Value || i.ProgressStatus?.Value,
  assignedTo: i.Assignt, estimatedValue: i.EstimatedValue, type: i.RequirementType,
})))}
Provide concise, data-driven answers. Format with bullet points when listing items.
Respond ONLY with a plain text answer — no JSON, no action tags, no thoughts field.`

      const resp = await fetch(`${BACKEND_URL}/api/agent/chat`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt,
          history    : [{ role: 'user', content: q }],
          formData   : {},
          currentPage: 0,
        }),
      })
      const data = await resp.json()
      const msg = data.agentResponse?.message || 'I was unable to process that request.'
      addMsg('assistant', msg)
    } catch {
      addMsg('assistant', 'Unable to reach the AI service. Please check your connection.')
    } finally {
      setThinking(false)
    }
  }

  return (
    <div className="start-wrapper">
      <Header />

      <div className="mgr-body" style={{ display:'flex', flexDirection:'column', maxWidth:900 }}>

        <button onClick={onBack} style={{ display:'flex', alignItems:'center', gap:6, background:'none', border:'none', color:'#555', fontSize:13, cursor:'pointer', padding:0, marginBottom:20, fontFamily:'Arial' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Manager Corner
        </button>

        <div className="mgr-page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          MurphyAI
          <span style={{ marginLeft:'auto', fontSize:11, fontWeight:400, color: dataLoaded ? '#1a6b3c' : dataError ? '#c00' : '#aaa', fontFamily:'Arial' }}>
            {dataLoaded ? `✓ ${items.length} requests loaded` : dataError ? '⚠ Data unavailable' : 'Loading data...'}
          </span>
        </div>

        {/* QUICK PROMPTS */}
        <div style={{ display:'flex', gap:6, flexWrap:'wrap', marginBottom:14 }}>
          {QUICK_PROMPTS.map(p => (
            <button
              key={p.label}
              onClick={() => send(p.q)}
              disabled={thinking}
              style={{
                padding    : '5px 12px',
                background : '#f3eeff',
                color      : '#6B3FA0',
                border     : '1px solid #d4bff7',
                borderRadius: 20,
                fontSize   : 11,
                fontWeight : 600,
                cursor     : thinking ? 'not-allowed' : 'pointer',
                fontFamily : 'Arial',
                whiteSpace : 'nowrap',
                opacity    : thinking ? 0.5 : 1,
              }}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* CHAT HISTORY */}
        <div style={{
          flex        : 1,
          overflowY   : 'auto',
          border      : '1px solid #e0d4f7',
          borderRadius: 10,
          padding     : '16px',
          background  : '#faf7ff',
          marginBottom: 12,
          minHeight   : 380,
          maxHeight   : 'calc(100vh - 440px)',
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display      : 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom : 12,
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width:28, height:28, borderRadius:'50%', background:'#6B3FA0', flexShrink:0,
                  display:'flex', alignItems:'center', justifyContent:'center', marginRight:8, marginTop:2,
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
              )}
              <div style={{
                maxWidth     : '78%',
                background   : msg.role === 'user' ? '#6B3FA0' : '#fff',
                color        : msg.role === 'user' ? '#fff' : '#333',
                borderRadius : msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                padding      : '10px 14px',
                boxShadow    : '0 1px 4px rgba(0,0,0,0.06)',
                fontSize     : 12,
                fontFamily   : 'Arial',
                lineHeight   : 1.6,
              }}>
                {msg.role === 'user' ? msg.text : <MsgText text={msg.text} />}
              </div>
            </div>
          ))}

          {thinking && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'#6B3FA0', display:'flex', alignItems:'center', justifyContent:'center' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div style={{ background:'#fff', borderRadius:'12px 12px 12px 4px', padding:'10px 16px', boxShadow:'0 1px 4px rgba(0,0,0,0.06)' }}>
                <span style={{ display:'inline-flex', gap:4, alignItems:'center' }}>
                  {[0,1,2].map(n => (
                    <span key={n} style={{
                      width:6, height:6, borderRadius:'50%', background:'#6B3FA0',
                      animation:`pulse 1.2s ease-in-out ${n*0.2}s infinite`,
                      display:'inline-block',
                    }} />
                  ))}
                </span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <input
            type="text"
            placeholder="Ask about pending requests, spend by branch, buyer workload..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            disabled={thinking}
            style={{
              flex        : 1,
              padding     : '10px 14px',
              border      : '1px solid #d4bff7',
              borderRadius: 8,
              fontSize    : 13,
              fontFamily  : 'Arial',
              outline     : 'none',
              background  : thinking ? '#f5f5f5' : '#fff',
            }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || thinking}
            style={{
              padding     : '10px 20px',
              background  : (!input.trim() || thinking) ? '#ccc' : '#6B3FA0',
              color       : '#fff',
              border      : 'none',
              borderRadius: 8,
              fontSize    : 13,
              fontWeight  : 600,
              cursor      : (!input.trim() || thinking) ? 'not-allowed' : 'pointer',
              fontFamily  : 'Arial',
              whiteSpace  : 'nowrap',
              transition  : 'background 0.15s',
            }}
          >
            Send
          </button>
        </div>

      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>

      <Footer />
    </div>
  )
}

export default MgrCopilot
