import { useState } from 'react'
import Header from './components/Header'
import Footer from './components/Footer'
import './styles/start.css'
import './styles/amend.css'

function AmendLogin({ onBack, onFound }) {
  const [requestId, setRequestId] = useState('')
  const [email, setEmail]         = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

  const handleSearch = async () => {
    setError('')

    if (!requestId.trim()) {
      setError('Please enter your Request ID.')
      return
    }
    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/amend/lookup`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({
          requestId : requestId.trim().toUpperCase(),
          email     : email.trim().toLowerCase(),
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Something went wrong. Please try again.')
        return
      }

      onFound(result)

    } catch (err) {
      setError('Unable to connect to the server. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <div className="start-wrapper">

      <Header />

      {/* BODY */}
      <div className="start-body">

        <div className="amend-login-card">

          {/* BACK */}
          <button className="amend-back-btn" onClick={onBack}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/>
              <polyline points="12 19 5 12 12 5"/>
            </svg>
            Back
          </button>

          {/* ICON */}
          <div className="amend-login-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </div>

          <h2 className="amend-login-title">Find Your Request</h2>
          <p className="amend-login-desc">
            Enter your Request ID and the email address used when the request was submitted.
          </p>

          {/* REQUEST ID */}
          <div className="amend-field">
            <label className="amend-label">Request ID</label>
            <input
              type="text"
              className="amend-input"
              placeholder="ESC-2627-020"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
            />
          </div>

          {/* EMAIL */}
          <div className="amend-field">
            <label className="amend-label">Client Email</label>
            <input
              type="email"
              className="amend-input"
              placeholder="your.name@agr.gc.ca"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="amend-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              {error}
            </div>
          )}

          {/* SEARCH BUTTON */}
          <button
            className="amend-search-btn"
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="amend-spinner" />
                Searching...
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                Search Request
              </>
            )}
          </button>

        </div>

      </div>

      {/* FOOTER */}
            <Footer />
    </div>
  )
}

export default AmendLogin