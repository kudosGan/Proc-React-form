import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PrintPage from './PrintPage.jsx'
import StartPage from './StartPage.jsx'
import AmendLogin from './AmendLogin.jsx'
import AmendForm from './AmendForm.jsx'

const isPrintMode = window.location.pathname === '/print'

function Root() {
  const [view, setView]           = useState('start')
  const [amendRecord, setAmendRecord]   = useState(null)
  const [amendRequestId, setAmendRequestId] = useState('')
  const [amendSpoItemId, setAmendSpoItemId] = useState(null)

  if (isPrintMode) return <PrintPage />

  if (view === 'start') return (
    <StartPage
      onNewRequest={() => setView('new')}
      onAmendRequest={() => setView('amend-login')}
    />
  )

  if (view === 'new') return (
    <App onBack={() => setView('start')} />
  )

  if (view === 'amend-login') return (
    <AmendLogin
      onBack={() => setView('start')}
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
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>
)