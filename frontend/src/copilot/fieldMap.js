/**
 * AGENT FIELD MAP
 * ---------------
 * Single source of truth for every form field.
 * The AI agent uses this to:
 *   - Know what fields exist and which page they are on
 *   - Understand field types and valid values
 *   - Map natural language to exact formData keys
 *   - Navigate to the correct page before filling
 */

export const FIELD_MAP = [

  // ─────────────────────────────────────────
  // PAGE 1 — CLIENT INFORMATION
  // ─────────────────────────────────────────
  {
    key: 'clientFirstName',
    label: 'Client First Name',
    page: 1,
    type: 'text',
    aliases: ['client first', 'my first name', 'first name', 'client name'],
  },
  {
    key: 'clientLastName',
    label: 'Client Last Name',
    page: 1,
    type: 'text',
    aliases: ['client last', 'my last name', 'last name', 'surname'],
  },
  {
    key: 'clientEmail',
    label: 'Client Email',
    page: 1,
    type: 'email',
    aliases: ['my email', 'client email', 'email'],
  },
  {
    key: 'clientBranch',
    label: 'Client Branch',
    page: 1,
    type: 'dropdown',
    aliases: ['my branch', 'client branch', 'branch', 'department'],
    options: [
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
      'Strategic Policy Branch',
    ],
  },
  {
    key: 'businessOwnerFirstName',
    label: 'Business Owner First Name',
    page: 1,
    type: 'text',
    aliases: ['business owner first', 'owner first name'],
  },
  {
    key: 'businessOwnerLastName',
    label: 'Business Owner Last Name',
    page: 1,
    type: 'text',
    aliases: ['business owner last', 'owner last name'],
  },
  {
    key: 'businessOwnerEmail',
    label: 'Business Owner Email',
    page: 1,
    type: 'email',
    aliases: ['owner email', 'business owner email'],
  },
  {
    key: 'businessOwnerBranch',
    label: 'Business Owner Branch',
    page: 1,
    type: 'dropdown',
    aliases: ['owner branch', 'business branch'],
    options: [
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
      'Strategic Policy Branch',
    ],
  },

  // ─────────────────────────────────────────
  // PAGE 1 — REQUIREMENT SUMMARY
  // ─────────────────────────────────────────
  {
    key: 'goodsSelected',
    label: 'Goods (checkbox)',
    page: 1,
    type: 'checkbox',
    aliases: ['goods', 'purchasing goods', 'buying goods'],
  },
  {
    key: 'goodsDeliveryDate',
    label: 'Goods Delivery Date',
    page: 1,
    type: 'date',
    aliases: ['delivery date', 'goods date'],
    format: 'YYYY-MM-DD',
  },
  {
    key: 'servicesSelected',
    label: 'Services (checkbox)',
    page: 1,
    type: 'checkbox',
    aliases: ['services', 'service', 'consulting'],
  },
  {
    key: 'servicesStartDate',
    label: 'Services Start Date',
    page: 1,
    type: 'date',
    aliases: ['service start', 'start date', 'services begin'],
    format: 'YYYY-MM-DD',
  },
  {
    key: 'servicesEndDate',
    label: 'Services End Date',
    page: 1,
    type: 'date',
    aliases: ['service end', 'end date', 'services finish'],
    format: 'YYYY-MM-DD',
  },
  {
    key: 'constructionSelected',
    label: 'Construction (checkbox)',
    page: 1,
    type: 'checkbox',
    aliases: ['construction', 'building', 'renovation'],
  },
  {
    key: 'constructionStartDate',
    label: 'Construction Start Date',
    page: 1,
    type: 'date',
    aliases: ['construction start'],
    format: 'YYYY-MM-DD',
  },
  {
    key: 'constructionEndDate',
    label: 'Construction End Date',
    page: 1,
    type: 'date',
    aliases: ['construction end'],
    format: 'YYYY-MM-DD',
  },
  {
    key: 'requirementDescription',
    label: 'Requirement Description',
    page: 1,
    type: 'textarea',
    aliases: ['description', 'what do you need', 'requirement', 'details'],
  },
  {
    key: 'procurementStrategy',
    label: 'Procurement Strategy Considered',
    page: 1,
    type: 'yesno',
    aliases: ['procurement strategy', 'strategy considered'],
    options: ['Yes', 'No'],
  },
  {
    key: 'strategyOptions',
    label: 'Strategy Options',
    page: 1,
    type: 'radio',
    aliases: ['strategy option', 'procurement method'],
  },
  {
    key: 'continuationRequired',
    label: 'Continuation of Existing Requirement',
    page: 1,
    type: 'yesno',
    aliases: ['continuation', 'existing project', 'follow-on'],
    options: ['Yes', 'No'],
  },
  {
    key: 'continuationDetails',
    label: 'Continuation Details',
    page: 1,
    type: 'textarea',
    aliases: ['continuation details', 'existing contract details'],
  },
  {
    key: 'subsequentNeed',
    label: 'Subsequent Need',
    page: 1,
    type: 'yesno',
    aliases: ['subsequent need', 'future need', 'follow-up need'],
    options: ['Yes', 'No'],
  },
  {
    key: 'alternativesConsidered',
    label: 'Alternatives Considered',
    page: 1,
    type: 'yesno',
    aliases: ['alternatives', 'other options considered'],
    options: ['Yes', 'No'],
  },
  {
    key: 'alternativeDetails',
    label: 'Alternative Details',
    page: 1,
    type: 'textarea',
    aliases: ['alternative details', 'alternatives description'],
  },
  {
    key: 'functionalApproval',
    label: 'AAFC Functional Approval Obtained',
    page: 1,
    type: 'yesno',
    aliases: ['functional approval', 'aafc approval'],
    options: ['Yes', 'No'],
  },

  // ─────────────────────────────────────────
  // PAGE 2 — PROCUREMENT CONSIDERATIONS
  // ─────────────────────────────────────────
  {
    key: 'accessibilityType',
    label: 'Accessibility Type',
    page: 2,
    type: 'radio',
    aliases: ['accessibility', 'accessible'],
    options: ['Included', 'Not Applicable', 'Unable to Include'],
  },
  {
    key: 'accessibilityDetails',
    label: 'Accessibility Details',
    page: 2,
    type: 'textarea',
    aliases: ['accessibility details', 'accessibility explanation'],
  },
  {
    key: 'indigenousConsidered',
    label: 'Indigenous Procurement Considered',
    page: 2,
    type: 'yesno',
    aliases: ['indigenous', 'indigenous procurement'],
    options: ['Yes', 'No'],
  },
  {
    key: 'indigenousDetails',
    label: 'Indigenous Details',
    page: 2,
    type: 'textarea',
    aliases: ['indigenous details'],
  },
  {
    key: 'environmentalConsidered',
    label: 'Environmental Considerations',
    page: 2,
    type: 'yesno',
    aliases: ['environmental', 'green procurement', 'environment'],
    options: ['Yes', 'No'],
  },
  {
    key: 'environmentalDetails',
    label: 'Environmental Details',
    page: 2,
    type: 'textarea',
    aliases: ['environmental details'],
  },
  {
    key: 'supervisoryControl',
    label: 'Supervisory Control',
    page: 2,
    type: 'yesno',
    aliases: ['supervisory control', 'supervision'],
    options: ['Yes', 'No'],
  },
  {
    key: 'provideTools',
    label: 'Provide Tools',
    page: 2,
    type: 'yesno',
    aliases: ['tools provided', 'equipment provided'],
    options: ['Yes', 'No'],
  },
  {
    key: 'workingHours',
    label: 'Set Working Hours',
    page: 2,
    type: 'yesno',
    aliases: ['working hours', 'set hours'],
    options: ['Yes', 'No'],
  },
  {
    key: 'employeeEmployerJustification',
    label: 'Employee/Employer Justification',
    page: 2,
    type: 'textarea',
    aliases: ['employee employer justification', 'employment relationship'],
  },

  // ─────────────────────────────────────────
  // PAGE 3 — IP, SECURITY, COST
  // ─────────────────────────────────────────
  {
    key: 'ipPotential',
    label: 'IP Potential',
    page: 3,
    type: 'yesno',
    aliases: ['intellectual property', 'ip', 'ip potential'],
    options: ['Yes', 'No'],
  },
  {
    key: 'ipOwner',
    label: 'IP Owner',
    page: 3,
    type: 'radio',
    aliases: ['ip owner', 'who owns ip'],
  },
  {
    key: 'securityRequirement',
    label: 'Security Requirement',
    page: 3,
    type: 'yesno',
    aliases: ['security', 'security requirement', 'security clearance'],
    options: ['Yes', 'No'],
  },
  {
    key: 'officialLanguages',
    label: 'Official Languages',
    page: 3,
    type: 'yesno',
    aliases: ['official languages', 'bilingual', 'french english'],
    options: ['Yes', 'No'],
  },
  {
    key: 'lifeCycleCosts',
    label: 'Life Cycle Costs',
    page: 3,
    type: 'yesno',
    aliases: ['life cycle', 'lifecycle costs'],
    options: ['Yes', 'No'],
  },
  {
    key: 'estimatedTaxes',
    label: 'Estimated Taxes',
    page: 3,
    type: 'text',
    aliases: ['taxes', 'estimated taxes', 'tax amount'],
  },
  {
    key: 'province',
    label: 'Province',
    page: 3,
    type: 'dropdown',
    aliases: ['province', 'location province'],
  },
  {
    key: 'travelExpenses',
    label: 'Travel Expenses',
    page: 3,
    type: 'text',
    aliases: ['travel', 'travel expenses', 'travel cost'],
  },
  {
    key: 'totalEstimatedCost',
    label: 'Total Estimated Cost',
    page: 3,
    type: 'text',
    aliases: ['total cost', 'estimated total', 'budget'],
  },

  // ─────────────────────────────────────────
  // PAGE 4 — SIGNATURES & APPROVAL
  // ─────────────────────────────────────────
  {
    key: 'recommendedName',
    label: 'Recommended By — Name',
    page: 4,
    type: 'text',
    aliases: ['recommended name', 'recommender name'],
  },
  {
    key: 'recommendedTitle',
    label: 'Recommended By — Title',
    page: 4,
    type: 'text',
    aliases: ['recommended title', 'recommender title'],
  },
  {
    key: 'confirmedName',
    label: 'Confirmed By — Name',
    page: 4,
    type: 'text',
    aliases: ['confirmed name', 'confirmer name'],
  },
  {
    key: 'confirmedTitle',
    label: 'Confirmed By — Title',
    page: 4,
    type: 'text',
    aliases: ['confirmed title'],
  },
  {
    key: 'responsibilityCentreManager',
    label: 'Responsibility Centre Manager',
    page: 4,
    type: 'text',
    aliases: ['rc manager', 'responsibility centre manager', 'manager'],
  },
  {
    key: 'responsibilityTitle',
    label: 'Responsibility Centre Title',
    page: 4,
    type: 'text',
    aliases: ['responsibility title', 'rc title'],
  },
  {
    key: 'responsibilityBranch',
    label: 'Responsibility Centre Branch',
    page: 4,
    type: 'text',
    aliases: ['responsibility branch', 'rc branch'],
  },
  {
    key: 'responsibilityDivision',
    label: 'Responsibility Centre Division',
    page: 4,
    type: 'text',
    aliases: ['responsibility division', 'rc division', 'division'],
  },
  {
    key: 'procurementNotes',
    label: 'Procurement Notes',
    page: 4,
    type: 'textarea',
    aliases: ['notes', 'procurement notes', 'additional notes'],
  },
]

/**
 * Look up a field by its key
 */
export const getField = (key) => FIELD_MAP.find((f) => f.key === key)

/**
 * Get all fields for a given page
 */
export const getFieldsForPage = (page) => FIELD_MAP.filter((f) => f.page === page)

/**
 * Get a summary of filled vs empty fields
 */
export const getFormProgress = (formData) => {
  const filled = []
  const empty = []

  FIELD_MAP.forEach((field) => {
    const val = formData[field.key]
    const isFilled =
      val !== '' && val !== false && val !== null && val !== undefined
    if (isFilled) {
      filled.push(field)
    } else {
      empty.push(field)
    }
  })

  return { filled, empty, total: FIELD_MAP.length }
}
