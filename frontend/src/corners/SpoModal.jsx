// SpoModal — shows SharePoint list data + BO documentation for a single request

const FIELD_LABEL = {
  Title                              : 'Request ID',
  Requester                          : 'Client Name',
  RequesterEmail                     : 'Client Email',
  Branch                             : 'Client Branch',
  BusinessOwner                      : 'Business Owner',
  BusinessOwnerEmail                 : 'BO Email',
  BusinessOwnerBranch                : 'BO Branch',
  RequirementType                    : 'Requirement Type',
  DateReceived                       : 'Date Submitted',
  Modified                           : 'Last Modified',
  EstimatedValue                     : 'Estimated Value',
  Assignt                            : 'Assigned Buyer',
  Comments                           : 'Comments',
  Notes                              : 'Procurement Notes',
  SAP_x0020_Commitment_x0020_Number  : 'SAP Commitment #',
  Solicitation_x0020_Number          : 'Solicitation #',
  Solicitation_x0020_Closing         : 'Solicitation Closing',
  IT_x0020_Ticket_x0020_Number       : 'IT Ticket #',
  PRB_x0020_Number                   : 'PRB #',
  Confirming_x0020_Order             : 'Confirming Order',
  Requisition_x0020_Number           : 'Requisition #',
  CMI                                : 'CMI / IMC',
  Time_x0020_Zone                    : 'Time Zone',
  Link_x0020_to_x0020_CanadaBuys     : 'CanadaBuys Link',
  Supplier_x0020_Name                : 'Supplier Name',
  Procurement_x0020_Vehicle          : 'Procurement Vehicle',
  TA_x0020_Number                    : 'TA Number',
  TA_x0020_Amendment_x0020_Number    : 'TA Amendment #',
  Contract_x0020_Amendment_x0020_Number: 'Contract Amendment #',
  Elections                          : 'Elections',
}

const DOC_MAP = {
  statementOfRequirement  : 'Statement of Requirement',
  statementOfWork         : 'Statement of Work',
  investmentAuthorityRequest: 'Investment Authority Request',
  evaluationCriteria      : 'Evaluation Criteria',
  functionalApprovalsAttached: 'Functional Approvals',
  specificationPlans      : 'Specification / Plans',
  srclAttached            : 'SRCL (Security Req. Checklist)',
  proposalQuote           : 'Proposal / Quote',
  ssltcAttached           : 'SSLTC',
  otherDocuments          : 'Other Documents',
}

function Row({ label, value }) {
  if (!value) return null
  return (
    <div style={{ display:'flex', gap:8, padding:'5px 0', borderBottom:'1px solid #f0f0f0', fontFamily:'Arial', fontSize:12 }}>
      <div style={{ width:180, flexShrink:0, color:'#888', fontSize:11, fontWeight:600, paddingTop:1 }}>{label}</div>
      <div style={{ flex:1, color:'#222', wordBreak:'break-word' }}>{value}</div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:11, fontWeight:700, color:'#6B3FA0', textTransform:'uppercase', letterSpacing:0.6, marginBottom:8, fontFamily:'Arial' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

export default function SpoModal({ item, onClose }) {
  if (!item) return null

  const statusVal = item.ProgressStatus0?.Value || item.ProgressStatus?.Value || '—'
  const priorityVal = item.Priority?.Value || '—'

  // Try to parse FormDataJSON for richer BO info
  let formData = null
  try {
    if (item.FormDataJSON) formData = JSON.parse(item.FormDataJSON)
  } catch { /* ignore parse error */ }

  const fmt = (val) => val || '—'
  const fmtDate = (val) => val ? new Date(val).toLocaleDateString('en-CA') : '—'
  const fmtMoney = (val) => val ? `$${Number(val).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'

  const spoFields = Object.entries(FIELD_LABEL).filter(([key]) => {
    const skip = ['Title','Requester','RequesterEmail','Branch','BusinessOwner','BusinessOwnerEmail','BusinessOwnerBranch',
                  'RequirementType','DateReceived','EstimatedValue','Assignt','Modified','Comments','Notes']
    return !skip.includes(key)
  })

  return (
    <div style={{
      position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:1000,
      display:'flex', alignItems:'flex-start', justifyContent:'center', overflowY:'auto', padding:'32px 16px',
    }} onClick={e => e.target === e.currentTarget && onClose()}>

      <div style={{
        background:'#fff', borderRadius:14, width:'100%', maxWidth:820,
        boxShadow:'0 20px 60px rgba(0,0,0,0.25)', display:'flex', flexDirection:'column',
      }}>

        {/* MODAL HEADER */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'16px 24px', borderBottom:'2px solid #f0e8ff', background:'#faf4ff',
          borderRadius:'14px 14px 0 0',
        }}>
          <div>
            <div style={{ fontSize:16, fontWeight:700, color:'#6B3FA0', fontFamily:'Arial' }}>{item.Title}</div>
            <div style={{ fontSize:11, color:'#999', fontFamily:'Arial', marginTop:2 }}>
              SharePoint List Record · Status: <strong style={{ color:'#333' }}>{statusVal}</strong> · Priority: <strong style={{ color:'#333' }}>{priorityVal}</strong>
            </div>
          </div>
          <button onClick={onClose} style={{
            background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:20, lineHeight:1, padding:4,
          }}>×</button>
        </div>

        {/* MODAL BODY */}
        <div style={{ padding:'24px', overflowY:'auto', maxHeight:'76vh' }}>

          <div style={{ display:'flex', gap:24, flexWrap:'wrap' }}>

            {/* LEFT COLUMN */}
            <div style={{ flex:1, minWidth:300 }}>

              <Section title="Client Information">
                <Row label="Client Name"   value={fmt(item.Requester)} />
                <Row label="Client Email"  value={fmt(item.RequesterEmail || formData?.clientEmail)} />
                <Row label="Branch"        value={fmt(item.Branch)} />
                <Row label="Date Submitted" value={fmtDate(item.DateReceived)} />
              </Section>

              <Section title="Business Owner">
                <Row label="Name"    value={fmt(item.BusinessOwner || (formData && `${formData.businessOwnerFirstName||''} ${formData.businessOwnerLastName||''}`.trim()) || null)} />
                <Row label="Email"   value={fmt(item.BusinessOwnerEmail || formData?.businessOwnerEmail)} />
                <Row label="Branch"  value={fmt(item.BusinessOwnerBranch || formData?.businessOwnerBranch)} />
              </Section>

              <Section title="Requirement">
                <Row label="Type"        value={fmt(item.RequirementType || formData?.servicesSelected && 'Services' || formData?.goodsSelected && 'Goods' || formData?.constructionSelected && 'Construction')} />
                <Row label="Start Date"  value={fmtDate(formData?.servicesStartDate || formData?.goodsDeliveryDate)} />
                <Row label="End Date"    value={fmtDate(formData?.servicesEndDate)} />
                <Row label="Est. Cost"   value={fmtMoney(item.EstimatedValue || formData?.totalEstimatedCost)} />
                <Row label="Assigned To" value={fmt(item.Assignt)} />
                {formData?.requirementDescription && (
                  <div style={{ marginTop:8 }}>
                    <div style={{ fontSize:11, color:'#888', fontWeight:600, fontFamily:'Arial', marginBottom:4 }}>Description</div>
                    <div style={{ fontSize:12, color:'#444', fontFamily:'Arial', lineHeight:1.6, background:'#f8f4ff', padding:'8px 12px', borderRadius:6 }}>
                      {formData.requirementDescription}
                    </div>
                  </div>
                )}
              </Section>

            </div>

            {/* RIGHT COLUMN */}
            <div style={{ flex:1, minWidth:300 }}>

              <Section title="Procurement Notes">
                {(item.Comments || item.Notes) ? (
                  <>
                    {item.Comments && <Row label="Comments" value={item.Comments} />}
                    {item.Notes    && <Row label="Notes"    value={item.Notes}    />}
                    {formData?.procurementNotes && <Row label="Procurement Notes" value={formData.procurementNotes} />}
                  </>
                ) : (
                  <div style={{ color:'#bbb', fontSize:12, fontFamily:'Arial' }}>No notes on record.</div>
                )}
              </Section>

              <Section title="Supporting Documents">
                {formData ? (
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {Object.entries(DOC_MAP).map(([key, label]) =>
                      formData[key] ? (
                        <span key={key} style={{
                          padding:'3px 10px', background:'#e8f5ee', color:'#1a6b3c',
                          borderRadius:12, fontSize:10, fontWeight:600, fontFamily:'Arial',
                        }}>
                          ✓ {label}
                        </span>
                      ) : null
                    )}
                    {!Object.keys(DOC_MAP).some(k => formData[k]) && (
                      <div style={{ color:'#bbb', fontSize:12, fontFamily:'Arial' }}>No documents attached.</div>
                    )}
                  </div>
                ) : (
                  <div style={{ color:'#bbb', fontSize:12, fontFamily:'Arial' }}>Full form data not available.</div>
                )}
              </Section>

              <Section title="Additional SPO Fields">
                {spoFields.map(([key, label]) => {
                  const raw = item[key]
                  const val = raw?.Value || raw
                  if (!val) return null
                  const display = key.toLowerCase().includes('date') || key.toLowerCase().includes('closing')
                    ? fmtDate(val) : String(val)
                  return <Row key={key} label={label} value={display} />
                })}
              </Section>

            </div>
          </div>

        </div>

        {/* FOOTER */}
        <div style={{
          display:'flex', justifyContent:'flex-end', padding:'12px 24px',
          borderTop:'1px solid #f0f0f0', background:'#fafafa', borderRadius:'0 0 14px 14px',
        }}>
          <button onClick={onClose} style={{
            padding:'8px 24px', background:'#6B3FA0', color:'#fff', border:'none',
            borderRadius:7, fontSize:13, fontWeight:600, cursor:'pointer', fontFamily:'Arial',
          }}>
            Close
          </button>
        </div>

      </div>
    </div>
  )
}
