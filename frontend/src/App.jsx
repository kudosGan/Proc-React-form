import { useState } from 'react'
import './styles/form.css'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import FormFooter from './components/FormFooter'
import CopilotPanel from './copilot/CopilotPanel'
import './copilot/copilot.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

function App({ onBack }) {

  const [currentPage, setCurrentPage]   = useState(1)
  const [submitStatus, setSubmitStatus] = useState(null)  // null | 'loading' | 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('')
  const [submissionRef, setSubmissionRef] = useState('')  // ESC-2627-NNN once PA responds

  // ─────────────────────────────────────────
  // FORM STATE
  // ─────────────────────────────────────────
  const [formData, setFormData] = useState({

    // Plant Code / Zone routing
    plantCode: '', plantZone: '', plantCity: '', plantName: '',

    // Page 1 — Client
    clientFirstName: '', clientLastName: '', clientEmail: '', clientBranch: '',
    businessOwnerFirstName: '', businessOwnerLastName: '', businessOwnerEmail: '', businessOwnerBranch: '',

    // Page 1 — Requirement
    goodsSelected: false, goodsDeliveryDate: '',
    servicesSelected: false, servicesStartDate: '', servicesEndDate: '',
    constructionSelected: false, constructionStartDate: '', constructionEndDate: '',
    requirementDescription: '', procurementStrategy: '', strategyOptions: '',
    continuationRequired: '', continuationDetails: '', subsequentNeed: '',
    alternativesConsidered: '', alternativeDetails: '', functionalApproval: '',

    // Page 2 — Considerations
    accessibilityType: '', accessibilityDetails: '',
    indigenousConsidered: '', indigenousDetails: '',
    environmentalConsidered: '', environmentalDetails: '',
    supervisoryControl: '', provideTools: '', workingHours: '', employeeEmployerJustification: '',

    // Page 3 — IP / Security / Cost
    ipPotential: '', ipOwner: '', securityRequirement: '', officialLanguages: '', lifeCycleCosts: '',
    estimatedCostRows: [{ fiscalYear: '', description: '', quantity: '', unitCost: '', amount: '' }],
    estimatedTaxes: '', province: '', travelExpenses: '', totalEstimatedCost: '',

    // Page 4 — Signatures
    recommendedName: '', recommendedTitle: '', recommendedSignature: '', recommendedDate: '', recommendedSignedAt: '',
    confirmedName: '', confirmedTitle: '', confirmedSignature: '', confirmedDate: '', confirmedSignedAt: '',
    section32Signature: '', section32Date: '', section32SignedAt: '', section32ManagerEmail: '',
    signatureMethod: 'mykey', // 'docusign' | 'mykey' | 'email'

    // Page 4 — Responsibility Centre
    responsibilityCentreManager: '', responsibilityTitle: '', responsibilityBranch: '', responsibilityDivision: '',
    financialRows: [{
      fiscalYear: '', generalLedger: '', fund: '', wbse: '',
      programActivity: '', costCentre: '', asset: '', internalOrder: '', amount: ''
    }],

    // Page 4 — Supporting Docs
    statementOfRequirement: false, statementOfWork: false, investmentAuthorityRequest: false,
    evaluationCriteria: false, functionalApprovalsAttached: false, specificationPlans: false,
    srclAttached: false, proposalQuote: false, ssltcAttached: false, otherDocuments: false,

    // Page 4 — Notes
   procurementNotes: '',
   uploadedFiles: []
  })

  // ─────────────────────────────────────────
  // NAVIGATION
  // ─────────────────────────────────────────
  const nextPage = () => {
    if (currentPage < 4) {
      setCurrentPage(p => p + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(p => p - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // ─────────────────────────────────────────
  // SUBMIT
  // ─────────────────────────────────────────
  const handleSubmit = async () => {

    setSubmitStatus('loading')
    setSubmitMessage('Filling PDF and triggering Power Automate...')

    // Calculate totals before sending
    const subtotal = (formData.estimatedCostRows || [])
      .reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
    const travel = parseFloat(formData.travelExpenses) || 0

    const payload = {
      ...formData,
      calculatedTotals: {
        subtotal,
        travelExpenses    : travel,
        totalEstimatedCost: subtotal + travel,
      },
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/submit`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Server error ${response.status}`)
      }

      // Always download PDF to client machine
      if (result.pdfBase64) {
        const bytes  = atob(result.pdfBase64)
        const arr    = new Uint8Array(bytes.length)
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
        const blob   = new Blob([arr], { type: 'application/pdf' })
        const url    = URL.createObjectURL(blob)
        const a      = document.createElement('a')
        a.href       = url
        a.download   = result.fileName || 'Procurement-A9565-E.pdf'
        a.click()
        URL.revokeObjectURL(url)
      }

      setSubmissionRef(result.submissionRef || '')
      setSubmitStatus('success')

      const nextSteps = {
        docusign:
          `Next steps:\n` +
          `1. The PDF has been sent to the Section 32 Manager (${formData.section32ManagerEmail}) via DocuSign for e-signature\n` +
          `2. You'll be notified once they've signed`,
        email:
          `Next steps:\n` +
          `1. The PDF has been emailed — no signature step required`,
        mykey:
          `Next steps:\n` +
          `1. Open the downloaded PDF in Adobe Acrobat\n` +
          `2. Sign all signature fields with your MyKey / Entrust digital key\n` +
          `3. Save the signed PDF\n` +
          `4. Email the signed PDF to kudas.ganesan@agr.gc.ca`,
      }

      setSubmitMessage(
        result.paTriggered
          ? `Submitted successfully!\n\n` +
            `• PDF downloaded to your machine\n` +
            `• SharePoint list item created (ESC-${result.fiscalYear}-NNN)\n` +
            `• Teams notification sent\n\n` +
            (nextSteps[formData.signatureMethod] || nextSteps.mykey)
          :`PDF downloaded.\n\nAdd POWER_AUTOMATE_URL to backend/.env to enable SharePoint and Teams.`
      )

    } catch (err) {
      setSubmitStatus('error')
      setSubmitMessage(
        ` Submission failed: ${err.message}\n\n` +
        `Make sure:\n` +
        `• Backend is running on port 3001 (cd backend && npm run dev)\n` +
        `• pdftk is installed (see README)\n` +
        `• A9565-E.pdf is in backend/pdf/`
      )
      console.error('Submit error:', err)
    }
  }

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="app-with-copilot">

      {/* FORM */}
      <div className="form-area">
        <div style={{ background: '#d9d9d9', padding: '30px 0', minHeight: '100vh', position: 'relative' }}>

          {/* PAGE NUMBER WATERMARK — pinned to the gray margin, stays visible while scrolling */}
          <div style={{
            position     : 'fixed',
            left         : 30,
            top          : '50%',
            transform    : 'translateY(-50%) rotate(-90deg)',
            transformOrigin: 'center',
            fontFamily   : 'Arial',
            fontWeight   : 800,
            fontSize     : currentPage === 4 ? 20 : 26,
            letterSpacing: 2,
            color        : 'rgba(0, 0, 0, 0.10)',
            lineHeight   : 1.3,
            whiteSpace   : 'nowrap',
            pointerEvents: 'none',
            userSelect   : 'none',
            zIndex       : 0,
          }}>
            {currentPage === 4 ? 'FINAL PAGE' : `PAGE ${currentPage}`}
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>

          {/* BACK TO HOME */}
          {onBack && (
            <div style={{ maxWidth: 999, margin: '0 auto 16px auto' }}>
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
                fontFamily  : 'Arial',
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Home
              </button>
            </div>
          )}

          {currentPage === 1 && <Page1 formData={formData} setFormData={setFormData} />}
          {currentPage === 2 && <Page2 formData={formData} setFormData={setFormData} />}
          {currentPage === 3 && <Page3 formData={formData} setFormData={setFormData} />}
          {currentPage === 4 && <Page4 formData={formData} setFormData={setFormData} />}

          {/* STATUS BANNER */}
          {submitStatus && (
            <div style={{
              maxWidth     : 999,
              margin       : '16px auto',
              padding      : '16px 20px',
              borderRadius : 6,
              whiteSpace   : 'pre-line',
              fontSize     : 13,
              lineHeight   : 1.6,
              background   : submitStatus === 'success' ? '#e8f5ee'
                           : submitStatus === 'error'   ? '#fff3f3'
                           :                             '#f0f4ff',
              border       : `1px solid ${
                             submitStatus === 'success' ? '#b3d9c3'
                           : submitStatus === 'error'   ? '#ffbdbd'
                           :                             '#c0ccff'}`,
              color        : submitStatus === 'success' ? '#1a4a2a'
                           : submitStatus === 'error'   ? '#a00'
                           :                             '#333',
            }}>
              {submitStatus === 'loading' && '⏳ '}
              {submitMessage}
            </div>
          )}

          <FormFooter
            currentPage={currentPage}
            totalPages={4}
            onNext={nextPage}
            onBack={previousPage}
            onSubmit={handleSubmit}
            signatureMethod={formData.signatureMethod}
            onSignatureMethodChange={(v) => setFormData({ ...formData, signatureMethod: v })}
            submitDisabled={
              submitStatus === 'loading' ||
              submitStatus === 'success' ||
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((formData.section32ManagerEmail || '').trim())
            }
          />

          </div>

        </div>
      </div>

      {/* COPILOT SIDE PANEL */}
      <CopilotPanel
        formData={formData}
        setFormData={setFormData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

    </div>
  )
}

export default App
