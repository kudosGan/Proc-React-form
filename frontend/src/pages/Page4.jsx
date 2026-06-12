import React, { useState } from 'react'
import FormLayout from '../components/FormLayout'
import Section from '../components/Section'
import TableField from '../components/TableField'
import FileUpload from '../components/FileUpload'

function Page4({ formData, setFormData }) {

  const [activeSigField, setActiveSigField] = useState(null)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [agreed, setAgreed] = useState(false)

  const branches = [
    'Corporate Management Branch',
    "Deputy Minister's Office",
    'Human Resources Branch',
    'International Affairs Branch',
    'Legal Services',
    'Market and Industry Services Branch',
    "Minister's Office",
    'Office of Audit and Evaluation',
    'Program Branch',
    'Public Affairs Branch',
    'Science and Technology Branch',
    'Strategic Policy Branch'
  ]

  const handleOpenModal = (fieldKey) => {
    setActiveSigField(fieldKey)
    setFirstName('')
    setLastName('')
    setAgreed(false)
  }

  const handleCloseModal = () => {
    setActiveSigField(null)
  }

  const handleSignSubmit = (e) => {
    e.preventDefault()
    if (!agreed || !firstName.trim() || !lastName.trim()) return

    const today         = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    const formattedTime = today.toTimeString().split(' ')[0]
    const fullName      = `${firstName} ${lastName}`

    if (activeSigField === 'recommended') {
      setFormData({
        ...formData,
        recommendedSignature: fullName,
        recommendedDate     : formattedDate,
        recommendedSignedAt : `${formattedDate} ${formattedTime}`
      })
    }
    if (activeSigField === 'confirmed') {
      setFormData({
        ...formData,
        confirmedSignature: fullName,
        confirmedDate     : formattedDate,
        confirmedSignedAt : `${formattedDate} ${formattedTime}`
      })
    }
    if (activeSigField === 'final') {
      setFormData({
        ...formData,
        section32Signature: fullName,
        section32Date     : formattedDate,
        section32SignedAt : `${formattedDate} ${formattedTime}`
      })
    }

    handleCloseModal()
  }

  return (
    <FormLayout>

      <div className="form-title">
        PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
      </div>

      {/* ===================================================== */}
      {/* PART 5 */}
      {/* ===================================================== */}

      <Section title="PART 5 – FINANCIAL INFORMATION AND AUTHORIZATION">
        <div className="section-body">

          <p className="notice-bold">
            <strong>For all requests:</strong> Should there be shared funding from more than one Responsibility Centre Manager, please attach additional Authority Request (AR) as required to your procurement request.
          </p>

          <p className="notice-bold" style={{ borderBottom: '1px solid #000', paddingBottom: '8px' }}>
            <strong>For construction requirements only:</strong> If financial information and authorization are provided through an approved Investment Authority Request (IAR) attached to the PRF, this section may remain blank.
          </p>

          {/* RECOMMENDED */}
          <div className="auth-group-title">Recommended</div>
          <table className="signature-grid-table">
            <tbody>
              <tr>
                <td style={{ width: '28%' }}>
                  <label className="field-label">Name (Print)</label>
                  <TableField
                    value={formData.recommendedName}
                    onChange={(e) => setFormData({ ...formData, recommendedName: e.target.value })}
                  />
                </td>
                <td style={{ width: '28%' }}>
                  <label className="field-label">Position title</label>
                  <TableField
                    value={formData.recommendedTitle}
                    onChange={(e) => setFormData({ ...formData, recommendedTitle: e.target.value })}
                  />
                </td>
                <td className="bg-blue-light" style={{ width: '28%', position: 'relative' }}>
                  <label className="field-label">Signature</label>
                  {formData.recommendedSignature ? (
                    <div className="digital-sig-badge">
                      <span className="sig-icon">🔒</span>
                      <span className="sig-name">{formData.recommendedSignature}</span>
                      <span className="sig-date">{formData.recommendedSignedAt}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="sign-btn-trigger"
                      onClick={() => handleOpenModal('recommended')}
                    >
                      Click to Sign
                    </button>
                  )}
                </td>
                <td style={{ width: '16%' }}>
                  <label className="field-label">Date</label>
                  <input
                    type="date"
                    className="table-input-plain"
                    value={formData.recommendedDate}
                    onChange={(e) => setFormData({ ...formData, recommendedDate: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* CONFIRMED */}
          <div className="auth-group-title" style={{ marginTop: '10px' }}>
            Confirmed that the funds are available
          </div>
          <table className="signature-grid-table">
            <tbody>
              <tr>
                <td style={{ width: '28%' }}>
                  <label className="field-label">Name (Print)</label>
                  <TableField
                    value={formData.confirmedName}
                    onChange={(e) => setFormData({ ...formData, confirmedName: e.target.value })}
                  />
                </td>
                <td style={{ width: '28%' }}>
                  <label className="field-label">Position title</label>
                  <TableField
                    value={formData.confirmedTitle}
                    onChange={(e) => setFormData({ ...formData, confirmedTitle: e.target.value })}
                  />
                </td>
                <td className="bg-blue-light" style={{ width: '28%', position: 'relative' }}>
                  <label className="field-label">Signature</label>
                  {formData.confirmedSignature ? (
                    <div className="digital-sig-badge">
                      <span className="sig-icon">🔒</span>
                      <span className="sig-name">{formData.confirmedSignature}</span>
                      <span className="sig-date">{formData.confirmedSignedAt}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="sign-btn-trigger"
                      onClick={() => handleOpenModal('confirmed')}
                    >
                      Click to Sign
                    </button>
                  )}
                </td>
                <td style={{ width: '16%' }}>
                  <label className="field-label">Date</label>
                  <input
                    type="date"
                    className="table-input-plain"
                    value={formData.confirmedDate}
                    onChange={(e) => setFormData({ ...formData, confirmedDate: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>

          {/* RESPONSIBILITY CENTRE */}
          <table className="meta-info-grid">
            <tbody>
              <tr>
                <td style={{ width: '60%' }}>
                  <div className="meta-inline">
                    <span>Responsibility Centre Manager:</span>
                    <input
                      type="text"
                      className="bg-blue-light border-bottom-only"
                      value={formData.responsibilityCentreManager}
                      onChange={(e) => setFormData({ ...formData, responsibilityCentreManager: e.target.value })}
                    />
                  </div>
                </td>
                <td style={{ width: '40%' }}>
                  <div className="meta-inline">
                    <span>Title:</span>
                    <input
                      type="text"
                      className="bg-blue-light border-bottom-only"
                      value={formData.responsibilityTitle}
                      onChange={(e) => setFormData({ ...formData, responsibilityTitle: e.target.value })}
                    />
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className="meta-inline">
                    <span>Branch:</span>
                    <select
                      className="bg-blue-light border-bottom-only"
                      value={formData.responsibilityBranch}
                      onChange={(e) => setFormData({ ...formData, responsibilityBranch: e.target.value })}
                    >
                      <option value="">Select a Branch</option>
                      {branches.map((branch) => (
                        <option key={branch} value={branch}>{branch}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td>
                  <div className="meta-inline">
                    <span>Division:</span>
                    <input
                      type="text"
                      className="bg-blue-light border-bottom-only"
                      value={formData.responsibilityDivision}
                      onChange={(e) => setFormData({ ...formData, responsibilityDivision: e.target.value })}
                    />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          {/* FINANCIAL TABLE */}
          <table className="financial-data-table">
            <thead>
              <tr>
                <th style={{ width: '35px' }}></th>
                <th style={{ width: '80px' }}>Fiscal Year</th>
                <th style={{ width: '100px' }}>General Ledger</th>
                <th style={{ width: '60px' }}>Fund</th>
                <th style={{ width: '80px' }}>WBS/E</th>
                <th style={{ width: '110px' }}>Program Activity</th>
                <th style={{ width: '90px' }}>Cost Centre</th>
                <th style={{ width: '70px' }}>Asset</th>
                <th style={{ width: '100px' }}>Internal Order</th>
                <th>Amount (CAD $)</th>
              </tr>
            </thead>
            <tbody>
              {formData.financialRows.map((row, index) => (
                <tr key={index}>
                  <td className="action-cells">
                    <button
                      type="button"
                      className="small-action-btn"
                      onClick={() => setFormData({
                        ...formData,
                        financialRows: [
                          ...formData.financialRows,
                          { fiscalYear: '', generalLedger: '', fund: '', wbse: '', programActivity: '', costCentre: '', asset: '', internalOrder: '', amount: '' }
                        ]
                      })}
                    >+</button>
                    <button
                      type="button"
                      className="small-action-btn"
                      onClick={() => {
                        if (formData.financialRows.length > 1)
                          setFormData({ ...formData, financialRows: formData.financialRows.slice(0, -1) })
                      }}
                    >-</button>
                  </td>
                  <td>
                    <TableField value={row.fiscalYear} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].fiscalYear = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.generalLedger} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].generalLedger = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.fund} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].fund = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.wbse} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].wbse = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.programActivity} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].programActivity = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.costCentre} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].costCentre = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.asset} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].asset = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.internalOrder} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].internalOrder = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                  <td>
                    <TableField value={row.amount} onChange={(e) => {
                      const r = [...formData.financialRows]; r[index].amount = e.target.value
                      setFormData({ ...formData, financialRows: r })
                    }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* SECTION 32 */}
          <div className="certification-notice">
            By signing, you are certifying pursuant to Expenditure Initiation with Availability of Funds, section 32(1) of the Financial Administration Act (FAA).
          </div>
          <table className="signature-grid-table" style={{ marginTop: '5px' }}>
            <tbody>
              <tr>
                <td className="bg-blue-light" style={{ width: '60%', position: 'relative' }}>
                  <label className="field-label">Signature</label>
                  {formData.section32Signature ? (
                    <div className="digital-sig-badge">
                      <span className="sig-icon">🔒</span>
                      <span className="sig-name">{formData.section32Signature}</span>
                      <span className="sig-date">{formData.section32SignedAt}</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="sign-btn-trigger"
                      onClick={() => handleOpenModal('final')}
                    >
                      Click to Sign
                    </button>
                  )}
                </td>
                <td style={{ width: '40%' }}>
                  <label className="field-label">Date</label>
                  <input
                    type="date"
                    className="table-input-plain"
                    value={formData.section32Date}
                    onChange={(e) => setFormData({ ...formData, section32Date: e.target.value })}
                  />
                </td>
              </tr>
            </tbody>
          </table>

        </div>
      </Section>

      {/* ===================================================== */}
      {/* PART 6 */}
      {/* ===================================================== */}

      <Section title="PART 6 – SUPPORTING DOCUMENTS ATTACHED">
        <div className="section-body" style={{ padding: '10px' }}>

          <div className="checkbox-grid">
            <label>
              <input
                type="checkbox"
                checked={formData.statementOfRequirement}
                onChange={(e) => setFormData({ ...formData, statementOfRequirement: e.target.checked })}
              />
              Statement of Requirement (Goods)
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.statementOfWork}
                onChange={(e) => setFormData({ ...formData, statementOfWork: e.target.checked })}
              />
              Statement of Work (Services)
            </label>
            <label>
              <input
                type="checkbox"
                checked={formData.investmentAuthorityRequest}
                onChange={(e) => setFormData({ ...formData, investmentAuthorityRequest: e.target.checked })}
              />
              Investment Authority Request
            </label>
          </div>

          {/* FILE UPLOAD */}
          <div style={{ borderTop: '1px solid #ddd', marginTop: 12, paddingTop: 4 }}>
            <FileUpload
              files={Array.isArray(formData.uploadedFiles) ? formData.uploadedFiles : []}
              setFiles={(newFiles) => {
                if (typeof newFiles === 'function') {
                  setFormData(prev => ({
                    ...prev,
                    uploadedFiles: newFiles(prev.uploadedFiles || [])
                  }))
                } else {
                  setFormData(prev => ({ ...prev, uploadedFiles: newFiles }))
                }
              }}
            />
          </div>

        </div>
      </Section>

      {/* ===================================================== */}
      {/* PART 7 */}
      {/* ===================================================== */}

      <Section title="PART 7 – ADDITIONAL NOTES TO DESIGNATED PROCUREMENT OFFICE">
        <div className="section-body bg-blue-light" style={{ padding: '10px' }}>
          <textarea
            className="styled-textarea-transparent"
            rows={5}
            placeholder="Enter notes..."
            value={formData.procurementNotes}
            onChange={(e) => setFormData({ ...formData, procurementNotes: e.target.value })}
          />
        </div>
      </Section>

      {/* ===================================================== */}
      {/* SIGNATURE MODAL */}
      {/* ===================================================== */}

      {activeSigField && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-header">Digital Signature Authorization</h3>
            <form onSubmit={handleSignSubmit}>
              <div className="modal-consent-box">
                <label className="consent-label">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                    required
                  />
                  <span className="consent-text">
                    I agree this serves as my electronic signature.
                  </span>
                </label>
              </div>
              <div className="modal-input-row">
                <div>
                  <label>First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div>
                  <label>Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Sign Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </FormLayout>
  )
}

export default Page4