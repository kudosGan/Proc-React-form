/**
 * PrintPage — renders all 4 pages matching original A9565-E exactly
 * Loaded at /print?data=...&fy=2627&id=ESC-2627-020
 * Puppeteer waits for .print-ready before printing
 */

import { useEffect, useState } from 'react'
import './styles/print.css'

// ─────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────

const Checkbox = ({ checked }) => (
  <span className={`print-checkbox ${checked ? 'checked' : ''}`} />
)

const YesNo = ({ value }) => (
  <div className="print-yesno">
    <label className="print-radio-label">
      <span className={`print-radio ${value === 'Yes' ? 'selected' : ''}`} />
      Yes
    </label>
    <label className="print-radio-label">
      <span className={`print-radio ${value === 'No' ? 'selected' : ''}`} />
      No
    </label>
  </div>
)

const Radio = ({ options, value }) => (
  <div className="print-radio-options">
    {options.map(opt => (
      <label key={opt} className="print-radio-label">
        <span className={`print-radio ${value === opt ? 'selected' : ''}`} />
        {opt}
      </label>
    ))}
  </div>
)

const Field = ({ label, value, blue = true }) => (
  <div style={{ padding: '3px 5px' }}>
    {label && <span className="print-field-label">{label}</span>}
    <div className={`print-field-value ${blue ? 'print-blue' : ''}`} style={{ padding: '2px 4px', minHeight: 18 }}>
      {value || '\u00A0'}
    </div>
  </div>
)

const TextArea = ({ value, minHeight = 40 }) => (
  <div className="print-textarea-value" style={{ minHeight }}>
    {value || '\u00A0'}
  </div>
)

const SectionHeader = ({ title }) => (
  <div className="print-section-header">{title}</div>
)

const SubsectionHeader = ({ title }) => (
  <div className="print-subsection-header">{title}</div>
)

const SignatureField = ({ label, signature, signedAt, name, title }) => (
  <td className="print-signature-cell print-blue-light" style={{ width: '28%', verticalAlign: 'top' }}>
    <span className="print-field-label">{label}</span>
    {signature ? (
      <div className="print-sig-signed">
        <div className="print-sig-name">{signature}</div>
        <div className="print-sig-meta">
          Digitally signed by {name || signature}{title ? ` · ${title}` : ''}<br />{signedAt}
        </div>
      </div>
    ) : (
      <div><span className="print-sig-tag">&#9658; Sign Here</span></div>
    )}
  </td>
)

// ─────────────────────────────────────────
// PAGE WRAPPER with GoC header + footer
// ─────────────────────────────────────────

const PrintPage = ({ children, pageNum, totalPages, showTitle = true, formData }) => (
  <div className="print-page" style={{ pageBreakAfter: pageNum < totalPages ? 'always' : 'avoid' }}>
    {/* GOC HEADER */}
    <div className="print-header">
      <div className="print-header-left">
        <img
          src={`${window.location.origin}/canada-logo1.png`}
          alt="Government of Canada"
          className="print-header-logo"
          style={{ height: 40 }}
          onError={e => { e.target.style.display = 'none' }}
        />
        <div className="print-header-dept">
          Agriculture and<br />Agri-Food Canada
        </div>
      </div>
      <div className="print-header-right">
        Agriculture et<br />Agroalimentaire Canada
      </div>
    </div>

    {/* FORM TITLE */}
    {showTitle && (
      <div className="print-form-title">
        PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
      </div>
    )}

    {/* CONTENT */}
    <div style={{ flex: 1 }}>
      {children}
    </div>

    {/* GOC FOOTER */}
    <div className="print-footer">
      <div className="print-footer-ref">
        {`AAFC / AAC A9565 E (2026/02)   Page ${pageNum} of ${totalPages}`}
      </div>
      <img
        src={`${window.location.origin}/canada-wordmark.png`}
        alt="Canada"
        className="print-footer-canada"
        style={{ height: 26 }}
        onError={e => { e.target.style.display = 'none' }}
      />
    </div>
  </div>
)

// ─────────────────────────────────────────
// PAGE 1
// ─────────────────────────────────────────

const Page1Print = ({ f, submissionId, fiscalYear }) => (
  <PrintPage pageNum={1} totalPages={4} formData={f}>

    {/* SUBMISSION BANNER */}
    {submissionId && (
      <div className="print-ref-banner">
        <span>Procurement Request — {submissionId}</span>
        <span>Submitted: {new Date().toLocaleDateString('en-CA')}</span>
      </div>
    )}

    <div className="print-form-description">
      A completed signed copy of the form is to be sent to your designated procurement team.
      Should you have any questions or require assistance in the completion of this form,
      please contact your designated procurement team.
    </div>

    {/* PART 1 */}
    <div className="print-section">
      <SectionHeader title="PART 1 – CLIENT CONTACT INFORMATION" />
      <table className="print-table">
        <tbody>
          <tr>
            <td colSpan={2}><SubsectionHeader title="Client" /></td>
          </tr>
          <tr>
            <td style={{ width: '50%' }}><Field label="First Name:" value={f.clientFirstName} /></td>
            <td><Field label="Last Name:" value={f.clientLastName} /></td>
          </tr>
          <tr>
            <td><Field label="Email:" value={f.clientEmail} /></td>
            <td><Field label="Branch:" value={f.clientBranch} /></td>
          </tr>
          <tr>
            <td colSpan={2}><SubsectionHeader title="Business Owner" /></td>
          </tr>
          <tr>
            <td><Field label="First Name:" value={f.businessOwnerFirstName} /></td>
            <td><Field label="Last Name:" value={f.businessOwnerLastName} /></td>
          </tr>
          <tr>
            <td><Field label="Email:" value={f.businessOwnerEmail} /></td>
            <td><Field label="Branch:" value={f.businessOwnerBranch} /></td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* PART 2 */}
    <div className="print-section">
      <SectionHeader title="PART 2 – REQUIREMENT SUMMARY" />
      <table className="print-table">
        <tbody>
          {/* GOODS */}
          <tr>
            <td style={{ width: '30%' }}>
              <div className="print-checkbox-row">
                <Checkbox checked={f.goodsSelected} />
                <span style={{ fontWeight: f.goodsSelected ? 'bold' : 'normal' }}>GOOD(S)</span>
              </div>
            </td>
            <td>
              <Field label="Delivery Date (YYYY-MM-DD):" value={f.goodsDeliveryDate} />
            </td>
          </tr>
          {/* SERVICES */}
          <tr>
            <td>
              <div className="print-checkbox-row">
                <Checkbox checked={f.servicesSelected} />
                <span style={{ fontWeight: f.servicesSelected ? 'bold' : 'normal' }}>SERVICE(S)</span>
              </div>
            </td>
            <td>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 3 }}>
                <Field label="Start Date (YYYY-MM-DD):" value={f.servicesStartDate} />
                <Field label="End Date (YYYY-MM-DD):" value={f.servicesEndDate} />
              </div>
            </td>
          </tr>
          {/* CONSTRUCTION */}
          <tr>
            <td>
              <div className="print-checkbox-row">
                <Checkbox checked={f.constructionSelected} />
                <span style={{ fontWeight: f.constructionSelected ? 'bold' : 'normal' }}>CONSTRUCTION</span>
              </div>
            </td>
            <td>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 3 }}>
                <Field label="Start Date (YYYY-MM-DD):" value={f.constructionStartDate} />
                <Field label="End Date (YYYY-MM-DD):" value={f.constructionEndDate} />
              </div>
            </td>
          </tr>
          {/* DESCRIPTION */}
          <tr>
            <td colSpan={2}>
              <div style={{ padding: '4px 6px', fontSize: 10 }}>
                Please provide a brief description of the requirement, outlining the operational need it addresses and any relevant details.
              </div>
              <TextArea value={f.requirementDescription} minHeight={50} />
            </td>
          </tr>
          {/* PROCUREMENT STRATEGY */}
          <tr>
            <td>
              <div style={{ padding: '4px 6px', fontSize: 10 }}>
                Has the procurement strategy been considered?<br />
                If yes, please select from below:
              </div>
            </td>
            <td>
              <div className="print-inline-row">
                <YesNo value={f.procurementStrategy} />
              </div>
            </td>
          </tr>
          {/* STRATEGY OPTIONS */}
          <tr>
            <td colSpan={2}>
              <Radio
                options={['Competitive', 'Non-Competitive', 'Under Standing Offer (SO) or Supply Arrangement (SA)']}
                value={f.strategyOptions}
              />
            </td>
          </tr>
          {/* CONTINUATION */}
          <tr>
            <td>
              <div style={{ padding: '4px 6px', fontSize: 10 }}>
                Is this a continuation of an existing requirement/project?
              </div>
            </td>
            <td>
              <div className="print-inline-row"><YesNo value={f.continuationRequired} /></div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div style={{ padding: '2px 6px', fontSize: 10 }}>If yes, please elaborate below:</div>
              <TextArea value={f.continuationDetails} minHeight={36} />
            </td>
          </tr>
          {/* SUBSEQUENT NEED */}
          <tr>
            <td>
              <div style={{ padding: '4px 6px', fontSize: 10 }}>
                May there be a subsequent need? (i.e.: optional periods, optional quantities)
              </div>
            </td>
            <td>
              <div className="print-inline-row"><YesNo value={f.subsequentNeed} /></div>
            </td>
          </tr>
          {/* ALTERNATIVES */}
          <tr>
            <td>
              <div style={{ padding: '4px 6px', fontSize: 10 }}>
                Were alternatives to procurement considered (e.g. staffing)?
              </div>
            </td>
            <td>
              <div className="print-inline-row"><YesNo value={f.alternativesConsidered} /></div>
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <div style={{ padding: '2px 6px', fontSize: 10 }}>If yes, please elaborate below:</div>
              <TextArea value={f.alternativeDetails} minHeight={36} />
            </td>
          </tr>
          {/* FUNCTIONAL APPROVAL */}
          <tr>
            <td>
              <div style={{ padding: '4px 6px', fontSize: 10 }}>
                Has AAFC functional approval (i.e. Accommodations, Duty to Accommodate, IT, OIPC, PAB, etc.) been obtained, if applicable.
              </div>
            </td>
            <td>
              <div className="print-inline-row"><YesNo value={f.functionalApproval} /></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </PrintPage>
)

// ─────────────────────────────────────────
// PAGE 2
// ─────────────────────────────────────────

const Page2Print = ({ f }) => (
  <PrintPage pageNum={2} totalPages={4} formData={f} showTitle={false}>
    <div className="print-form-title" style={{ fontSize: 12, marginBottom: 6 }}>
      PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
    </div>

    {/* PART 3 */}
    <div className="print-section">
      <SectionHeader title="PART 3 – PROCUREMENT CONSIDERATIONS" />

      {/* ACCESSIBILITY */}
      <div style={{ borderBottom: '1px solid #777' }}>
        <SubsectionHeader title="Accessibility" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 4px 0', fontSize: 10, lineHeight: 1.4 }}>
            The Accessible Canada Act requires organizations under federal jurisdiction to identify, remove and prevent barriers to
            accessibility, including in procurement. We must ensure best practices on accessibility standards are applied, where applicable,
            to determine what is required for a good(s), service(s) or construction to be inclusive by design and accessible by default.
          </p>
          <div style={{ marginBottom: 4, fontSize: 10 }}>For this procurement request, accessibility criteria is:</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, marginBottom: 5 }}>
            {[
              { val: 'Included', label: 'Included as part of the technical specifications.' },
              { val: 'Not Applicable', label: 'Not Applicable (accessibility does not apply to this commodity, e.g. fuel, lubricants, bandwidth)' },
              { val: 'Not Available', label: 'Not Available (accessible goods, services or construction are not available on the market)' },
              { val: 'Other', label: 'Other (mandatory justification must be provided below)' },
            ].map(opt => (
              <label key={opt.val} className="print-radio-label" style={{ fontSize: 10, gap: 5 }}>
                <span className={`print-radio ${f.accessibilityType === opt.val ? 'selected' : ''}`} />
                {opt.label}
              </label>
            ))}
          </div>
          <div style={{ fontSize: 10, marginBottom: 2 }}>If other, please elaborate below:</div>
          <TextArea value={f.accessibilityDetails} minHeight={36} />
        </div>
      </div>

      {/* INDIGENOUS */}
      <div style={{ borderBottom: '1px solid #777' }}>
        <SubsectionHeader title="Indigenous" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            The Government of Canada is committed to economic reconciliation with Indigenous peoples and will contribute to improved
            socio-economic outcomes by increasing opportunities for Indigenous suppliers through the federal procurement process.
            AAFC works to advance reconciliation with Indigenous Peoples through a sustained departmental commitment.
          </p>
          <div className="print-inline-row" style={{ padding: 0, marginBottom: 4 }}>
            <span>For this procurement request, have Indigenous suppliers been considered?</span>
            <YesNo value={f.indigenousConsidered} />
          </div>
          <div style={{ fontSize: 10, marginBottom: 2 }}>If yes, provide details below:</div>
          <TextArea value={f.indigenousDetails} minHeight={36} />
        </div>
      </div>

      {/* ENVIRONMENTAL */}
      <div style={{ borderBottom: '1px solid #777' }}>
        <SubsectionHeader title="Environmental" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            The Policy on Green Procurement mandates the integration of environmental considerations, when possible, into the
            procurement decision-making process, including planning, acquisition, use and disposal.
          </p>
          <div className="print-inline-row" style={{ padding: 0, marginBottom: 4 }}>
            <span>For this procurement request, have environmental considerations been taken into account?</span>
            <YesNo value={f.environmentalConsidered} />
          </div>
          <div style={{ fontSize: 10, marginBottom: 2 }}>If yes, provide details below:</div>
          <TextArea value={f.environmentalDetails} minHeight={36} />
        </div>
      </div>

      {/* EMPLOYEE-EMPLOYER */}
      <div>
        <SubsectionHeader title="Employee-employer Relationship (for services and construction only)" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            No employee-employer relationship is to result from a contract for services or construction. A contract for services or
            construction that is initially sound should not develop over a period of time into a work situation that would constitute
            an employee-employer relationship according either to the Public Service Employment Act or the common law.
          </p>
          <div style={{ marginBottom: 5 }}>The following questions must be answered to ensure no employee-employer relationship will exist.</div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 5 }}>
            <tbody>
              {[
                { key: 'supervisoryControl', label: 'a) Will the department exercise any supervisory control over the contractor not only in achieving the objective but also with respect to how the work is carried out?' },
                { key: 'provideTools', label: 'b) Will the department provide any tools or facilities to enable the contractor to execute the contract?' },
                { key: 'workingHours', label: 'c) Will the contractor be expected to have the same working hours as the employee(s)?' },
              ].map(q => (
                <tr key={q.key}>
                  <td style={{ padding: '3px 0', fontSize: 10, verticalAlign: 'middle', lineHeight: 1.3 }}>{q.label}</td>
                  <td style={{ width: 90, textAlign: 'right', verticalAlign: 'middle' }}>
                    <YesNo value={f[q.key]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ fontSize: 10, marginBottom: 2 }}>If yes, provide mandatory justification below:</div>
          <TextArea value={f.employeeEmployerJustification} minHeight={36} />
        </div>
      </div>

    </div>
  </PrintPage>
)

// ─────────────────────────────────────────
// PAGE 3
// ─────────────────────────────────────────

const Page3Print = ({ f }) => {
  const subtotal = (f.estimatedCostRows || []).reduce((s, r) => s + (parseFloat(r.amount) || 0), 0)
  const travel   = parseFloat(f.travelExpenses) || 0
  const total    = subtotal + travel

  return (
    <PrintPage pageNum={3} totalPages={4} formData={f} showTitle={false}>
      <div className="print-form-title" style={{ fontSize: 12, marginBottom: 6 }}>
        PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
      </div>

      {/* IP */}
      <div className="print-section">
        <SectionHeader title="Intellectual Property" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            AAFC has an obligation to comply with the Policy on Title to Intellectual Property Arising Under Crown Procurement Contracts,
            as well as its own Policy on intellectual property for science and technology.
          </p>
          <div className="print-inline-row" style={{ padding: 0, marginBottom: 4 }}>
            <span>For this procurement request, is there a potential for the creation of intellectual property?</span>
            <YesNo value={f.ipPotential} />
          </div>
          <div style={{ marginBottom: 4 }}>If yes, who will own the intellectual property created by the Contractor under this contract?</div>
          <Radio options={['Contractor', 'Crown', 'IP not applicable']} value={f.ipOwner} />
          <p style={{ fontSize: 9, marginTop: 5 }}>For any questions, please contact AAFC's Office of Intellectual Property and Commercialization (OIPC).</p>
        </div>
      </div>

      {/* SECURITY */}
      <div className="print-section">
        <SectionHeader title="Security Requirement" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 4px 0', lineHeight: 1.4 }}>
            AAFC has an obligation to comply with the Policy on Government Security; requirements must identify and document whether there
            are security provisions associated with the contract.
          </p>
          <p style={{ margin: '0 0 4px 0', lineHeight: 1.4 }}>
            All services or construction requests must have a completed SRCL, even if no security provisions apply. For good(s) requests,
            a completed SRCL is dependent on the requirement.
          </p>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            Complete sections 1 to 13 of the Security Requirements Check List (SRCL) and attach to this request.
          </p>
          <div className="print-inline-row" style={{ padding: 0 }}>
            <span>For this procurement request, is there a security requirement?</span>
            <YesNo value={f.securityRequirement} />
          </div>
        </div>
      </div>

      {/* OFFICIAL LANGUAGES */}
      <div className="print-section">
        <SectionHeader title="Official Languages" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            AAFC must comply with the Official Languages Act and also remains responsible for the actions of a third party providing
            services to the public on their behalf.
          </p>
          <div className="print-inline-row" style={{ padding: 0 }}>
            <span>For this procurement request, have official languages requirements been met as per the Guide to Official Languages in Federal Procurement?</span>
            <YesNo value={f.officialLanguages} />
          </div>
        </div>
      </div>

      {/* LIFE CYCLE */}
      <div className="print-section">
        <SectionHeader title="Life Cycle Cost(s)" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 4px 0', lineHeight: 1.4 }}>
            AAFC's Life Cycle User Guide requires that life cycle cost considerations are identified and documented for all capital assets
            valued at $50,000 or above.
          </p>
          <p style={{ margin: '0 0 5px 0', lineHeight: 1.4 }}>
            For specific questions or conversations relating to this procurement request, including costing and potential funding needs,
            please speak with your designated Integrated Services Manager (ISM) or Associate Director, RDT (ADRDT).
          </p>
          <div className="print-inline-row" style={{ padding: 0 }}>
            <span>Is this an asset categorized as a capital asset valued at $50,000 or above?</span>
            <YesNo value={f.lifeCycleCost} />
          </div>
        </div>
      </div>

      {/* PART 4 - COST */}
      <div className="print-section">
        <SectionHeader title="PART 4 – ESTIMATED COST" />
        <div style={{ padding: '5px 8px', fontSize: 10 }}>
          <p style={{ margin: '0 0 6px 0' }}>All costs must be identified in Canadian (CAD) funds.</p>
          <table className="print-cost-table">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Fiscal Year</th>
                <th style={{ width: '45%' }}>Description of Good(s), Service(s) or Construction</th>
                <th style={{ width: '10%' }}>Quantity</th>
                <th style={{ width: '15%' }}>Unit Cost</th>
                <th style={{ width: '15%' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(f.estimatedCostRows || []).map((row, i) => (
                <tr key={i}>
                  <td>{row.fiscalYear}</td>
                  <td>{row.description}</td>
                  <td style={{ textAlign: 'center' }}>{row.quantity}</td>
                  <td style={{ textAlign: 'right' }}>{row.unitCost}</td>
                  <td style={{ textAlign: 'right' }}>{row.amount ? `$${parseFloat(row.amount).toFixed(2)}` : ''}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: 8 }}>Estimated Cost (excluding taxes)</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={2} style={{ fontWeight: 'bold' }}>Estimated Taxes</td>
                <td colSpan={2}><span className="print-blue" style={{ display: 'block', padding: '2px 4px' }}>Province: {f.taxProvince || f.province || ''}</span></td>
                <td></td>
              </tr>
              <tr>
                <td colSpan={4} style={{ textAlign: 'right', paddingRight: 8 }}>Estimated Travel and Living expenses (including all applicable taxes and fees)</td>
                <td style={{ textAlign: 'right' }}>{travel ? `$${travel.toFixed(2)}` : ''}</td>
              </tr>
              <tr className="total-row">
                <td colSpan={4} style={{ fontWeight: 'bold', textAlign: 'right', paddingRight: 8 }}>TOTAL ESTIMATED COST (CAD $)</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>${total.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </PrintPage>
  )
}

// ─────────────────────────────────────────
// PAGE 4
// ─────────────────────────────────────────

const Page4Print = ({ f }) => (
  <PrintPage pageNum={4} totalPages={4} formData={f} showTitle={false}>
    <div className="print-form-title" style={{ fontSize: 12, marginBottom: 6 }}>
      PROCUREMENT REQUEST FORM FOR GOODS, SERVICES AND CONSTRUCTION
    </div>

    {/* PART 5 */}
    <div className="print-section">
      <SectionHeader title="PART 5 – FINANCIAL INFORMATION AND AUTHORIZATION" />

      <div className="print-notice">
        <strong>For all requests:</strong> Should there be shared funding from more than one Responsibility Centre Manager, please attach
        additional Authority Request (AR) as required to your procurement request.
      </div>
      <div className="print-notice" style={{ borderBottom: '1px solid #777' }}>
        <strong>For construction requirements only:</strong> If financial information and authorization are provided through an approved
        Investment Authority Request (IAR) attached to the PRF, this section may remain blank. Otherwise, completion of this section is required.
      </div>

      {/* RECOMMENDED */}
      <div className="print-section-label">Recommended</div>
      <table className="print-table" style={{ marginBottom: 0 }}>
        <tbody>
          <tr>
            <td style={{ width: '28%' }}><Field label="Name (Print)" value={f.recommendedName} blue={false} /></td>
            <td style={{ width: '28%' }}><Field label="Position title" value={f.recommendedTitle} blue={false} /></td>
            <SignatureField
              label="Signature"
              signature={f.recommendedSignature}
              signedAt={f.recommendedSignedAt}
              name={f.recommendedName}
              title={f.recommendedTitle}
            />
            <td style={{ width: '16%' }}>
              <span className="print-field-label">Date (YYYY-MM-DD)</span>
              <div className="print-field-value print-blue" style={{ padding: '2px 4px', minHeight: 18 }}>{f.recommendedDate || '\u00A0'}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* CONFIRMED */}
      <div className="print-section-label" style={{ marginTop: 4 }}>Confirmed that the funds are available</div>
      <table className="print-table" style={{ marginBottom: 0 }}>
        <tbody>
          <tr>
            <td style={{ width: '28%' }}><Field label="Name (Print)" value={f.confirmedName} blue={false} /></td>
            <td style={{ width: '28%' }}><Field label="Position title" value={f.confirmedTitle} blue={false} /></td>
            <SignatureField
              label="Signature"
              signature={f.confirmedSignature}
              signedAt={f.confirmedSignedAt}
              name={f.confirmedName}
              title={f.confirmedTitle}
            />
            <td style={{ width: '16%' }}>
              <span className="print-field-label">Date (YYYY-MM-DD)</span>
              <div className="print-field-value print-blue" style={{ padding: '2px 4px', minHeight: 18 }}>{f.confirmedDate || '\u00A0'}</div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* RC MANAGER */}
      <div style={{ borderTop: '1px solid #777', borderBottom: '1px solid #777', padding: '4px 8px' }}>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ flex: 1, fontSize: 10 }}>
            <span style={{ fontWeight: 'bold' }}>Responsibility Centre Manager: </span>
            <span className="print-blue" style={{ display: 'inline-block', minWidth: 200, borderBottom: '1px solid #777', padding: '0 4px' }}>
              {f.responsibilityCentreManager}
            </span>
          </div>
          <div style={{ flex: 1, fontSize: 10 }}>
            <span style={{ fontWeight: 'bold' }}>Title: </span>
            <span className="print-blue" style={{ display: 'inline-block', minWidth: 120, borderBottom: '1px solid #777', padding: '0 4px' }}>
              {f.responsibilityTitle}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 0, marginTop: 4 }}>
          <div style={{ flex: 1, fontSize: 10 }}>
            <span style={{ fontWeight: 'bold' }}>Branch: </span>
            <span className="print-blue" style={{ display: 'inline-block', minWidth: 200, borderBottom: '1px solid #777', padding: '0 4px' }}>
              {f.responsibilityBranch}
            </span>
          </div>
          <div style={{ flex: 1, fontSize: 10 }}>
            <span style={{ fontWeight: 'bold' }}>Division: </span>
            <span className="print-blue" style={{ display: 'inline-block', minWidth: 120, borderBottom: '1px solid #777', padding: '0 4px' }}>
              {f.responsibilityDivision}
            </span>
          </div>
        </div>
      </div>

      {/* FINANCIAL TABLE */}
      <table className="print-financial-table">
        <thead>
          <tr>
            <th style={{ width: 55 }}>Fiscal Year</th>
            <th style={{ width: 90 }}>General Ledger</th>
            <th style={{ width: 50 }}>Fund</th>
            <th style={{ width: 70 }}>WBS/E</th>
            <th style={{ width: 100 }}>Program Activity</th>
            <th style={{ width: 80 }}>Cost Centre</th>
            <th style={{ width: 55 }}>Asset</th>
            <th style={{ width: 80 }}>Internal Order</th>
            <th>Amount (CAD $)</th>
          </tr>
        </thead>
        <tbody>
          {(f.financialRows || []).map((row, i) => (
            <tr key={i}>
              <td>{row.fiscalYear}</td>
              <td>{row.generalLedger}</td>
              <td>{row.fund}</td>
              <td>{row.wbse}</td>
              <td>{row.programActivity}</td>
              <td>{row.costCentre}</td>
              <td>{row.asset}</td>
              <td>{row.internalOrder}</td>
              <td style={{ textAlign: 'right' }}>{row.amount ? `$${parseFloat(row.amount).toFixed(2)}` : '$0.00'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* SECTION 32 */}
      <div className="print-certification">
        By signing, you are certifying pursuant to Expenditure Initiation with Availability of Funds, section 32(1) of the Financial
        Administration Act (FAA) and also acknowledging that life cycle costs have been considered, discussed with relevant subject
        matter expert(s) and incorporated as applicable.
      </div>
      <table className="print-table" style={{ marginTop: 4 }}>
        <tbody>
          <tr>
            <SignatureField
              label="Signature"
              signature={f.section32Signature}
              signedAt={f.section32SignedAt}
              name={f.responsibilityCentreManager}
              title={f.responsibilityTitle}
            />
            <td style={{ width: '40%' }}>
              <span className="print-field-label">Date (YYYY-MM-DD)</span>
              <div className="print-field-value print-blue" style={{ padding: '2px 4px', minHeight: 18 }}>{f.section32Date || '\u00A0'}</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    {/* PART 6 */}
    <div className="print-section">
      <SectionHeader title="PART 6 – SUPPORTING DOCUMENTS ATTACHED" />
      <div className="print-docs-grid">
        {[
          { key: 'statementOfRequirement',     label: 'Statement of Requirement (Goods)' },
          { key: 'statementOfWork',             label: 'Statement of Work (Services)' },
          { key: 'investmentAuthorityRequest',  label: 'Investment Authority Request (Construction)' },
          { key: 'evaluationCriteria',          label: 'Evaluation Criteria (if applicable)' },
          { key: 'functionalApprovalsAttached', label: 'Functional approval(s)' },
          { key: 'specificationPlans',          label: 'Specification and Plans (Construction)' },
          { key: 'srclAttached',                label: 'SRCL' },
          { key: 'proposalQuote',               label: 'Proposal or Quote' },
          { key: 'ssltcAttached',               label: 'SSLTC (Sole Source)' },
          { key: 'otherDocuments',              label: 'Other' },
        ].map(doc => (
          <div key={doc.key} className="print-doc-item">
            <Checkbox checked={!!f[doc.key]} />
            <span>{doc.label}</span>
          </div>
        ))}
      </div>
    </div>

    {/* PART 7 */}
    <div className="print-section">
      <SectionHeader title="PART 7 – ADDITIONAL NOTES TO DESIGNATED PROCUREMENT OFFICE" />
      <div className="print-blue-light" style={{ padding: '6px 8px', minHeight: 60, fontSize: 10 }}>
        {f.procurementNotes || '\u00A0'}
      </div>
    </div>
  </PrintPage>
)

// ─────────────────────────────────────────
// MAIN PRINT PAGE
// ─────────────────────────────────────────

function PrintPageRoot() {
  const [formData, setFormData] = useState(null)
  const [submissionId, setSubmissionId] = useState('')
  const [fiscalYear, setFiscalYear]     = useState('')
  const [ready, setReady]               = useState(false)

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const data   = params.get('data')
      const fy     = params.get('fy') || ''
      const id     = params.get('id') || ''
      if (data) {
        setFormData(JSON.parse(decodeURIComponent(data)))
        setFiscalYear(fy)
        setSubmissionId(id)
      }
    } catch (e) {
      console.error('PrintPage parse error:', e)
    }
  }, [])

  useEffect(() => {
    if (formData) {
      document.body.classList.add('print-body')
      const t = setTimeout(() => setReady(true), 800)
      return () => clearTimeout(t)
    }
  }, [formData])

  if (!formData) return (
    <div style={{ padding: 40, fontFamily: 'Arial', color: '#666', fontSize: 12 }}>
      Loading...
    </div>
  )

  return (
    <div className={ready ? 'print-ready' : ''} style={{ background: 'white' }}>
      <Page1Print f={formData} submissionId={submissionId} fiscalYear={fiscalYear} />
      <Page2Print f={formData} />
      <Page3Print f={formData} />
      <Page4Print f={formData} />
    </div>
  )
}

export default PrintPageRoot
