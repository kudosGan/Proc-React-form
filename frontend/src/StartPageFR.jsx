import Header from './components/Header'
import Footer from './components/Footer'
import './styles/start.css'

// French landing page. Kept as its own component (separate from
// StartPageEN.jsx) so each language can be edited/debugged in isolation.
function StartPageFR({ onBusinessOwner, onBuyer, onManager, onDirector, lang, setLang }) {
  return (
    <div className="start-wrapper">

      <Header />

      {/* BODY */}
      <div className="start-body" style={{ position: 'relative' }}>

        {/* EN/FR toggle — top-right corner of body area */}
        <div style={{ position: 'absolute', top: 16, right: 20, zIndex: 10, display: 'flex', gap: 4 }}>
          {['en', 'fr'].map(code => (
            <button
              key={code}
              onClick={() => setLang(code)}
              style={{
                padding      : '3px 10px',
                fontSize     : 11,
                fontWeight   : lang === code ? 700 : 400,
                fontFamily   : 'Arial',
                borderRadius : 14,
                border       : '1px solid #ccc',
                cursor       : 'pointer',
                background   : lang === code ? '#1a6b3c' : '#fff',
                color        : lang === code ? '#fff' : '#555',
              }}
            >
              {code.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Director button — greyed, top-right corner of body area */}
        <button
          onClick={onDirector}
          title="Portail du directeur"
          style={{
            position      : 'absolute',
            top           : 52,
            right         : 20,
            width         : 24,
            height        : 24,
            borderRadius  : '50%',
            background    : '#e8e8e8',
            border        : '1px solid #d0d0d0',
            color         : '#bbb',
            fontWeight    : 400,
            fontSize      : 11,
            cursor        : 'pointer',
            fontFamily    : 'Arial',
            lineHeight    : '1',
            zIndex        : 10,
            display       : 'flex',
            alignItems    : 'center',
            justifyContent: 'center',
            transition    : 'opacity .2s',
            opacity       : 0.45,
          }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
        >
          D
        </button>

        <div className="start-icon-wrap">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>

        <h1 className="start-title">Système de demandes d'approvisionnement</h1>
        <p className="start-subtitle">
          Agriculture et Agroalimentaire Canada<br />
          Formulaire A9565-E
        </p>

        {/* 3 CARTES DE COIN */}
        <div className="corner-grid">

          {/* PROPRIÉTAIRE FONCTIONNEL */}
          <button className="corner-card corner-card--green" onClick={onBusinessOwner}>
            <div className="corner-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1a6b3c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div className="corner-card-title">Propriétaire fonctionnel</div>
            <div className="corner-card-desc">Soumettre et gérer les demandes d'approvisionnement</div>
            <div className="corner-card-tags">
              <span className="corner-tag">Nouvelle demande</span>
              <span className="corner-tag">Demande de modification</span>
              <span className="corner-tag">Modification</span>
              <span className="corner-tag">État de la demande</span>
            </div>
          </button>

          {/* ESPACE ACHETEUR */}
          <button className="corner-card corner-card--blue" onClick={onBuyer}>
            <div className="corner-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 0 1-8 0"/>
              </svg>
            </div>
            <div className="corner-card-title">Espace acheteur</div>
            <div className="corner-card-desc">Consulter et gérer les demandes d'approvisionnement assignées</div>
            <div className="corner-card-tags">
              <span className="corner-tag">Mes demandes</span>
              <span className="corner-tag">Mettre à jour l'état</span>
              <span className="corner-tag">Rechercher</span>
            </div>
          </button>

          {/* ESPACE GESTIONNAIRE */}
          <button className="corner-card corner-card--purple" onClick={onManager}>
            <div className="corner-card-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#6B3FA0" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <div className="corner-card-title">Espace gestionnaire</div>
            <div className="corner-card-desc">Tableau de bord, attributions et approbations</div>
            <div className="corner-card-tags">
              <span className="corner-tag">Tableau de bord</span>
              <span className="corner-tag">Attribuer</span>
              <span className="corner-tag">Approuver</span>
            </div>
          </button>

        </div>

      </div>

      {/* FOOTER */}
      <Footer lang="fr" />
    </div>
  )
}

export default StartPageFR
