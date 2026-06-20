import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const STATUS_COLORS = {
  'Pending Signature' : { bg: '#fff8e1', color: '#b45309' },
  'Signed'            : { bg: '#e8f5ee', color: '#1a6b3c' },
  'In Progress'       : { bg: '#e8f0fe', color: '#185FA5' },
  'Amended'           : { bg: '#f3eeff', color: '#6B3FA0' },
  'Completed'         : { bg: '#e8f5ee', color: '#1a6b3c' },
}

function StatusBadge({ status }) {
  const style = STATUS_COLORS[status] || { bg: '#f0f0f0', color: '#555' }
  return (
    <span style={{
      background   : style.bg,
      color        : style.color,
      fontSize     : 10,
      fontWeight   : 600,
      padding      : '3px 8px',
      borderRadius : 20,
      whiteSpace   : 'nowrap',
      fontFamily   : 'Arial',
    }}>
      {status || 'Unknown'}
    </span>
  )
}

function MyRequests({
  onBack,
  onUpdateStatus,
  initialEmail  = '',
  initialItems  = null,
  onEmailChange,
  onItemsChange,
}) {
  const [email, setEmail]         = useState(initialEmail)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [items, setItems]         = useState(initialItems)
  const [filterText, setFilterText] = useState('')
  const [filterMode, setFilterMode] = useState('refId') // 'refId' | 'sop'

  const updateEmail = (val) => {
    setEmail(val)
    onEmailChange?.(val)
  }

  const handleSearch = async () => {
    setError('')
    setFilterText('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/buyer/my-requests`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ email: email.trim().toLowerCase() }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Something went wrong.')
        return
      }

      setItems(result.items)
      onItemsChange?.(result.items)

    } catch (err) {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  const filteredItems = items === null ? null : items.filter(item => {
    if (!filterText.trim()) return true
    const q = filterText.trim().toLowerCase()
    if (filterMode === 'refId') return (item.Title || '').toLowerCase().includes(q)
    if (filterMode === 'sop')   return (item.Solicitation_x0020_Number || '').toLowerCase().includes(q)
    return true
  })

  return (
    <div className="start-wrapper">

      <Header />

      <div className="buyer-body">

        {/* BACK */}
        <button onClick={onBack} style={{
          display     : 'flex',
          alignItems  : 'center',
          gap         : 6,
          background  : 'none',
          border      : 'none',
          color       : '#555',
          fontSize    : 13,
          cursor      : 'pointer',
          padding     : 0,
          marginBottom: 20,
          fontFamily  : 'Arial',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Buyer Corner
        </button>

        {/* TITLE */}
        <div className="buyer-page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          My Requests
        </div>

        {/* EMAIL SEARCH */}
        <div className="buyer-search-bar">
          <input
            type="email"
            placeholder="Enter your AAFC email e.g. john.doe@agr.gc.ca"
            value={email}
            onChange={(e) => updateEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="buyer-input"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="buyer-search-btn"
          >
            {loading ? 'Loading...' : 'Search'}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="buyer-error">⚠️ {error}</div>
        )}

        {/* RESULTS */}
        {items !== null && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
              <div className="buyer-results-count" style={{ margin: 0 }}>
                {items.length} request{items.length !== 1 ? 's' : ''} found
                {filterText && filteredItems.length !== items.length && (
                  <span style={{ color: '#888', fontWeight: 400 }}>
                    {' '}— showing {filteredItems.length}
                  </span>
                )}
              </div>

              {/* FILTER BAR */}
              {items.length > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid #dde3f0', borderRadius: 7, overflow: 'hidden', background: '#fff', fontFamily: 'Arial' }}>
                  {/* mode toggle */}
                  <button
                    onClick={() => { setFilterMode('refId'); setFilterText('') }}
                    style={{
                      padding     : '5px 12px',
                      fontSize    : 11,
                      fontWeight  : 600,
                      border      : 'none',
                      borderRight : '1px solid #dde3f0',
                      cursor      : 'pointer',
                      background  : filterMode === 'refId' ? '#185FA5' : '#f5f7ff',
                      color       : filterMode === 'refId' ? '#fff' : '#555',
                      fontFamily  : 'Arial',
                      whiteSpace  : 'nowrap',
                    }}
                  >
                    Reference ID
                  </button>
                  <button
                    onClick={() => { setFilterMode('sop'); setFilterText('') }}
                    style={{
                      padding     : '5px 12px',
                      fontSize    : 11,
                      fontWeight  : 600,
                      border      : 'none',
                      borderRight : '1px solid #dde3f0',
                      cursor      : 'pointer',
                      background  : filterMode === 'sop' ? '#185FA5' : '#f5f7ff',
                      color       : filterMode === 'sop' ? '#fff' : '#555',
                      fontFamily  : 'Arial',
                      whiteSpace  : 'nowrap',
                    }}
                  >
                    SOP Number
                  </button>
                  {/* filter input */}
                  <input
                    type="text"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    placeholder={filterMode === 'refId' ? 'e.g. ESC-2627-005' : 'e.g. ESC-SOL-001'}
                    style={{
                      border      : 'none',
                      outline     : 'none',
                      padding     : '5px 10px',
                      fontSize    : 11,
                      fontFamily  : 'Arial',
                      width       : 180,
                      background  : 'transparent',
                    }}
                  />
                  {filterText && (
                    <button
                      onClick={() => setFilterText('')}
                      style={{
                        border      : 'none',
                        background  : 'none',
                        cursor      : 'pointer',
                        padding     : '0 8px',
                        color       : '#aaa',
                        fontSize    : 14,
                        lineHeight  : 1,
                      }}
                      title="Clear filter"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}
            </div>

            {items.length === 0 ? (
              <div className="buyer-empty">
                No requests assigned to this email address.
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="buyer-empty">
                No results match your filter.
              </div>
            ) : (
              <div className="buyer-table-wrap">
                <table className="buyer-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Client Name</th>
                      <th>SOP Number</th>
                      <th>Status</th>
                      <th>Priority</th>
                      <th>Assigned Date</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item, i) => (
                      <tr key={i} className="buyer-table-row">
                        <td><span className="buyer-id">{item.Title}</span></td>
                        <td>{item.Requester || '—'}</td>
                        <td>
                          {item.Solicitation_x0020_Number
                            ? <span style={{ fontSize: 11, fontFamily: 'Arial', color: '#185FA5', fontWeight: 600 }}>{item.Solicitation_x0020_Number}</span>
                            : '—'}
                        </td>
                        <td><StatusBadge status={item.ProgressStatus0?.Value || item.ProgressStatus?.Value} /></td>
                        <td>{item.Priority?.Value || '—'}</td>
                        <td>{item.Modified ? new Date(item.Modified).toLocaleDateString('en-CA') : '—'}</td>
                        <td>
                          <button
                            onClick={() => onUpdateStatus(item.Title)}
                            style={{
                              padding      : '4px 14px',
                              background   : '#185FA5',
                              color        : 'white',
                              border       : 'none',
                              borderRadius : 5,
                              fontSize     : 11,
                              fontWeight   : 600,
                              cursor       : 'pointer',
                              fontFamily   : 'Arial',
                              whiteSpace   : 'nowrap',
                            }}
                          >
                            Update
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

      </div>

      <Footer />

    </div>
  )
}

export default MyRequests
