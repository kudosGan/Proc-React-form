import { useState, useEffect, useRef } from 'react'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// ── Quick prompts by page ─────────────────────────────────────
const QUICK_DEFAULT = [
  { label:'Status Summary',  q:'Give me a status breakdown' },
  { label:'Buyer Workload',  q:'Show buyer workload' },
  { label:'Pending List',    q:'Show pending signature requests' },
  { label:'Spend by Branch', q:'Show estimated spend by branch' },
  { label:'Unassigned',      q:'Which requests are unassigned?' },
  { label:'Blocked',         q:'Show blocked or on hold requests' },
]

const QUICK_ASSIGN = [
  { label:'Team Workload',    q:'Show my team workload' },
  { label:'Unassigned',       q:'Show all unassigned requests' },
  { label:'Ready to Approve', q:'Which requests are ready to approve?' },
  { label:'Status Overview',  q:'Give me a status breakdown' },
  { label:'High Priority',    q:'Show high priority requests' },
  { label:'Team Members',     q:'List my team members' },
]

// ── Client-side analytics engine ─────────────────────────────
function analyze(items, question, buyers = []) {
  const q  = question.toLowerCase()
  const st = i => i.ProgressStatus0?.Value || i.ProgressStatus?.Value || 'Unknown'

  // ── Assign & Approve page specific ────────────────────────
  if (q.includes('team member') || q.includes('my team') || q.includes('who is on') || q.includes('employees') || q.includes('staff')) {
    if (!buyers.length) return 'No team members have been added yet.'
    const rows = buyers.map(b => `• **${b.label}** — ${b.value}`).join('\n')
    return `**Your Zone Team** (${buyers.length} member${buyers.length !== 1 ? 's' : ''})\n\n${rows}`
  }

  if (q.includes('team workload') || (q.includes('workload') && (q.includes('my') || q.includes('team') || buyers.length > 0))) {
    const counts = {}
    buyers.forEach(b => { counts[b.label] = { assigned:0, inProgress:0, pending:0, completed:0 } })
    items.forEach(i => {
      const b = buyers.find(x => x.value === i.Assignt || x.label === i.Assignt)
      if (b) {
        counts[b.label].assigned++
        const s = st(i)
        if (s === 'In Progress')                                   counts[b.label].inProgress++
        else if (s === 'Pending Signature')                        counts[b.label].pending++
        else if (['Completed','Approved','Signed'].includes(s))    counts[b.label].completed++
      }
    })
    const lines = Object.entries(counts).sort((a,b) => b[1].assigned - a[1].assigned)
      .map(([name, c]) => `• **${name}**: ${c.assigned} assigned (${c.inProgress} in progress, ${c.pending} pending sig., ${c.completed} done)`)
    const unassigned = items.filter(i => !i.Assignt).length
    return `**Team Workload**\n\n${lines.join('\n')}${unassigned ? `\n\n⚠️ **${unassigned}** request${unassigned!==1?'s are':' is'} unassigned.` : ''}`
  }

  if (q.includes('ready to approve') || q.includes('can approve') || q.includes('approve suggestion') || q.includes('which requests') || q.includes('approve?')) {
    const candidates = items.filter(i => ['In Progress','Completed','Pending Signature'].includes(st(i)))
    if (!candidates.length) return 'No requests are currently in an approvable state (In Progress, Completed, or Pending Signature).'
    const rows = candidates.slice(0,12).map(i => `• **${i.Title}** — ${st(i)} — assigned to ${i.Assignt || '_Unassigned_'}`).join('\n')
    return `**${candidates.length} request${candidates.length!==1?'s':''} ready to review for approval:**\n\n${rows}${candidates.length>12?`\n\n_...and ${candidates.length-12} more._`:''}`
  }

  if (q.includes('high priority') || q.includes('priority high') || (q.includes('priority') && q.includes('high'))) {
    const list = items.filter(i => (i.Priority?.Value || '').toLowerCase() === 'high')
    if (!list.length) return 'No requests are currently marked as High priority.'
    const rows = list.slice(0,10).map(i => `• **${i.Title}** — ${st(i)} — ${i.Assignt || '_Unassigned_'}`).join('\n')
    return `**${list.length} High Priority request${list.length!==1?'s':''}:**\n\n${rows}${list.length>10?`\n\n_...and ${list.length-10} more._`:''}`
  }

  if (q.includes('suggest') || q.includes('who should i assign') || q.includes('best buyer') || q.includes('least busy') || q.includes('lightest load')) {
    if (!buyers.length) return 'No team members are on your team yet. Add employees first.'
    const counts = {}
    buyers.forEach(b => { counts[b.label] = 0 })
    items.forEach(i => {
      const b = buyers.find(x => x.value === i.Assignt || x.label === i.Assignt)
      if (b) counts[b.label]++
    })
    const sorted = Object.entries(counts).sort((a,b) => a[1]-b[1])
    const [name, num] = sorted[0]
    const lines = sorted.map(([n,c]) => `• **${n}**: ${c} request${c!==1?'s':''}`).join('\n')
    return `**Assignment Suggestion**\n\n**${name}** has the lightest load (${num} request${num!==1?'s':''}) and would be ideal for the next assignment.\n\n**Full team load:**\n${lines}`
  }

  if (q.includes('add employee') || q.includes('add member') || q.includes('new employee') || q.includes('how to add')) {
    return `To **add a new team member**, use the **Zone Team panel** on the left side of the page:\n\n1. Click **Add Employee**\n2. Enter their full name\n3. Enter their work email (e.g. name@agr.gc.ca)\n4. Click **Add**\n\nThe new member will immediately appear in the Assign dropdown for all requests.`
  }

  if (q.includes('remove') && (q.includes('employee') || q.includes('member') || q.includes('team'))) {
    return `To **remove a team member**, find them in the **Zone Team panel** on the left and click the **× button** next to their name.\n\nNote: removing a member doesn't un-assign their current requests — you'll need to reassign those separately.`
  }

  // ── General analytics (shared across all pages) ───────────
  if (q.includes('status') || q.includes('breakdown') || q.includes('overview') || q.includes('summary')) {
    const counts = {}
    items.forEach(i => { const s = st(i); counts[s] = (counts[s] || 0) + 1 })
    const lines = Object.entries(counts).sort((a,b) => b[1]-a[1]).map(([s,n]) => `• **${s}**: ${n}`)
    return `**Status Breakdown** (${items.length} total)\n\n${lines.join('\n')}`
  }
  if (q.includes('pending')) {
    const list = items.filter(i => st(i) === 'Pending Signature')
    if (!list.length) return 'No requests are currently pending signature.'
    const rows = list.slice(0,10).map(i => `• **${i.Title}** — ${i.Requester||'Unknown'} (${i.Branch||'—'})`).join('\n')
    return `**${list.length} pending signature:**\n\n${rows}${list.length>10?`\n\n_...and ${list.length-10} more._`:''}`
  }
  if (q.includes('in progress') || (q.includes('progress') && !q.includes('in'))) {
    const list = items.filter(i => st(i) === 'In Progress')
    if (!list.length) return 'No requests are currently in progress.'
    const rows = list.slice(0,10).map(i => `• **${i.Title}** — assigned to ${i.Assignt||'nobody'}`).join('\n')
    return `**${list.length} in progress:**\n\n${rows}${list.length>10?`\n\n_...and ${list.length-10} more._`:''}`
  }
  if (q.includes('buyer') || q.includes('workload') || q.includes('assigned to')) {
    const counts = {}
    items.forEach(i => { const b = i.Assignt||'Unassigned'; counts[b]=(counts[b]||0)+1 })
    const lines = Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([b,n]) => `• **${b}**: ${n} request${n!==1?'s':''}`)
    return `**Buyer Workload**\n\n${lines.join('\n')}`
  }
  if (q.includes('spend') || q.includes('cost') || q.includes('budget') || q.includes('value')) {
    const total = items.reduce((s,i) => s+(parseFloat(i.EstimatedValue)||0), 0)
    const byBranch = {}
    items.forEach(i => { const b=i.Branch||'Unknown'; byBranch[b]=(byBranch[b]||0)+(parseFloat(i.EstimatedValue)||0) })
    const lines = Object.entries(byBranch).sort((a,b)=>b[1]-a[1])
      .map(([b,v]) => `• **${b}**: $${v.toLocaleString('en-CA',{maximumFractionDigits:0})}`)
    return `**Spend Overview**\n\nTotal: **$${total.toLocaleString('en-CA',{maximumFractionDigits:0})} CAD**\n\n**By Branch:**\n${lines.join('\n')}`
  }
  if (q.includes('branch') || q.includes('department')) {
    const counts = {}
    items.forEach(i => { const b=i.Branch||'Unknown'; counts[b]=(counts[b]||0)+1 })
    const lines = Object.entries(counts).sort((a,b)=>b[1]-a[1]).map(([b,n]) => `• **${b}**: ${n}`)
    return `**By Branch**\n\n${lines.join('\n')}`
  }
  if (q.includes('unassigned')) {
    const list = items.filter(i => !i.Assignt)
    if (!list.length) return 'All requests are currently assigned to a buyer.'
    const rows = list.slice(0,10).map(i => `• **${i.Title}** — ${i.Requester||'Unknown'} (${st(i)})`).join('\n')
    return `**${list.length} unassigned:**\n\n${rows}${list.length>10?`\n\n_...and ${list.length-10} more._`:''}`
  }
  if (q.includes('blocked') || q.includes('hold') || q.includes('reject')) {
    const list = items.filter(i => ['On Hold','Rejected','Cancelled'].includes(st(i)))
    if (!list.length) return 'No blocked or rejected requests found.'
    const rows = list.slice(0,10).map(i => `• **${i.Title}** — ${st(i)} — ${i.Requester||'Unknown'}`).join('\n')
    return `**${list.length} blocked/rejected/on hold:**\n\n${rows}`
  }
  if (q.includes('total') || q.includes('how many') || q.includes('count')) {
    const pending    = items.filter(i => st(i)==='Pending Signature').length
    const inProg     = items.filter(i => st(i)==='In Progress').length
    const done       = items.filter(i => ['Completed','Approved','Signed'].includes(st(i))).length
    const unassigned = items.filter(i => !i.Assignt).length
    return `**Quick Count**\n\n• Total: **${items.length}**\n• Pending signature: **${pending}**\n• In progress: **${inProg}**\n• Completed/Approved: **${done}**\n• Unassigned: **${unassigned}**`
  }
  return null
}

// ── Simple markdown renderer ──────────────────────────────────
function MsgText({ text }) {
  return (
    <div style={{ fontFamily:'Arial', fontSize:12, lineHeight:1.7, color:'#333' }}>
      {text.split('\n').map((line, i) => {
        const html = line
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/_(.*?)_/g,       '<em>$1</em>')
        return <div key={i} dangerouslySetInnerHTML={{ __html: html || '&nbsp;' }} />
      })}
    </div>
  )
}

// ── Page-aware greeting ───────────────────────────────────────
function greeting(page) {
  if (page === 'assign-approve') {
    return "Hello! I'm **MurphyAI**.\n\nI can help you manage your team, check workloads, suggest assignments, and identify which requests are ready to approve."
  }
  return "Hello! I'm **MurphyAI**, your procurement analytics assistant.\n\nAsk me about status breakdowns, buyer workloads, spend by branch, or any procurement insight."
}

export default function MurphyAIPanel({ items: propItems = [], page = 'default', buyers = [] }) {
  const [collapsed, setCollapsed] = useState(false)
  const [items, setItems]         = useState(propItems)
  const [dataReady, setDataReady] = useState(propItems.length > 0)
  const [messages, setMessages]   = useState([{ role:'assistant', text: greeting(page) }])
  const [input, setInput]         = useState('')
  const [thinking, setThinking]   = useState(false)
  const bottomRef = useRef(null)

  const QUICK = page === 'assign-approve' ? QUICK_ASSIGN : QUICK_DEFAULT

  // Fetch data if parent didn't provide it
  useEffect(() => {
    if (propItems.length > 0) { setItems(propItems); setDataReady(true); return }
    fetch(`${BACKEND_URL}/api/manager/all-requests`, {
      method:'POST', headers:{'Content-Type':'application/json'}, body:'{}',
    })
      .then(r => r.json())
      .then(d => { if (d.success) { setItems(d.items||[]); setDataReady(true) } })
      .catch(() => {})
  }, [propItems])

  // Keep items in sync if parent loads after mount
  useEffect(() => {
    if (propItems.length > 0) { setItems(propItems); setDataReady(true) }
  }, [propItems])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, thinking])

  const addMsg = (role, text) => setMessages(prev => [...prev, { role, text }])

  const send = async (question) => {
    const q = (question || input).trim()
    if (!q || thinking) return
    setInput('')
    addMsg('user', q)
    setThinking(true)

    // Try local analytics first (passes buyers for team-aware analysis)
    const local = analyze(items, q, buyers)
    if (local) {
      await new Promise(r => setTimeout(r, 280))
      addMsg('assistant', local)
      setThinking(false)
      return
    }

    // Fall back to AI
    try {
      const pageCtx = page === 'assign-approve'
        ? `You are on the Assign & Approve page. The zone team has ${buyers.length} member(s): ${buyers.map(b => b.label).join(', ')}. You can help with: assigning requests to team members, approving/rejecting requests, managing the team, and reviewing workloads.`
        : `You are on the Manager Dashboard.`

      const systemPrompt = `You are MurphyAI, a procurement analytics assistant for AAFC (Agriculture and Agri-Food Canada).
${pageCtx}
You have ${items.length} procurement requests available.
Data snapshot: ${JSON.stringify(items.slice(0,15).map(i => ({
  id: i.Title, client: i.Requester, branch: i.Branch,
  status: i.ProgressStatus0?.Value || i.ProgressStatus?.Value,
  assignedTo: i.Assignt, estimatedValue: i.EstimatedValue, type: i.RequirementType,
})))}
Answer in plain text only (no JSON). Use bullet points for lists. Be concise.`

      const resp = await fetch(`${BACKEND_URL}/api/agent/chat`, {
        method:'POST', headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ systemPrompt, history:[{role:'user',content:q}], formData:{}, currentPage:0 }),
      })
      const data = await resp.json()
      addMsg('assistant', data.agentResponse?.message || 'Unable to process that request.')
    } catch {
      addMsg('assistant', 'Unable to reach the AI service.')
    } finally {
      setThinking(false)
    }
  }

  // ── COLLAPSED ─────────────────────────────────────────────
  if (collapsed) {
    return (
      <div style={{ width:'32px', background:'#f5f7fa', borderLeft:'1px solid #dde3f0', display:'flex', flexDirection:'column', alignItems:'center', paddingTop:12, cursor:'pointer', flexShrink:0 }}
        onClick={() => setCollapsed(false)}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom:8 }}>
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        <div style={{ writingMode:'vertical-rl', textOrientation:'mixed', color:'#185FA5', fontSize:10, fontWeight:700, fontFamily:'Arial', letterSpacing:1, marginTop:4 }}>
          MurphyAI
        </div>
      </div>
    )
  }

  // ── EXPANDED ──────────────────────────────────────────────
  return (
    <div style={{ width:'300px', flexShrink:0, background:'#ffffff', display:'flex', flexDirection:'column', borderLeft:'1px solid #dde3f0' }}>

      {/* HEADER */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'11px 14px', borderBottom:'1px solid #dde3f0', background:'#f5f7fa' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <div style={{ width:26, height:26, borderRadius:'50%', background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div style={{ color:'#185FA5', fontSize:13, fontWeight:700, fontFamily:'Arial' }}>MurphyAI</div>
            <div style={{ color:dataReady?'#1a6b3c':'#aaa', fontSize:9, fontFamily:'Arial' }}>
              {dataReady ? `✓ ${items.length} requests loaded` : 'Loading data...'}
            </div>
          </div>
        </div>
        <button onClick={() => setCollapsed(true)} style={{ background:'none', border:'none', cursor:'pointer', padding:4, color:'#aaa' }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6"/>
          </svg>
        </button>
      </div>

      {/* PAGE CONTEXT LABEL */}
      {page === 'assign-approve' && (
        <div style={{ padding:'6px 12px', background:'#e8f0fe', borderBottom:'1px solid #c2d4f8', display:'flex', alignItems:'center', gap:6 }}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          <span style={{ fontSize:10, fontWeight:600, color:'#185FA5', fontFamily:'Arial' }}>
            Assign &amp; Approve · {buyers.length} team member{buyers.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* QUICK PROMPTS */}
      <div style={{ padding:'8px 10px', borderBottom:'1px solid #eef0f4', display:'flex', flexWrap:'wrap', gap:4, background:'#fafbfd' }}>
        {QUICK.map(p => (
          <button key={p.label} onClick={() => send(p.q)} disabled={thinking} style={{
            padding:'3px 9px', background:'#e8f0fe', color:'#185FA5', border:'1px solid #c5d8f8',
            borderRadius:12, fontSize:10, fontWeight:600, cursor:thinking?'not-allowed':'pointer',
            fontFamily:'Arial', whiteSpace:'nowrap', opacity:thinking?0.5:1,
          }}>
            {p.label}
          </button>
        ))}
      </div>

      {/* CHAT */}
      <div style={{ flex:1, overflowY:'auto', padding:'12px 10px', display:'flex', flexDirection:'column', gap:8, background:'#f8faff' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display:'flex', justifyContent:msg.role==='user'?'flex-end':'flex-start', gap:6, alignItems:'flex-end' }}>
            {msg.role === 'assistant' && (
              <div style={{ width:20, height:20, borderRadius:'50%', background:'#185FA5', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:2 }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
            )}
            <div style={{
              maxWidth:'82%', padding:'8px 10px',
              background: msg.role==='user' ? '#185FA5' : '#ffffff',
              color: msg.role==='user' ? '#fff' : '#333',
              borderRadius: msg.role==='user' ? '10px 10px 3px 10px' : '10px 10px 10px 3px',
              fontSize:11, fontFamily:'Arial', lineHeight:1.6,
              border: msg.role==='assistant' ? '1px solid #dde3f0' : 'none',
              boxShadow: msg.role==='assistant' ? '0 1px 3px rgba(0,0,0,0.04)' : 'none',
            }}>
              {msg.role === 'user' ? msg.text : <MsgText text={msg.text} />}
            </div>
          </div>
        ))}

        {thinking && (
          <div style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:20, height:20, borderRadius:'50%', background:'#185FA5', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div style={{ background:'#fff', border:'1px solid #dde3f0', borderRadius:'10px 10px 10px 3px', padding:'8px 12px', boxShadow:'0 1px 3px rgba(0,0,0,0.04)' }}>
              <span style={{ display:'inline-flex', gap:3 }}>
                {[0,1,2].map(n => (
                  <span key={n} style={{
                    width:5, height:5, borderRadius:'50%', background:'#185FA5', display:'inline-block',
                    animation:`murphyPulse 1.2s ease-in-out ${n*0.2}s infinite`,
                  }} />
                ))}
              </span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* INPUT */}
      <div style={{ padding:'10px', borderTop:'1px solid #dde3f0', display:'flex', gap:6, background:'#fff' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
          placeholder={page === 'assign-approve' ? 'Ask about team, assign, approve...' : 'Ask MurphyAI...'}
          disabled={thinking}
          style={{
            flex:1, padding:'7px 10px', background: thinking ? '#f5f5f5' : '#fff',
            border:'1px solid #dde3f0', borderRadius:6, fontSize:11,
            fontFamily:'Arial', color:'#333', outline:'none',
          }}
        />
        <button onClick={() => send()} disabled={!input.trim() || thinking} style={{
          padding:'7px 12px',
          background: (!input.trim() || thinking) ? '#ccc' : '#185FA5',
          color:'#fff', border:'none', borderRadius:6, fontSize:11, fontWeight:600,
          cursor: (!input.trim() || thinking) ? 'not-allowed' : 'pointer', fontFamily:'Arial',
          transition:'background 0.15s',
        }}>
          Send
        </button>
      </div>

      <style>{`
        @keyframes murphyPulse {
          0%,100%{opacity:.3;transform:scale(.8)}
          50%{opacity:1;transform:scale(1.2)}
        }
      `}</style>
    </div>
  )
}
