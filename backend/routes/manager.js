import express from 'express'

const router = express.Router()

// ─────────────────────────────────────────────────────────────
// POST /api/manager/all-requests
// Returns ALL SPO list items for manager view
// ─────────────────────────────────────────────────────────────
router.post('/all-requests', async (req, res) => {
  try {
    const BUYER_URL = process.env.POWER_AUTOMATE_BUYER_URL

    if (!BUYER_URL) {
      return res.status(500).json({
        error: 'POWER_AUTOMATE_BUYER_URL is not set in backend/.env',
      })
    }

    // Reuse the existing buyer PA flow's "search" action.
    // Sending an empty query string returns all items from the SPO list.
    const paResponse = await fetch(BUYER_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ action: 'search', query: 'ESC-' }),
    })

    const raw = await paResponse.text()
    let result
    try { result = JSON.parse(raw) } catch {
      console.error('[manager/all-requests] Non-JSON response from PA:', raw.slice(0, 300))
      return res.status(500).json({ error: 'Power Automate returned an unexpected response. Check the PA flow handles empty search queries.' })
    }

    if (!paResponse.ok) {
      console.error('[manager/all-requests] PA error:', result)
      return res.status(500).json({ error: result?.error?.message || result?.message || 'Power Automate returned an error.' })
    }

    const items = result.items || result.value || []
    console.log(`[manager/all-requests] ✅ Found ${items.length} requests`)
    res.json({ success: true, items })

  } catch (err) {
    console.error('[manager/all-requests] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// POST /api/manager/approve
// Approve or reject a request (updates SPO status via PA)
// ─────────────────────────────────────────────────────────────
router.post('/approve', async (req, res) => {
  try {
    const { spoItemId, decision, comments } = req.body

    if (!spoItemId || !decision) {
      return res.status(400).json({ error: 'spoItemId and decision are required.' })
    }

    const BUYER_URL = process.env.POWER_AUTOMATE_BUYER_URL

    if (!BUYER_URL) {
      return res.status(500).json({ error: 'Manager service not configured.' })
    }

    const newStatus = decision === 'approve' ? 'Approved' : 'Rejected'

    const paResponse = await fetch(BUYER_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({
        action   : 'update',
        spoItemId,
        fields   : { status: newStatus, comments: comments || '' },
      }),
    })

    if (!paResponse.ok) {
      return res.status(500).json({ error: 'Unable to update request.' })
    }

    console.log(`[manager/approve] ✅ ${newStatus}: ${spoItemId}`)
    res.json({ success: true, newStatus })

  } catch (err) {
    console.error('[manager/approve] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

export default router
