import { useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import BORequestStatus from './BORequestStatus.jsx'
import '../styles/start.css'

function BOCorner({ onBack, onNewRequest, onChangeRequest, onNewAmendment }) {
  const [screen, setScreen] = useState('menu')

  if (screen === 'request-status') return (
    <BORequestStatus onBack={() => setScreen('menu')} />
  )

  return (
    <div className="start-wrapper">

      <Header />

      {/* BODY — tighter padding so all 4 cards fit without scrolling */}
      <div className="start-body" style={{ padding: '18px 24px', justifyContent: 'center' }}>

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
          marginBottom: 10,
          fontFamily  : 'Arial',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
          Back to Home
        </button>

        {/* ICON — smaller to save vertical space */}
        <div className="start-icon-wrap" style={{ background:'#e8f5ee', width:56, height:56, marginBottom:10 }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>

        <h1 className="start-title" style={{ color:'#1a6b3c', fontSize:20, margin:'0 0 4px 0' }}>
          Business Owner Corner
        </h1>
        <p className="start-subtitle" style={{ margin:'0 0 16px 0', fontSize:12 }}>
          Submit and manage your procurement requests
        </p>

        {/* BUTTONS — tighter gap */}
        <div className="start-buttons" style={{ gap: 10 }}>

          {/* NEW REQUEST */}
          <button className="start-card" style={{ padding:'12px 16px' }} onClick={onNewRequest}>
            <div className="start-card-icon start-card-icon--green">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">New Request</span>
              <span className="start-card-desc">Submit a new Procurement Request Form A9565-E</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* CHANGE REQUEST */}
          <button className="start-card" style={{ padding:'12px 16px' }} onClick={onChangeRequest}>
            <div className="start-card-icon start-card-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">Change Request</span>
              <span className="start-card-desc">Update an existing request using your Request ID</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* NEW AMENDMENT */}
          <button className="start-card" style={{ padding:'12px 16px' }} onClick={onNewAmendment}>
            <div className="start-card-icon" style={{ background: '#fff8e1' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#b45309" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="12" y1="18" x2="12" y2="12"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">New Amendment</span>
              <span className="start-card-desc">Submit a new request referencing a previous Request ID</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

          {/* REQUEST STATUS */}
          <button className="start-card" style={{ padding:'12px 16px' }} onClick={() => setScreen('request-status')}>
            <div className="start-card-icon" style={{ background: '#f0fdf4' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">Request Status</span>
              <span className="start-card-desc">Check the status of your submitted request</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

        </div>

      </div>

      {/* FOOTER */}
        <Footer />

    </div>
  )
}

export default BOCorner