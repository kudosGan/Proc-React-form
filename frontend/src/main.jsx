import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrintPage from './PrintPage.jsx'
import StartPage from './StartPage.jsx'
import AmendLogin from './AmendLogin.jsx'
import AmendForm from './AmendForm.jsx'
import BOCorner          from './corners/BOCorner.jsx'
import BuyerCorner       from './corners/BuyerCorner.jsx'
import ManagerCorner     from './corners/ManagerCorner.jsx'
import ManagerLogin      from './corners/ManagerLogin.jsx'
import DirectorLogin     from './corners/DirectorLogin.jsx'
import DirectorDashboard from './corners/DirectorDashboard.jsx'

const isPrintMode = window.location.pathname === '/print'

function Root() {
  const [view, setView]                     = useState('start')
  const [amendRecord, setAmendRecord]       = useState(null)
  const [amendRequestId, setAmendRequestId] = useState('')
  const [amendSpoItemId, setAmendSpoItemId] = useState(null)
  const [managerUser,  setManagerUser]  = useState(null)
  const [directorUser, setDirectorUser] = useState(null)

  if (isPrintMode) return <PrintPage />

  if (view === 'start') return (
    <StartPage
      onBusinessOwner={() => setView('bo-corner')}
      onBuyer={() => setView('buyer-corner')}
      onManager={() => setView('manager-corner')}
      onDirector={() => setView('director-corner')}
    />
  )

  if (view === 'bo-corner') return (
    <BOCorner
      onBack={() => setView('start')}
      onNewRequest={() => setView('new')}
      onChangeRequest={() => setView('amend-login')}
      onNewAmendment={() => setView('amend-login')}
    />
  )

  if (view === 'new') return (
    <App onBack={() => setView('bo-corner')} />
  )

  if (view === 'amend-login') return (
    <AmendLogin
      onBack={() => setView('bo-corner')}
      onFound={(result) => {
        setAmendRecord(result.record)
        setAmendRequestId(result.requestId)
        setAmendSpoItemId(result.spoItemId)
        setView('amend-form')
      }}
    />
  )

  if (view === 'amend-form') return (
    <AmendForm
      record={amendRecord}
      requestId={amendRequestId}
      spoItemId={amendSpoItemId}
      onBack={() => setView('amend-login')}
    />
  )

  if (view === 'buyer-corner') return (
    <BuyerCorner onBack={() => setView('start')} />
  )

  if (view === 'director-corner') {
    if (!directorUser) return (
      <DirectorLogin
        onBack={() => setView('start')}
        onLogin={(dir) => setDirectorUser(dir)}
      />
    )
    return (
      <DirectorDashboard
        director={directorUser}
        onSignOut={() => { setDirectorUser(null); setView('start') }}
      />
    )
  }

  if (view === 'manager-corner') {
    if (!managerUser) return (
      <ManagerLogin
        onBack={() => setView('start')}
        onLogin={(mgr) => setManagerUser(mgr)}
      />
    )
    return (
      <ManagerCorner
        manager={managerUser}
        onBack={() => { setManagerUser(null); setView('start') }}
      />
    )
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)
