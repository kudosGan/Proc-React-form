import canadaLogo from './assests/canada-logo1.png'
import './styles/start.css'

function StartPage({ onNewRequest, onAmendRequest }) {
  return (
    <div className="start-wrapper">

      <div className="start-header">
        <div className="start-header-left">
          <img src={canadaLogo} alt="Government of Canada" className="start-logo" />
          <div className="start-dept">
            Agriculture and<br />Agri-Food Canada
          </div>
        </div>
        <div className="start-dept" style={{ textAlign: 'right' }}>
          Agriculture et<br />Agroalimentaire Canada
        </div>
      </div>

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

        <div className="start-buttons">

          <button className="start-card" onClick={onNewRequest}>
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

          <button className="start-card" onClick={onAmendRequest}>
            <div className="start-card-icon start-card-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </div>
            <div className="start-card-text">
              <span className="start-card-title">Amend Request</span>
              <span className="start-card-desc">Update an existing request using your Request ID</span>
            </div>
            <svg className="start-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>

        </div>

      </div>

      <div className="start-footer">
        <span>AAFC Procurement System</span>
        <span style={{ fontWeight: 500 }}>Canada</span>
      </div>

    </div>
  )
}

export default StartPage