/**
 * POST /api/submit
 * ─────────────────
 * 1. Receives submitted form data
 * 2. Uses Puppeteer (headless Chrome) to render the React form
 *    with all data pre-filled and print it to PDF
 * 3. Fires Power Automate webhook with:
 *    - All form data (SPO list item creation)
 *    - Filled PDF as base64 (email attachment for MyKey signing)
 *    - Fiscal year (for ESC ID generation in PA)
 */

import express   from 'express'
import puppeteer from 'puppeteer'

const router = express.Router()

// ─────────────────────────────────────────────────────────────
// FISCAL YEAR  e.g. April 2026 → March 2027 = "2627"
// ─────────────────────────────────────────────────────────────
const getFiscalYear = () => {
  const now   = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() + 1
  if (month >= 4) {
    return `${String(year).slice(2)}${String(year + 1).slice(2)}`
  } else {
    return `${String(year - 1).slice(2)}${String(year).slice(2)}`
  }
}

// ─────────────────────────────────────────────────────────────
// GENERATE PDF using Puppeteer
// Loads the React print page with formData injected,
// waits for full render, then prints to PDF
// ─────────────────────────────────────────────────────────────
const generatePdf = async (formData, fiscalYear) => {
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'

  console.log(`[submit] Launching Puppeteer headless browser...`)

  const browser = await puppeteer.launch({
    headless : 'new',
    args     : [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
    ],
  })

  try {
    const page = await browser.newPage()
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 })

    // Strip uploadedFiles — base64 content makes URL too long
    const { uploadedFiles, ...formDataForPrint } = formData

    // Build print URL — React /print route renders all 4 pages at once
    const encoded   = encodeURIComponent(JSON.stringify(formDataForPrint))
    const printUrl  = `${FRONTEND_URL}/print?data=${encoded}&fy=${fiscalYear}&id=`

    console.log(`[submit] Loading: ${FRONTEND_URL}/print`)
    await page.goto(printUrl, { waitUntil: 'networkidle0', timeout: 30000 })

    // Wait for .print-ready class — added by PrintPage when render is complete
    await page.waitForSelector('.print-ready', { timeout: 15000 })
      .catch(() => console.warn('[submit] .print-ready not found — printing anyway'))

    // Inject page break CSS to ensure Puppeteer respects breaks
    await page.addStyleTag({ content: `
      .print-page {
        page-break-after: always !important;
        break-after: page !important;
      }
      .print-page:last-of-type {
        page-break-after: avoid !important;
        break-after: avoid !important;
      }
    `})

    // Buffer for fonts/images/layout
    await new Promise(r => setTimeout(r, 1500))

    console.log(`[submit] Printing to PDF...`)
    const pdfBuffer = await page.pdf({
      format              : 'A4',
      printBackground     : true,
      margin              : { top: '6mm', bottom: '6mm', left: '6mm', right: '6mm' },
      displayHeaderFooter : false,
      preferCSSPageSize   : false,
    })

    console.log(`[submit] PDF generated — ${Math.round(pdfBuffer.length / 1024)} KB`)
    return pdfBuffer

  } finally {
    await browser.close()
  }
}

// ─────────────────────────────────────────────────────────────
// POWER AUTOMATE PAYLOAD
// ─────────────────────────────────────────────────────────────
const buildPAPayload = (formData, pdfBase64, fiscalYear) => ({

  fiscalYear,
  idPrefix     : 'ESC',
  idFormat     : `ESC-${fiscalYear}-NNN`,
  pdfBase64,
  fileName     : `ESC-${fiscalYear}-PENDING.pdf`,

  emailTo      : formData.clientEmail || process.env.SIGNATORY_EMAIL || '',
  emailSubject : `Action Required: MyKey Signature — Procurement Request ESC-${fiscalYear} — ${formData.clientFirstName || ''} ${formData.clientLastName || ''}`,
  emailBody    : `Dear ${formData.clientFirstName || ''} ${formData.clientLastName || ''},\n\nPlease find attached your completed Procurement Request Form A9565-E for your review and signature.\n\nProcurement Details:\n• Client: ${formData.clientFirstName || ''} ${formData.clientLastName || ''} — ${formData.clientBranch || ''}\n• Business Owner: ${formData.businessOwnerFirstName || ''} ${formData.businessOwnerLastName || ''}\n• Type: ${[formData.goodsSelected && 'Goods', formData.servicesSelected && 'Services', formData.constructionSelected && 'Construction'].filter(Boolean).join(', ') || 'TBD'}\n\nInstructions:\n1. Open the attached PDF in Adobe Acrobat\n2. Sign all required signature fields using your MyKey / Entrust digital key\n3. Save the signed PDF\n4. Forward the signed PDF to the procurement GD inbox: ${process.env.SIGNATORY_EMAIL || 'procurement-gd@agr.gc.ca'}\n\nThis request will be logged in SharePoint with reference ESC-${fiscalYear}-[assigned on creation].\n\nThank you,\nAAFC Procurement System`,

  clientName    : `${formData.clientFirstName || ''} ${formData.clientLastName || ''}`.trim(),
  clientEmail   : formData.clientEmail             || '',
  clientBranch  : formData.clientBranch            || '',
  ownerName     : `${formData.businessOwnerFirstName || ''} ${formData.businessOwnerLastName || ''}`.trim(),
  ownerEmail    : formData.businessOwnerEmail      || '',
  ownerBranch   : formData.businessOwnerBranch     || '',
  formDataJson  : JSON.stringify(formData)           || '',

  requiresGoods        : !!formData.goodsSelected,
  requiresServices     : !!formData.servicesSelected,
  requiresConstruction : !!formData.constructionSelected,
  goodsDeliveryDate    : formData.goodsDeliveryDate    || '',
  servicesStartDate    : formData.servicesStartDate    || '',
  servicesEndDate      : formData.servicesEndDate      || '',

  requirementDescription : formData.requirementDescription || '',
  totalEstimatedCost     : parseFloat(formData.calculatedTotals?.totalEstimatedCost || formData.totalEstimatedCost || 0),
  province               : formData.province               || '',
  accessibility          : formData.accessibilityType      || '',
  indigenous             : formData.indigenousConsidered    || '',
  environmental          : formData.environmentalConsidered || '',
  securityRequired       : formData.securityRequirement     || '',
  officialLanguages      : formData.officialLanguages       || '',
  ipPotential            : formData.ipPotential             || '',
  recommendedBy          : formData.recommendedName         || '',
  confirmedBy            : formData.confirmedName           || '',
  rcManager              : formData.responsibilityCentreManager || '',
  rcBranch               : formData.responsibilityBranch    || '',

  // Plant Code / Zone routing — maps to SPO "Zone" column
  zone                   : formData.plantZone   || '',
  plantCode              : formData.plantCode   || '',
  plantCity              : formData.plantCity   || '',
  plantName              : formData.plantName   || '',

  submittedAt            : new Date().toISOString(),
  status                 : 'Pending Signature',

  teamsMessageNew    : `📋 **New Procurement Request**\n**Ref:** ESC-${fiscalYear}-[ID]\n**Client:** ${formData.clientFirstName || ''} ${formData.clientLastName || ''} — ${formData.clientBranch || ''}\n**Type:** ${[formData.goodsSelected && 'Goods', formData.servicesSelected && 'Services', formData.constructionSelected && 'Construction'].filter(Boolean).join(', ') || 'TBD'}\n**Estimated Cost:** $${formData.calculatedTotals?.totalEstimatedCost || 'TBD'}\n**Status:** Sent to GD inbox for MyKey signature ✍️`,
  teamsMessageSigned : `✅ **Signed Document Received**\n**Ref:** ESC-${fiscalYear}-[ID]\n**Client:** ${formData.clientFirstName || ''} ${formData.clientLastName || ''}\nSigned PDF saved to SPO Documents as **ESC-${fiscalYear}-[ID].pdf**\nSharePoint list item updated — Status: Signed ✓`,
  attachments        : (formData.uploadedFiles || []).map(f => ({
    name   : f.name,
    content: f.base64,
    type   : f.type,
  })),
})

// ─────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  try {
    const formData   = req.body
    const fiscalYear = getFiscalYear()

    if (!formData || typeof formData !== 'object') {
      return res.status(400).json({ error: 'Missing form data' })
    }

    console.log(`\n[submit] ─────────────────────────────────`)
    console.log(`[submit] New submission at ${new Date().toISOString()}`)
    console.log(`[submit] Fiscal year: ${fiscalYear}`)
    console.log(`[submit] Client: ${formData.clientFirstName || '?'} ${formData.clientLastName || '?'} — ${formData.clientBranch || '?'}`)
    console.log(`[submit] Plant Code: ${formData.plantCode || '(none)'} → Zone: ${formData.plantZone || '(not set)'}`)
    console.log(`[submit] Uploaded files: ${(formData.uploadedFiles || []).length}`)

    // STEP 1: Generate PDF
    const pdfBuffer = await generatePdf(formData, fiscalYear)
    const pdfBase64 = pdfBuffer.toString('base64')

    // STEP 2: Fire Power Automate
    const PA_URL = process.env.POWER_AUTOMATE_URL

    if (!PA_URL) {
      console.warn(`[submit] POWER_AUTOMATE_URL not set — returning PDF only for local testing`)
      return res.json({
        success     : true,
        paTriggered : false,
        pdfBase64,
        fiscalYear,
        fileName    : `ESC-${fiscalYear}-PENDING.pdf`,
        message     : 'PDF generated successfully. Add POWER_AUTOMATE_URL to backend/.env to enable SharePoint + Teams + email.',
      })
    }

    const paPayload  = buildPAPayload(formData, pdfBase64, fiscalYear)
    console.log(`[submit] Firing Power Automate webhook...`)
    console.log(`[submit] Attachments: ${paPayload.attachments.length} file(s)`)

    const paResponse = await fetch(PA_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify(paPayload),
    })

    if (!paResponse.ok) {
      const errText = await paResponse.text()
      throw new Error(`Power Automate returned HTTP ${paResponse.status}: ${errText}`)
    }

    console.log(`[submit] ✅ Power Automate triggered — ${paResponse.status}`)
    console.log(`[submit] PA: creating SPO list item ESC-${fiscalYear}-NNN + emailing PDF + Teams message`)
    console.log(`[submit] ─────────────────────────────────\n`)

    res.json({
      success     : true,
      paTriggered : true,
      paStatus    : paResponse.status,
      fiscalYear,
      pdfBase64,
      fileName    : `ESC-${fiscalYear}-PENDING.pdf`,
      message     : `Submitted. PDF downloaded. PA creating SPO list item ESC-${fiscalYear}-NNN and notifying Teams.`,
    })

  } catch (err) {
    const errMsg = err.message || String(err)
    console.error('[submit] ❌ Error:', errMsg)
    res.status(500).json({ error: errMsg })
  }
})

export default router