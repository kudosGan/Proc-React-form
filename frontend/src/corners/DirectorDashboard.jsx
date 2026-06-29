import { useState, useEffect, useCallback } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const ZONES = {
  Central : { label: 'Central Zone', manager: 'Kudas Ganesan',   color: '#6B3FA0', bg: '#f5f0fa', border: '#c9aff0' },
  East    : { label: 'East Zone',    manager: 'Michael Frost',   color: '#185FA5', bg: '#eef4fb', border: '#a9c8f0' },
  West    : { label: 'West Zone',    manager: 'Chris Ragasa',    color: '#1a6b3c', bg: '#e8f5ee', border: '#94d1ae' },
}

function getZone(item) {
  if (item.PlantZone) return item.PlantZone
  try {
    const fd = typeof item.FormDataJSON === 'string'
      ? JSON.parse(item.FormDataJSON)
      : (item.FormDataJSON || {})
    return fd.plantZone || ''
  } catch { return '' }
}

function getStatus(item) {
  return (item.Status || item.status || '').trim()
}

function statusClass(s) {
  const ls = s.toLowerCase()
  if (ls.includes('complet') || ls === 'approved') return 'completed'
  if (ls.includes('progress'))                      return 'inprogress'
  if (ls.includes('hold'))                          return 'onhold'
  if (ls.includes('reject') || ls.includes('cancel')) return 'rejected'
  if (ls.includes('sign') || ls.includes('pend'))   return 'pending'
  return 'new'
}

function zoneStats(items) {
  const total      = items.length
  const completed  = items.filter(i => ['completed', 'approved'].includes(statusClass(getStatus(i)))).length
  const inProgress = items.filter(i => statusClass(getStatus(i)) === 'inprogress').length
  const pending    = items.filter(i => statusClass(getStatus(i)) === 'pending').length
  const onHold     = items.filter(i => statusClass(getStatus(i)) === 'onhold').length
  const rejected   = items.filter(i => statusClass(getStatus(i)) === 'rejected').length
  const unassigned = items.filter(i => !i.Assignt && !i.AssignedTo).length
  const newItems   = items.filter(i => statusClass(getStatus(i)) === 'new').length
  const spend      = items.reduce((s, i) => s + (parseFloat(i.EstimatedValue || i.estimatedValue) || 0), 0)
  const progress   = total ? Math.round((completed / total) * 100) : 0
  return { total, completed, inProgress, pending, onHold, rejected, unassigned, newItems, spend, progress }
}

function fmt(n) {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(n)
}

function ProgressBar({ pct, color }) {
  return (
    <div style={{ height: 8, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden', margin: '8px 0' }}>
      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, transition: 'width .5s' }} />
    </div>
  )
}

function KpiChip({ label, value, color, badge }) {
  return (
    <div style={{ flex: '1 1 120px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10,
      padding: '12px 14px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,.05)', minWidth: 110 }}>
      <div style={{ fontSize: 22, fontWeight: 700, color: color || '#111', fontFamily: 'Arial' }}>
        {value}
        {badge && <span style={{ fontSize: 11, fontWeight: 400, color: '#888', marginLeft: 3 }}>{badge}</span>}
      </div>
      <div style={{ fontSize: 11, color: '#666', fontFamily: 'Arial', marginTop: 2 }}>{label}</div>
    </div>
  )
}

function ZoneCard({ zoneName, items, cfg }) {
  const s = zoneStats(items)
  return (
    <div style={{ flex: '1 1 280px', background: cfg.bg, border: `1.5px solid ${cfg.border}`,
      borderRadius: 14, padding: '18px 20px', boxSizing: 'border-box' }}>

      {/* zone header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: cfg.color,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 700, fontSize: 15, fontFamily: 'Arial', flexShrink: 0 }}>
          {zoneName[0]}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111', fontFamily: 'Arial' }}>{cfg.label}</div>
          <div style={{ fontSize: 11, color: '#666', fontFamily: 'Arial' }}>Manager: {cfg.manager}</div>
        </div>
        {s.unassigned > 0 && (
          <span title="Unassigned requests need attention"
            style={{ marginLeft: 'auto', background: '#fef3cd', border: '1px solid #f0ad4e',
              borderRadius: 20, fontSize: 10, color: '#856404', padding: '2px 8px', fontFamily: 'Arial', fontWeight: 600 }}>
            ⚠ {s.unassigned} unassigned
          </span>
        )}
      </div>

      {/* progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#555', fontFamily: 'Arial' }}>
        <span>Completion rate</span>
        <span style={{ fontWeight: 700, color: cfg.color }}>{s.progress}%</span>
      </div>
      <ProgressBar pct={s.progress} color={cfg.color} />

      {/* stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 12px', marginTop: 10, fontSize: 12, fontFamily: 'Arial' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#555' }}>Total</span>
          <strong>{s.total}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#1a6b3c' }}>Completed</span>
          <strong style={{ color: '#1a6b3c' }}>{s.completed}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#185FA5' }}>In Progress</span>
          <strong style={{ color: '#185FA5' }}>{s.inProgress}</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ color: '#92400e' }}>Pending Sig.</span>
          <strong style={{ color: '#92400e' }}>{s.pending}</strong>
        </div>
        {s.onHold > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#b45309' }}>On Hold</span>
            <strong style={{ color: '#b45309' }}>{s.onHold}</strong>
          </div>
        )}
        {s.newItems > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#6B3FA0' }}>New</span>
            <strong style={{ color: '#6B3FA0' }}>{s.newItems}</strong>
          </div>
        )}
        {s.rejected > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#dc2626' }}>Rejected</span>
            <strong style={{ color: '#dc2626' }}>{s.rejected}</strong>
          </div>
        )}
      </div>

      {/* spend */}
      {s.spend > 0 && (
        <div style={{ marginTop: 12, paddingTop: 10, borderTop: `1px solid ${cfg.border}`,
          fontSize: 11, color: '#555', fontFamily: 'Arial', display: 'flex', justifyContent: 'space-between' }}>
          <span>Est. Spend</span>
          <strong style={{ color: cfg.color }}>{fmt(s.spend)}</strong>
        </div>
      )}
    </div>
  )
}

function InsightPanel({ items, zoneGroups }) {
  const alerts = []

  // Zone with most unassigned
  const byUnassigned = Object.entries(zoneGroups)
    .map(([z, arr]) => ({ zone: z, count: arr.filter(i => !i.Assignt && !i.AssignedTo).length }))
    .filter(x => x.count > 0)
    .sort((a, b) => b.count - a.count)
  if (byUnassigned.length) {
    alerts.push({
      type: 'warn',
      msg: `${byUnassigned[0].zone} Zone has the most unassigned requests (${byUnassigned[0].count}). Consider redistributing workload.`,
    })
  }

  // Overdue / On-Hold flag
  const onHoldAll = items.filter(i => statusClass(getStatus(i)) === 'onhold')
  if (onHoldAll.length > 0) {
    alerts.push({ type: 'warn', msg: `${onHoldAll.length} request${onHoldAll.length > 1 ? 's are' : ' is'} on hold across all zones.` })
  }

  // Zone performing best
  const byProgress = Object.entries(zoneGroups)
    .filter(([, arr]) => arr.length > 0)
    .map(([z, arr]) => ({ zone: z, progress: zoneStats(arr).progress }))
    .sort((a, b) => b.progress - a.progress)
  if (byProgress.length) {
    alerts.push({ type: 'good', msg: `${byProgress[0].zone} Zone leads in completion at ${byProgress[0].progress}%.` })
  }

  // High-value requests pending
  const highPend = items.filter(i =>
    ['pending', 'new'].includes(statusClass(getStatus(i))) &&
    parseFloat(i.EstimatedValue || 0) > 100000
  )
  if (highPend.length) {
    alerts.push({ type: 'info', msg: `${highPend.length} high-value request${highPend.length > 1 ? 's' : ''} (over $100K) still pending.` })
  }

  // No-zone items
  const noZone = items.filter(i => !['Central','East','West'].includes(getZone(i)))
  if (noZone.length) {
    alerts.push({ type: 'info', msg: `${noZone.length} request${noZone.length > 1 ? 's' : ''} have no zone assigned.` })
  }

  if (!alerts.length) {
    alerts.push({ type: 'good', msg: 'All zones are operating within normal parameters. No critical issues detected.' })
  }

  const icons = { warn: '⚠️', good: '✅', info: 'ℹ️' }
  const clrs  = { warn: '#92400e', good: '#1a6b3c', info: '#185FA5' }
  const bgs   = { warn: '#fffbeb', good: '#f0fdf4', info: '#eff6ff' }
  const bords = { warn: '#fcd34d', good: '#86efac', info: '#93c5fd' }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
      padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>
      <div style={{ fontWeight: 700, fontSize: 13, color: '#111', fontFamily: 'Arial', marginBottom: 12 }}>
        Director Insights
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {alerts.map((a, i) => (
          <div key={i} style={{ background: bgs[a.type], border: `1px solid ${bords[a.type]}`,
            borderRadius: 8, padding: '8px 12px', fontSize: 12, color: clrs[a.type], fontFamily: 'Arial',
            display: 'flex', gap: 8, alignItems: 'flex-start' }}>
            <span>{icons[a.type]}</span>
            <span>{a.msg}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function RecentTable({ items }) {
  const [zoneFilter, setZoneFilter] = useState('All')
  const zones = ['All', 'Central', 'East', 'West']

  const visible = items
    .filter(i => zoneFilter === 'All' || getZone(i) === zoneFilter)
    .sort((a, b) => (b.Created || '').localeCompare(a.Created || ''))
    .slice(0, 15)

  const statusColors = {
    completed: '#1a6b3c', inprogress: '#185FA5', pending: '#92400e',
    onhold: '#b45309', rejected: '#dc2626', new: '#6B3FA0',
  }

  return (
    <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12,
      padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: '#111', fontFamily: 'Arial' }}>
          Recent Requests (showing up to 15)
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {zones.map(z => (
            <button key={z} onClick={() => setZoneFilter(z)}
              style={{ padding: '3px 10px', fontSize: 11, borderRadius: 20, border: '1px solid #ccc',
                cursor: 'pointer', fontFamily: 'Arial', fontWeight: zoneFilter === z ? 700 : 400,
                background: zoneFilter === z ? '#111' : '#fff', color: zoneFilter === z ? '#fff' : '#555' }}>
              {z}
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'Arial' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
              {['Request ID', 'Zone', 'Assigned To', 'Status', 'Est. Value', 'Created'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '6px 10px', color: '#555',
                  fontWeight: 600, fontSize: 11, whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 16, color: '#999', textAlign: 'center' }}>No records found</td></tr>
            )}
            {visible.map((item, i) => {
              const s = getStatus(item)
              const sc = statusClass(s)
              return (
                <tr key={item.Id || i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '7px 10px', color: '#185FA5', fontWeight: 600 }}>
                    {item.RequestId || item.Title || '—'}
                  </td>
                  <td style={{ padding: '7px 10px' }}>
                    {getZone(item) || <span style={{ color: '#bbb' }}>—</span>}
                  </td>
                  <td style={{ padding: '7px 10px', color: '#333' }}>
                    {item.Assignt || item.AssignedTo || <span style={{ color: '#bbb' }}>Unassigned</span>}
                  </td>
                  <td style={{ padding: '7px 10px' }}>
                    <span style={{ background: statusColors[sc] + '18', color: statusColors[sc],
                      border: `1px solid ${statusColors[sc]}44`, borderRadius: 20,
                      padding: '2px 8px', fontWeight: 600, fontSize: 10, whiteSpace: 'nowrap' }}>
                      {s || 'New'}
                    </span>
                  </td>
                  <td style={{ padding: '7px 10px', color: '#555', whiteSpace: 'nowrap' }}>
                    {item.EstimatedValue
                      ? fmt(parseFloat(item.EstimatedValue))
                      : <span style={{ color: '#bbb' }}>—</span>}
                  </td>
                  <td style={{ padding: '7px 10px', color: '#888', whiteSpace: 'nowrap' }}>
                    {item.Created
                      ? new Date(item.Created).toLocaleDateString('en-CA')
                      : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function DirectorDashboard({ director, onSignOut }) {
  const [items,   setItems]   = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const fetchAll = useCallback(async () => {
    setLoading(true); setError('')
    try {
      const r = await fetch(`${BACKEND_URL}/api/manager/all-requests`, { method: 'POST', headers: { 'Content-Type': 'application/json' } })
      const d = await r.json()
      if (d.success) setItems(d.items || [])
      else setError(d.error || 'Failed to load requests.')
    } catch (e) {
      setError('Cannot reach backend. Is the server running?')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Group by zone
  const zoneGroups = { Central: [], East: [], West: [], Unknown: [] }
  items.forEach(item => {
    const z = getZone(item)
    if (zoneGroups[z]) zoneGroups[z].push(item)
    else zoneGroups.Unknown.push(item)
  })

  // Overall KPIs
  const overall = zoneStats(items)

  return (
    <div style={{ minHeight: '100vh', background: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <div style={{ flex: 1, maxWidth: 1100, margin: '0 auto', width: '100%', padding: '24px 20px', boxSizing: 'border-box' }}>

        {/* top bar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <h1 style={{ fontFamily: 'Arial', fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 2px 0' }}>
              Director Dashboard
            </h1>
            <p style={{ fontFamily: 'Arial', fontSize: 12, color: '#666', margin: 0 }}>
              {director.title} · {director.name}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button onClick={fetchAll} disabled={loading}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', background: '#fff',
                border: '1px solid #ccc', borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'Arial', color: '#444' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-4"/>
              </svg>
              {loading ? 'Loading…' : 'Refresh'}
            </button>
            <button onClick={onSignOut}
              style={{ padding: '7px 16px', background: '#fff', border: '1px solid #ccc',
                borderRadius: 7, fontSize: 12, cursor: 'pointer', fontFamily: 'Arial', color: '#555' }}>
              Sign Out
            </button>
          </div>
        </div>

        {error && (
          <div style={{ background: '#fff3f3', border: '1px solid #fcc', borderRadius: 8,
            padding: '10px 16px', fontSize: 13, color: '#c00', fontFamily: 'Arial', marginBottom: 16 }}>
            ⚠️ {error}
          </div>
        )}

        {/* Overall KPIs */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
          <KpiChip label="Total Requests"    value={overall.total}       color="#111"     />
          <KpiChip label="Completed"         value={overall.completed}   color="#1a6b3c"  />
          <KpiChip label="In Progress"       value={overall.inProgress}  color="#185FA5"  />
          <KpiChip label="Pending Signature" value={overall.pending}     color="#92400e"  />
          <KpiChip label="On Hold"           value={overall.onHold}      color="#b45309"  />
          <KpiChip label="Unassigned"        value={overall.unassigned}  color="#dc2626"  />
          <KpiChip label="Overall Completion" value={`${overall.progress}%`} color="#6B3FA0" />
          {overall.spend > 0 && (
            <KpiChip label="Total Est. Spend" value={fmt(overall.spend)} color="#111" />
          )}
        </div>

        {/* Zone cards */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          {Object.entries(ZONES).map(([z, cfg]) => (
            <ZoneCard key={z} zoneName={z} items={zoneGroups[z]} cfg={cfg} />
          ))}
        </div>

        {/* Director Insights + Overall Progress side by side */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 20 }}>
          <div style={{ flex: '2 1 400px' }}>
            <InsightPanel items={items} zoneGroups={zoneGroups} />
          </div>
          <div style={{ flex: '1 1 220px', background: '#fff', border: '1px solid #e5e7eb',
            borderRadius: 12, padding: '16px 20px', boxShadow: '0 1px 6px rgba(0,0,0,.05)' }}>
            <div style={{ fontWeight: 700, fontSize: 13, color: '#111', fontFamily: 'Arial', marginBottom: 12 }}>
              Zone Completion
            </div>
            {Object.entries(ZONES).map(([z, cfg]) => {
              const s = zoneStats(zoneGroups[z])
              return (
                <div key={z} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'Arial', color: '#444' }}>
                    <span style={{ fontWeight: 600, color: cfg.color }}>{z}</span>
                    <span>{s.progress}% ({s.completed}/{s.total})</span>
                  </div>
                  <ProgressBar pct={s.progress} color={cfg.color} />
                </div>
              )
            })}
            <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #e5e7eb' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontFamily: 'Arial', color: '#444' }}>
                <span style={{ fontWeight: 700 }}>Overall</span>
                <span style={{ fontWeight: 700 }}>{overall.progress}%</span>
              </div>
              <ProgressBar pct={overall.progress} color="#444" />
            </div>
          </div>
        </div>

        {/* Recent requests table */}
        {!loading && <RecentTable items={items} />}

        {loading && (
          <div style={{ textAlign: 'center', padding: 40, color: '#888', fontFamily: 'Arial', fontSize: 14 }}>
            Loading zone data…
          </div>
        )}

      </div>

      <Footer />
    </div>
  )
}
