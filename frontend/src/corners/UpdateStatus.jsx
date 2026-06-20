import { useState, useEffect } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import '../styles/start.css'
import '../styles/buyer.css'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

const BUYERS = [
  { label: 'Kudas Ganesan',  value: 'kudas.ganesan@agr.gc.ca'  },
  { label: 'Chris Ragasa',   value: 'ragasa.chris@agr.gc.ca'   },
  { label: 'Employee 3',     value: 'employee3@agr.gc.ca'      },
  { label: 'Employee 4',     value: 'employee4@agr.gc.ca'      },
  { label: 'Employee 5',     value: 'employee5@agr.gc.ca'      },
]

function UpdateStatus({ onBack, initialRequestId = '' }) {
  const [requestId, setRequestId] = useState(initialRequestId)
  const [searching, setSearching] = useState(false)
  const [record, setRecord]       = useState(null)
  const [error, setError]         = useState('')
  const [saving, setSaving]       = useState(false)
  const [success, setSuccess]     = useState('')

  const [fields, setFields] = useState({
    status              : '',
    priority            : '',
    assignedTo          : '',
    comments            : '',
    notes               : '',
    sapCommitment       : '',
    commodityType       : '',
    estimatedValue      : '',
    elections           : '',
    itTicketNumber      : '',
    prbNumber           : '',
    confirmingOrder     : '',
    requisitionNumber   : '',
    cmi                 : '',
    solicitationNumber  : '',
    solicitationClosing : '',
    timeZone            : '',
    linkToCanadaBuys    : '',
    supplierName        : '',
    procurementVehicle  : '',
    taNumber            : '',
    taAmendmentNumber   : '',
    contractAmendNumber : '',
  })

  const set = (key, val) => setFields(prev => ({ ...prev, [key]: val }))

  const handleSearch = async () => {
    setError('')
    setRecord(null)
    setSuccess('')

    if (!requestId.trim()) {
      setError('Please enter a Request ID.')
      return
    }

    setSearching(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/buyer/search`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: requestId.trim().toUpperCase() }),
      })

      const result = await response.json()

      if (!response.ok || !result.items?.length) {
        setError('Request not found. Please check the ID and try again.')
        return
      }

      const item = result.items[0]
      setRecord(item)

      // Pre-fill editable fields from SPO
      setFields({
        status              : item.ProgressStatus0?.Value || item.ProgressStatus?.Value || '',
        priority            : item.Priority?.Value        || '',
        assignedTo          : item.Assignt                || '',
        comments            : item.Comments               || '',
        notes               : item.Notes                  || '',
        sapCommitment       : item.SAP_x0020_Commitment_x0020_Number || '',
        commodityType       : item.CommodityType?.Value   || '',
        estimatedValue      : item.EstimatedValue         || '',
        elections           : item.Elections              || '',
        itTicketNumber      : item.IT_x0020_Ticket_x0020_Number || '',
        prbNumber           : item.PRB_x0020_Number       || '',
        confirmingOrder     : item.Confirming_x0020_Order || '',
        requisitionNumber   : item.Requisition_x0020_Number || '',
        cmi                 : item.CMI                    || '',
        solicitationNumber  : item.Solicitation_x0020_Number || '',
        solicitationClosing : item.Solicitation_x0020_Closing || '',
        timeZone            : item.Time_x0020_Zone        || '',
        linkToCanadaBuys    : item.Link_x0020_to_x0020_CanadaBuys || '',
        supplierName        : item.Supplier_x0020_Name    || '',
        procurementVehicle  : item.Procurement_x0020_Vehicle || '',
        taNumber            : item.TA_x0020_Number        || '',
        taAmendmentNumber   : item.TA_x0020_Amendment_x0020_Number || '',
        contractAmendNumber : item.Contract_x0020_Amendment_x0020_Number || '',
      })

    } catch (err) {
      setError('Unable to connect to the server.')
    } finally {
      setSearching(false)
    }
  }

  useEffect(() => {
    if (initialRequestId) handleSearch()
  }, [initialRequestId]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleUpdate = async () => {
    setError('')
    setSuccess('')
    setSaving(true)

    try {
      const response = await fetch(`${BACKEND_URL}/api/buyer/update`, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/json' },
        body    : JSON.stringify({ spoItemId: record.ID, fields }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || 'Update failed.')
        return
      }

      setSuccess('✅ SharePoint updated successfully!')

    } catch (err) {
      setError('Unable to connect to the server.')
    } finally {
      setSaving(false)
    }
  }

  const inputStyle = {
    width        : '100%',
    padding      : '8px 12px',
    border       : '1px solid #ddd',
    borderRadius : 6,
    fontSize     : 12,
    fontFamily   : 'Arial',
    outline      : 'none',
    boxSizing    : 'border-box',
  }

  const labelStyle = {
    fontSize   : 11,
    fontWeight : 600,
    color      : '#555',
    marginBottom: 4,
    display    : 'block',
    fontFamily : 'Arial',
  }

  const fieldGroup = (label, key, type = 'text') => (
    <div style={{ marginBottom: 12 }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        style={inputStyle}
        value={fields[key]}
        onChange={(e) => set(key, e.target.value)}
      />
    </div>
  )

  return (
    <div className="start-wrapper">

      <Header />

      <div className="buyer-body">

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
          Back to Buyer Corner
        </button>

        {/* TITLE */}
        <div className="buyer-page-title">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#185FA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 11 12 14 22 4"/>
            <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
          </svg>
          Update Status
        </div>

        {/* SEARCH */}
        <div className="buyer-search-bar" style={{ marginBottom: 24 }}>
          <input
            type="text"
            placeholder="Enter Request ID e.g. ESC-2627-5"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="buyer-input"
            autoFocus
          />
          <button
            onClick={handleSearch}
            disabled={searching}
            className="buyer-search-btn"
          >
            {searching ? 'Searching...' : 'Find Request'}
          </button>
        </div>

        {/* ERROR */}
        {error && <div className="buyer-error">⚠️ {error}</div>}

        {/* SUCCESS */}
        {success && (
          <div style={{
            background   : '#e8f5ee',
            border       : '1px solid #b3ffcc',
            borderRadius : 6,
            padding      : '8px 12px',
            fontSize     : 12,
            color        : '#1a6b3c',
            marginBottom : 16,
            fontFamily   : 'Arial',
          }}>
            {success}
          </div>
        )}

        {/* FORM */}
        {record && (
          <div style={{ display: 'flex', gap: 24 }}>

            {/* LEFT — READ ONLY INFO (1/3) */}
            <div style={{
              width        : '33%',
              flexShrink   : 0,
              background   : '#f8faff',
              border       : '1px solid #e0e8ff',
              borderRadius : 10,
              padding      : 20,
              fontFamily   : 'Arial',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', marginBottom: 16 }}>
                Request Info
              </div>

              {[
                ['Request ID',    record.Title],
                ['Client',        record.Requester],
                ['Branch',        record.Branch],
                ['Business Owner',record.BusinessOwner],
                ['Submitted',     record.DateReceived ? new Date(record.DateReceived).toLocaleDateString('en-CA') : '—'],
                ['Estimated Cost',record.EstimatedValue ? `$${record.EstimatedValue}` : '—'],
                ['Current Status',record.ProgressStatus0?.Value || record.ProgressStatus?.Value || '—'],
              ].map(([label, value]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: 10, color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {label}
                  </div>
                  <div style={{ fontSize: 13, color: '#333', marginTop: 2 }}>
                    {value || '—'}
                  </div>
                </div>
              ))}
            </div>

            {/* RIGHT — EDITABLE FIELDS (2/3) */}
            <div style={{ flex: 1 }}>

              <div style={{ fontSize: 13, fontWeight: 700, color: '#185FA5', marginBottom: 16 }}>
                Update Fields
              </div>

              {/* STATUS */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Status</label>
                <select style={inputStyle} value={fields.status} onChange={(e) => set('status', e.target.value)}>
                  <option value="">Select status...</option>
                  <option>Pending Signature</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                  <option>On Hold</option>
                  <option>Cancelled</option>
                </select>
              </div>

              {/* PRIORITY */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Priority</label>
                <select style={inputStyle} value={fields.priority} onChange={(e) => set('priority', e.target.value)}>
                  <option value="">Select priority...</option>
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>

              {/* ASSIGNED TO */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Assigned To</label>
                <select style={inputStyle} value={fields.assignedTo} onChange={(e) => set('assignedTo', e.target.value)}>
                  <option value="">Select buyer...</option>
                  {BUYERS.map(b => (
                    <option key={b.value} value={b.value}>{b.label}</option>
                  ))}
                </select>
              </div>

              {/* COMMENTS */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Comments</label>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: 'vertical' }}
                  value={fields.comments}
                  onChange={(e) => set('comments', e.target.value)}
                />
              </div>

              {/* NOTES */}
              <div style={{ marginBottom: 12 }}>
                <label style={labelStyle}>Notes</label>
                <textarea
                  style={{ ...inputStyle, height: 80, resize: 'vertical' }}
                  value={fields.notes}
                  onChange={(e) => set('notes', e.target.value)}
                />
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} />

              {/* BUYER FIELDS */}
              {fieldGroup('SAP Commitment Number', 'sapCommitment')}
              {fieldGroup('Estimated Value', 'estimatedValue')}
              {fieldGroup('Elections', 'elections')}
              {fieldGroup('IT Ticket Number', 'itTicketNumber')}
              {fieldGroup('PRB Number', 'prbNumber')}
              {fieldGroup('Confirming Order', 'confirmingOrder')}
              {fieldGroup('Requisition Number', 'requisitionNumber')}
              {fieldGroup('CMI / IMC', 'cmi')}
              {fieldGroup('Solicitation Number', 'solicitationNumber')}
              {fieldGroup('Solicitation Closing', 'solicitationClosing')}
              {fieldGroup('Time Zone', 'timeZone')}
              {fieldGroup('Link to CanadaBuys', 'linkToCanadaBuys')}
              {fieldGroup('Supplier Name', 'supplierName')}
              {fieldGroup('Procurement Vehicle', 'procurementVehicle')}
              {fieldGroup('TA Number', 'taNumber')}
              {fieldGroup('TA Amendment Number', 'taAmendmentNumber')}
              {fieldGroup('Contract Amendment Number', 'contractAmendNumber')}

              {/* UPDATE BUTTON */}
              <button
                onClick={handleUpdate}
                disabled={saving}
                style={{
                  marginTop    : 20,
                  padding      : '12px 32px',
                  background   : saving ? '#aaa' : '#185FA5',
                  color        : 'white',
                  border       : 'none',
                  borderRadius : 8,
                  fontSize     : 14,
                  fontWeight   : 600,
                  cursor       : saving ? 'not-allowed' : 'pointer',
                  fontFamily   : 'Arial',
                  width        : '100%',
                  transition   : 'background 0.15s',
                }}
              >
                {saving ? 'Updating...' : '💾 Update SharePoint'}
              </button>

            </div>
          </div>
        )}

      </div>

      <Footer />

    </div>
  )
}

export default UpdateStatus