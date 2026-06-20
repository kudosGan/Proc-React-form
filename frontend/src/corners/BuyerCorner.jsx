import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'
import MyRequests from './MyRequests.jsx'
import SearchRequests from './SearchRequests.jsx'
import UpdateStatus from './UpdateStatus.jsx'

function BuyerCorner({ onBack }) {
  const [screen, setScreen]                       = useState('menu')
  const [selectedRequestId, setSelectedRequestId] = useState('')
  const [myEmail, setMyEmail]                     = useState('')
  const [myItems, setMyItems]                     = useState(null)

  const goToUpdate = (requestId = '') => {
    setSelectedRequestId(requestId)
    setScreen('update-status')
  }

  if (screen === 'my-requests') return (
    <MyRequests
      onBack={() => setScreen('menu')}
      onUpdateStatus={goToUpdate}
      initialEmail={myEmail}
      initialItems={myItems}
      onEmailChange={setMyEmail}
      onItemsChange={setMyItems}
    />
  )
  if (screen === 'search') return (
    <SearchRequests onBack={() => setScreen('menu')} />
  )
  if (screen === 'update-status') return (
    <UpdateStatus onBack={() => setScreen('my-requests')} initialRequestId={selectedRequestId} />
  )
  return (
    <div className="start-wrapper">

      <Header />

      {/* BODY */}
      <div className="start-body">

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
          Back to Home
        </button>

        {/* ICON */}
        <div className="start-icon-wrap" style={{ background: '#e8f0fe' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 0 1-8 0"/>
          </svg>
        </div>

        <h1 className="start-title" style={{ color: '#185FA5' }}>Buyer Corner</h1>
        <p className="start-subtitle">
          View and manage your assigned procurement requests
        </p>

        {/* BUTTONS */}
        <div className="start-buttons">

          {/* MY REQUESTS */}
          <button className="start-card" onClick={() => setScreen('my-requests')}>
            <div className="start-card-icon start-card-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">My Requests</span>
              <span className="start-card-desc">View all requests assigned to you</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* SEARCH */}
          <button className="start-card" onClick={() => setScreen('search')}>
            <div className="start-card-icon start-card-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">Search Requests</span>
              <span className="start-card-desc">Search by Request ID or client name</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* UPDATE STATUS */}
          <button className="start-card" onClick={() => setScreen('update-status')}>
            <div className="start-card-icon start-card-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">Update Status</span>
              <span className="start-card-desc">Update the status of a procurement request</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

        </div>

      </div>

      <Footer />

    </div>
  )
}

export default BuyerCorner