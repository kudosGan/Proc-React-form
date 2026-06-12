import express from 'express'

const router = express.Router()

// ─────────────────────────────────────────────────────────────
// POST /api/amend/lookup
// ─────────────────────────────────────────────────────────────
router.post('/lookup', async (req, res) => {
  try {
    const { requestId, email } = req.body

    if (!requestId || !email) {
      return res.status(400).json({
        error: 'Request ID and email are required.'
      })
    }

    const LOOKUP_URL = process.env.POWER_AUTOMATE_LOOKUP_URL

    if (!LOOKUP_URL) {
      return res.status(500).json({
        error: 'Lookup service not configured. Add POWER_AUTOMATE_LOOKUP_URL to .env'
      })
    }

    console.log(`[amend/lookup] Searching for: ${requestId} / ${email}`)

    const paResponse = await fetch(LOOKUP_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ requestId, email }),
    })

    const result = await paResponse.json()

    if (paResponse.status === 404) {
      return res.status(404).json({
        error: 'Request ID not found. Please check and try again.'
      })
    }

    if (paResponse.status === 403) {
      return res.status(403).json({
        error: 'The email address does not match this request. Please check and try again.'
      })
    }

    if (!paResponse.ok) {
      return res.status(500).json({
        error: 'Unable to retrieve the request. Please try again.'
      })
    }

    const spo = result.record

    // ─────────────────────────────────────────────────────────
    // Try FormData JSON first — full form stored on submission
    // ─────────────────────────────────────────────────────────
    let formData = null

    if (spo.FormData) {
      try {
        const cleaned = spo.FormData
          .replace(/<p>/gi, '')
          .replace(/<\/p>/gi, '')
          .replace(/&quot;/gi, '"')
          .replace(/&#58;/gi, ':')
          .replace(/&amp;/gi, '&')
          .trim()

        formData = JSON.parse(cleaned)
        console.log(`[amend/lookup] Using stored FormData JSON`)
      } catch (e) {
        console.warn(`[amend/lookup] FormData parse failed — falling back to SPO columns`)
        formData = null
      }
    }

    // ─────────────────────────────────────────────────────────
    // Fallback — map individual SPO columns
    // ─────────────────────────────────────────────────────────
    if (!formData) {
      console.log(`[amend/lookup] No FormData — using SPO column mapping`)
      formData = {
        clientFirstName              : spo.Requester?.split(' ')?.[0]             || '',
        clientLastName               : spo.Requester?.split(' ')?.[1]             || '',
        clientEmail                  : spo.Author?.Email                           || '',
        clientBranch                 : spo.Branch                                  || '',
        businessOwnerFirstName       : spo.BusinessOwner?.split(' ')?.[0]         || '',
        businessOwnerLastName        : spo.BusinessOwner?.split(' ')?.[1]         || '',
        businessOwnerEmail           : '',
        businessOwnerBranch          : '',
        goodsSelected                : spo.CommodityType?.Value?.includes('Goods')        || false,
        servicesSelected             : spo.CommodityType?.Value?.includes('Services')     || false,
        constructionSelected         : spo.CommodityType?.Value?.includes('Construction') || false,
        goodsDeliveryDate            : '',
        servicesStartDate            : '',
        servicesEndDate              : '',
        requirementDescription       : spo.Description                             || '',
        procurementStrategy          : '',
        strategyOptions              : '',
        continuationRequired         : '',
        continuationDetails          : '',
        subsequentNeed               : '',
        alternativesConsidered       : '',
        alternativeDetails           : '',
        functionalApproval           : '',
        accessibilityType            : '',
        accessibilityDetails         : '',
        indigenousConsidered         : '',
        indigenousDetails            : '',
        environmentalConsidered      : '',
        environmentalDetails         : '',
        supervisoryControl           : '',
        provideTools                 : '',
        workingHours                 : '',
        employeeEmployerJustification: '',
        ipPotential                  : '',
        ipOwner                      : '',
        securityRequirement          : '',
        officialLanguages            : '',
        lifeCycleCost                : '',
        estimatedCostRows            : [{ fiscalYear: '', description: '', quantity: '', unitCost: '', amount: '' }],
        estimatedTaxes               : '',
        province                     : '',
        travelExpenses               : '',
        totalEstimatedCost           : spo.EstimatedValue || '',
        recommendedName              : '',
        recommendedTitle             : '',
        confirmedName                : '',
        confirmedTitle               : '',
        responsibilityCentreManager  : '',
        responsibilityTitle          : '',
        responsibilityBranch         : '',
        responsibilityDivision       : '',
        financialRows                : [{ fiscalYear: '', generalLedger: '', fund: '', wbse: '', programActivity: '', costCentre: '', asset: '', internalOrder: '', amount: '' }],
        procurementNotes             : '',
        statementOfRequirement       : false,
        statementOfWork              : false,
        investmentAuthorityRequest   : false,
        evaluationCriteria           : false,
        functionalApprovalsAttached  : false,
        specificationPlans           : false,
        srclAttached                 : false,
        proposalQuote                : false,
        ssltcAttached                : false,
        otherDocuments               : false,
      }
    }

    console.log(`[amend/lookup] ✅ Found: ${requestId} — returning form data`)

    res.json({
      success   : true,
      record    : formData,
      spoItemId : spo.ID,
      requestId : spo.Title,
      assignedTo: spo.AssignedTo || '',
      status    : spo.ProgressStatus || '',
    })

  } catch (err) {
    console.error('[amend/lookup] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// POST /api/amend/submit
// 1. Generates amended PDF via Puppeteer
// 2. Fires PA webhook to update SPO list item
// ─────────────────────────────────────────────────────────────
router.post('/submit', async (req, res) => {
  try {
    const { requestId, spoItemId, uploadedFiles, ...formData } = req.body

    if (!requestId) {
      return res.status(400).json({ error: 'Request ID is required.' })
    }

    console.log(`[amend/submit] Amending: ${requestId}`)

    // ── STEP 1: GENERATE AMENDED PDF ─────────────────────────
    const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
    const puppeteer    = (await import('puppeteer')).default

    console.log(`[amend/submit] Launching Puppeteer...`)

    const browser = await puppeteer.launch({
      headless : 'new',
      args     : [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
    })

    let pdfBase64 = null

    try {
      const page = await browser.newPage()
      await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })

      const fiscalYear = requestId.split('-')[1] || ''
      const encoded    = encodeURIComponent(JSON.stringify(formData))
      const printUrl   = `${FRONTEND_URL}/print?data=${encoded}&fy=${fiscalYear}&id=${requestId}`

      console.log(`[amend/submit] Loading print page...`)
      await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 })

      await page.waitForSelector('.print-ready', { timeout: 10000 })
        .catch(() => console.warn('[amend/submit] .print-ready not found — printing anyway'))

      await page.addStyleTag({ content: `
        .print-page { page-break-after: always !important; }
        .print-page:last-of-type { page-break-after: avoid !important; }
      `})

      await new Promise(r => setTimeout(r, 1500))

      const pdfBuffer = await page.pdf({
        format              : 'A4',
        printBackground     : true,
        margin              : { top: '6mm', bottom: '6mm', left: '6mm', right: '6mm' },
        displayHeaderFooter : false,
      })

      pdfBase64 = pdfBuffer.toString('base64')
      console.log(`[amend/submit] PDF generated — ${Math.round(pdfBase64.length / 1024)} KB`)

    } finally {
      await browser.close()
    }

    // ── STEP 2: FIRE PA WEBHOOK ───────────────────────────────
    const PA_URL = process.env.POWER_AUTOMATE_URL

    if (!PA_URL) {
      console.warn('[amend/submit] POWER_AUTOMATE_URL not set — returning PDF only')
      return res.json({
        success    : true,
        paTriggered: false,
        pdfBase64,
        fileName   : `${requestId}-AMENDED.pdf`,
        message    : 'PDF generated. Add POWER_AUTOMATE_URL to .env to enable SPO update.',
      })
    }

    const fiscalYear = requestId.split('-')[1] || ''

    const paPayload = {
      actionType   : 'amend',
      requestId,
      spoItemId,
      amendedAt    : new Date().toISOString(),
      fiscalYear,

      pdfBase64,
      fileName     : `${requestId}-AMENDED.pdf`,

      clientName   : `${formData.clientFirstName || ''} ${formData.clientLastName || ''}`.trim(),
      clientEmail  : formData.clientEmail              || '',
      clientBranch : formData.clientBranch             || '',
      ownerName    : `${formData.businessOwnerFirstName || ''} ${formData.businessOwnerLastName || ''}`.trim(),
      ownerEmail   : formData.businessOwnerEmail        || '',
      ownerBranch  : formData.businessOwnerBranch       || '',

      requirementDescription : formData.requirementDescription || '',
      totalEstimatedCost     : parseFloat(formData.totalEstimatedCost || 0),

      formDataJson : JSON.stringify(formData),
      status       : 'Amended',

      attachments  : (uploadedFiles || []).map(f => ({
        name   : f.name,
        content: f.base64,
        type   : f.type,
      })),

      teamsMessage : `📝 **Request Amended**\n**Ref:** ${requestId}\n**Client:** ${formData.clientFirstName || ''} ${formData.clientLastName || ''} — ${formData.clientBranch || ''}\n**Amended at:** ${new Date().toLocaleString('en-CA')}\n**Status:** Amended ✓`,
    }

    console.log(`[amend/submit] Firing PA webhook...`)

    const paResponse = await fetch(PA_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(paPayload),
    })

    if (!paResponse.ok) {
      const errText = await paResponse.text()
      throw new Error(`Power Automate returned ${paResponse.status}: ${errText}`)
    }

    console.log(`[amend/submit] ✅ Amendment complete — ${requestId}`)

    res.json({
      success    : true,
      paTriggered: true,
      pdfBase64,
      fileName   : `${requestId}-AMENDED.pdf`,
      requestId,
      message    : `Amendment submitted. ${requestId} updated in SharePoint.`

    })

  } catch (err) {
    console.error('[amend/submit] ❌ Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router