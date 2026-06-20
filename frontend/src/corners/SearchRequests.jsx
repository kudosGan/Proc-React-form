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

function SearchRequests({ onBack }) {
  const [query, setQuery]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [items, setItems]     = useState(null)

  const handleSearch = async () => {
    setError('')

    if (!query.trim()) {
      setError('Please enter a search term.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/buyer/search`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ query: query.trim() }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Something went wrong.')
        return
      }

      setItems(result.items)

    } catch (err) {
      setError('Unable to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

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
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          Search Requests
        </div>

        {/* SEARCH BAR */}
        <div className="buyer-search-bar">
          <input
            type="text"
            placeholder="Search by Request ID (ESC-2627-1) or client name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="buyer-input"
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="buyer-search-btn"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <div className="buyer-error">⚠️ {error}</div>
        )}

        {/* RESULTS */}
        {items !== null && (
          <>
            <div className="buyer-results-count">
              {items.length} result{items.length !== 1 ? 's' : ''} found
            </div>

            {items.length === 0 ? (
              <div className="buyer-empty">
                No requests found matching your search.
              </div>
            ) : (
              <div className="buyer-table-wrap">
                <table className="buyer-table">
                  <thead>
                    <tr>
                      <th>Request ID</th>
                      <th>Client Name</th>
                      <th>Branch</th>
                      <th>Status</th>
                      <th>Assigned To</th>
                      <th>Priority</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item, i) => (
                      <tr key={i} className="buyer-table-row">
                        <td><span className="buyer-id">{item.Title}</span></td>
                        <td>{item.Requester || '—'}</td>
                        <td>{item.Branch || '—'}</td>
                        <td><StatusBadge status={item.ProgressStatus0?.Value || item.ProgressStatus?.Value} /></td>
                        <td>{item.Assignt || '—'}</td>
                        <td>{item.Priority?.Value || '—'}</td>
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

export default SearchRequests