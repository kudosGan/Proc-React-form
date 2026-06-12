import { useState } from 'react'
import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import FormFooter from './components/FormFooter'
import CopilotPanel from './copilot/CopilotPanel'
import './styles/form.css'
import './copilot/copilot.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

function AmendForm({ record, requestId, spoItemId, onBack }) {

  const [currentPage, setCurrentPage]     = useState(1)
  const [formData, setFormData]           = useState(record)
  const [submitStatus, setSubmitStatus]   = useState(null)
  const [submitMessage, setSubmitMessage] = useState('')

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

  const handleSubmit = async () => {
    setSubmitStatus('loading')
    setSubmitMessage('Saving your amendments...')

    const subtotal = (formData.estimatedCostRows || [])
      .reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0)
    const travel = parseFloat(formData.travelExpenses) || 0

    const payload = {
      ...formData,
      requestId,
      spoItemId,
      amendedAt: new Date().toISOString(),
      calculatedTotals: {
        subtotal,
        travelExpenses    : travel,
        totalEstimatedCost: subtotal + travel,
      },
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/amend/submit`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify(payload),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || `Server error ${response.status}`)
      }

      // Download amended PDF
      if (result.pdfBase64) {
        const bytes = atob(result.pdfBase64)
        const arr   = new Uint8Array(bytes.length)
        for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i)
        const blob  = new Blob([arr], { type: 'application/pdf' })
        const url   = URL.createObjectURL(blob)
        const a     = document.createElement('a')
        a.href      = url
        a.download  = `${requestId}-AMENDED.pdf`
        a.click()
        URL.revokeObjectURL(url)
      }

      setSubmitStatus('success')
      setSubmitMessage(
        `✅ Amendment submitted successfully!\n\n` +
        `• Request ${requestId} updated in SharePoint\n` +
        `• Amended PDF downloaded\n` +
        `• Assigned person and manager notified`
      )

    } catch (err) {
      setSubmitStatus('error')
      setSubmitMessage(`❌ Amendment failed: ${err.message}`)
    }
  }

  return (
    <div className="app-with-copilot">

      <div className="form-area">
        <div style={{ background: '#d9d9d9', minHeight: '100vh' }}>

          {/* AMENDMENT BANNER */}
          <div style={{
            background    : '#185FA5',
            color         : 'white',
            padding       : '10px 20px',
            display       : 'flex',
            justifyContent: 'space-between',
            alignItems    : 'center',
            fontFamily    : 'Arial',
            fontSize      : 13,
          }}>
            <div>
              <strong>Amending Request:</strong> {requestId}
            </div>
            <button
              onClick={onBack}
              style={{
                background  : 'transparent',
                border      : '1px solid rgba(255,255,255,0.5)',
                color       : 'white',
                padding     : '4px 12px',
                borderRadius: 4,
                cursor      : 'pointer',
                fontSize    : 12,
              }}
            >
              ← Back to Search
            </button>
          </div>

          {currentPage === 1 && <Page1 formData={formData} setFormData={setFormData} />}
          {currentPage === 2 && <Page2 formData={formData} setFormData={setFormData} />}
          {currentPage === 3 && <Page3 formData={formData} setFormData={setFormData} />}
          {currentPage === 4 && <Page4 formData={formData} setFormData={setFormData} />}

          {submitStatus && (
            <div style={{
              maxWidth    : 999,
              margin      : '12px auto',
              padding     : '14px 20px',
              borderRadius: 6,
              whiteSpace  : 'pre-line',
              fontSize    : 13,
              lineHeight  : 1.6,
              background  : submitStatus === 'success' ? '#e8f5ee'
                          : submitStatus === 'error'   ? '#fff3f3'
                          :                             '#f0f4ff',
              border      : `1px solid ${
                            submitStatus === 'success' ? '#b3d9c3'
                          : submitStatus === 'error'   ? '#ffbdbd'
                          :                             '#c0ccff'}`,
              color       : submitStatus === 'success' ? '#1a4a2a'
                          : submitStatus === 'error'   ? '#a00'
                          :                             '#333',
            }}>
              {submitMessage}
            </div>
          )}

            <FormFooter
            currentPage={currentPage}
            totalPages={4}
            onNext={nextPage}
            onBack={previousPage}
            onSubmit={handleSubmit}
            submitDisabled={submitStatus === 'loading' || submitStatus === 'success'}
            submitLabel="Submit Amendment"
            />

        </div>
      </div>

      <CopilotPanel
        formData={formData}
        setFormData={setFormData}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />

    </div>
  )
}

export default AmendForm