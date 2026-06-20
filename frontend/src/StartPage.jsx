import Header from './components/Header'
import Footer from './components/Footer'
import './styles/start.css'

function StartPage({ onBusinessOwner, onBuyer, onManager }) {
  return (
    <div className="start-wrapper">

      <Header />

      {/* BODY */}
      <div className="start-body">

        <div className="start-icon-wrap">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>

        <h1 className="start-title">Procurement Request System</h1>
        <p className="start-subtitle">
          Agriculture and Agri-Food Canada<br />
          Form A9565-E
        </p>

        {/* 3 CORNER CARDS */}
        <div className="corner-grid">

          {/* BUSINESS OWNER */}
          <button className="corner-card corner-card--green" onClick={onBusinessOwner}>
            <div className="corner-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="corner-card-title">Business Owner</div>
            <div className="corner-card-desc">Submit and manage procurement requests</div>
            <div className="corner-card-tags">
              <span className="corner-tag">New Request</span>
              <span className="corner-tag">Change Request</span>
              <span className="corner-tag">Amendment</span>
            </div>
          </button>

          {/* BUYER */}
          <button className="corner-card corner-card--blue" onClick={onBuyer}>
            <div className="corner-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div className="corner-card-title">Buyer Corner</div>
            <div className="corner-card-desc">View and manage assigned procurement requests</div>
            <div className="corner-card-tags">
              <span className="corner-tag">My Requests</span>
              <span className="corner-tag">Update Status</span>
              <span className="corner-tag">Search</span>
            </div>
          </button>

          {/* MANAGER */}
          <button className="corner-card corner-card--purple" onClick={onManager}>
            <div className="corner-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="corner-card-title">Manager Corner</div>
            <div className="corner-card-desc">Dashboard, assignments and approvals</div>
            <div className="corner-card-tags">
              <span className="corner-tag">Dashboard</span>
              <span className="corner-tag">Assign</span>
              <span className="corner-tag">Approve</span>
            </div>
          </button>

        </div>

      </div>

      {/* FOOTER */}

   <Footer />
    </div>
  )
}

export default StartPage