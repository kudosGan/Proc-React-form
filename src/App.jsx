import { useState } from 'react'

import './styles/form.css'

import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'

import FormFooter from './components/FormFooter'

function App() {

  // =========================
  // PAGE NAVIGATION
  // =========================

  const [currentPage, setCurrentPage] = useState(1)

  // =========================
  // MASTER FORM STATE
  // =========================

  const [formData, setFormData] = useState({

    // =========================================
    // PAGE 1 — CLIENT INFORMATION
    // =========================================

    clientFirstName: '',
    clientLastName: '',
    clientEmail: '',
    clientBranch: '',

    businessOwnerFirstName: '',
    businessOwnerLastName: '',
    businessOwnerEmail: '',
    businessOwnerBranch: '',

    // =========================================
    // PAGE 1 — REQUIREMENT SUMMARY
    // =========================================

    goodsSelected: false,
    goodsDeliveryDate: '',

    servicesSelected: false,
    servicesStartDate: '',
    servicesEndDate: '',

    constructionSelected: false,
    constructionStartDate: '',
    constructionEndDate: '',

    requirementDescription: '',

    procurementStrategy: '',
    strategyOptions: '',

    continuationRequired: '',
    continuationDetails: '',

    subsequentNeed: '',

    alternativesConsidered: '',
    alternativeDetails: '',

    functionalApproval: '',

    // =========================================
    // PAGE 2 — ACCESSIBILITY
    // =========================================

    accessibilityType: '',
    accessibilityDetails: '',

    // =========================================
    // PAGE 2 — INDIGENOUS
    // =========================================

    indigenousConsidered: '',
    indigenousDetails: '',

    // =========================================
    // PAGE 2 — ENVIRONMENTAL
    // =========================================

    environmentalConsidered: '',
    environmentalDetails: '',

    // =========================================
    // PAGE 2 — EMPLOYEE / EMPLOYER
    // =========================================

    supervisoryControl: '',
    provideTools: '',
    workingHours: '',
    employeeEmployerJustification: '',

    // =========================================
    // PAGE 3 — INTELLECTUAL PROPERTY
    // =========================================

    ipPotential: '',
    ipOwner: '',

    // =========================================
    // PAGE 3 — SECURITY
    // =========================================

    securityRequirement: '',

    // =========================================
    // PAGE 3 — OFFICIAL LANGUAGES
    // =========================================

    officialLanguages: '',

    // =========================================
    // PAGE 3 — LIFE CYCLE
    // =========================================

    lifeCycleCosts: '',

    // =========================================
    // PAGE 3 — ESTIMATED COST
    // =========================================

    estimatedCostRows: [
      {
        fiscalYear: '',
        description: '',
        quantity: '',
        unitCost: '',
        amount: ''
      }
    ],

    estimatedTaxes: '',
    province: '',
    travelExpenses: '',
    totalEstimatedCost: '',

    // =========================================
    // PAGE 4 — RECOMMENDED
    // =========================================

    recommendedName: '',
    recommendedTitle: '',
    recommendedSignature: '',
    recommendedDate: '',

    // =========================================
    // PAGE 4 — CONFIRMED
    // =========================================

    confirmedName: '',
    confirmedTitle: '',
    confirmedSignature: '',
    confirmedDate: '',

    // =========================================
    // PAGE 4 — RESPONSIBILITY CENTRE
    // =========================================

    responsibilityCentreManager: '',
    responsibilityTitle: '',
    responsibilityBranch: '',
    responsibilityDivision: '',
    financialRows: [
  {
    fiscalYear: '',
    generalLedger: '',
    fund: '',
    wbse: '',
    programActivity: '',
    costCentre: '',
    asset: '',
    internalOrder: '',
    amount: ''
  }
],

    // =========================================
    // PAGE 4 — SECTION 32
    // =========================================

    section32Signature: '',
    section32Date: '',

    // =========================================
    // PAGE 4 — SUPPORTING DOCUMENTS
    // =========================================

    statementOfRequirement: false,
    statementOfWork: false,
    investmentAuthorityRequest: false,
    evaluationCriteria: false,
    functionalApprovalsAttached: false,
    specificationPlans: false,
    srclAttached: false,
    proposalQuote: false,
    ssltcAttached: false,
    otherDocuments: false,

    // =========================================
    // PAGE 4 — NOTES
    // =========================================

    procurementNotes: ''

  })

  // =========================
  // NAVIGATION FUNCTIONS
  // =========================

  const nextPage = () => {

    if (currentPage < 4) {
      setCurrentPage(currentPage + 1)
    }

  }

  const previousPage = () => {

    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }

  }

  // =========================
  // SUBMIT FUNCTION
  // =========================

  const handleSubmit = () => {

    // =========================
    // CALCULATE TOTALS
    // =========================

    const subtotal = formData.estimatedCostRows.reduce(
      (total, row) => total + (parseFloat(row.amount) || 0),
      0
    )

    const travelExpenses =
      parseFloat(formData.travelExpenses) || 0

    const totalEstimatedCost =
      subtotal + travelExpenses

    // =========================
    // FINAL PAYLOAD
    // =========================

    const payload = {

      submittedAt: new Date().toISOString(),

      ...formData,

      calculatedTotals: {
        subtotal,
        travelExpenses,
        totalEstimatedCost
      }

    }

    // =========================
    // VIEW JSON
    // =========================

    console.log('FULL PROCUREMENT PAYLOAD')

    console.log(payload)

    console.log(
      JSON.stringify(payload, null, 2)
    )

    alert('Form Ready For PDF + SharePoint + Email')

  }

  // =========================
  // RENDER
  // =========================

  return (

    <div>

      {currentPage === 1 && (

        <Page1
          formData={formData}
          setFormData={setFormData}
        />

      )}

      {currentPage === 2 && (

        <Page2
          formData={formData}
          setFormData={setFormData}
        />

      )}

      {currentPage === 3 && (

        <Page3
          formData={formData}
          setFormData={setFormData}
        />

      )}

      {currentPage === 4 && (

        <Page4
          formData={formData}
          setFormData={setFormData}
        />

      )}

      <FormFooter
        currentPage={currentPage}
        totalPages={4}
        onNext={nextPage}
        onBack={previousPage}
        onSubmit={handleSubmit}
      />

    </div>

  )

}

export default App