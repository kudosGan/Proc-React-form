import express from 'express'

const router = express.Router()

// ─────────────────────────────────────────────────────────────
// POST /api/buyer/my-requests
// Returns all SPO list items assigned to the buyer email
// ─────────────────────────────────────────────────────────────
router.post('/my-requests', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required.' })
    }

    const LOOKUP_URL = process.env.POWER_AUTOMATE_BUYER_URL

    if (!LOOKUP_URL) {
      return res.status(500).json({ error: 'Lookup service not configured.' })
    }

    console.log(`[buyer/my-requests] Fetching requests for: ${email}`)

    const paResponse = await fetch(LOOKUP_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ action: 'myRequests', email }),
    })

    const result = await paResponse.json()

    if (!paResponse.ok) {
      return res.status(500).json({ error: 'Unable to retrieve requests.' })
    }

    console.log(`[buyer/my-requests] ✅ Found ${result.items?.length || 0} requests`)

    res.json({
      success: true,
      items  : result.items || [],
    })

  } catch (err) {
    console.error('[buyer/my-requests] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})
// ─────────────────────────────────────────────────────────────
// POST /api/buyer/search
// Search SPO list by Request ID or client name
// ─────────────────────────────────────────────────────────────
router.post('/search', async (req, res) => {
  try {
    const { query } = req.body

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' })
    }

    const BUYER_URL = process.env.POWER_AUTOMATE_BUYER_URL

    if (!BUYER_URL) {
      return res.status(500).json({ error: 'Buyer service not configured.' })
    }

    console.log(`[buyer/search] Searching for: ${query}`)

    const paResponse = await fetch(BUYER_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ action: 'search', query }),
    })

    const result = await paResponse.json()

    if (!paResponse.ok) {
      return res.status(500).json({ error: 'Unable to search requests.' })
    }

    console.log(`[buyer/search] ✅ Found ${result.items?.length || 0} results`)

    res.json({
      success: true,
      items  : result.items || [],
    })

  } catch (err) {
    console.error('[buyer/search] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})
// ─────────────────────────────────────────────────────────────
// POST /api/buyer/update
// Update SPO list item with buyer fields
// ─────────────────────────────────────────────────────────────
router.post('/update', async (req, res) => {
  try {
    const { spoItemId, fields } = req.body

    if (!spoItemId) {
      return res.status(400).json({ error: 'Request ID is required.' })
    }

    const BUYER_URL = process.env.POWER_AUTOMATE_BUYER_URL

    if (!BUYER_URL) {
      return res.status(500).json({ error: 'Buyer service not configured.' })
    }

    console.log(`[buyer/update] Updating item: ${spoItemId}`)

    const paResponse = await fetch(BUYER_URL, {
      method  : 'POST',
      headers : { 'Content-Type': 'application/json' },
      body    : JSON.stringify({ action: 'update', spoItemId, fields }),
    })

    const result = await paResponse.json()

    if (!paResponse.ok) {
      return res.status(500).json({ error: 'Unable to update request.' })
    }

    console.log(`[buyer/update] ✅ Updated item: ${spoItemId}`)

    res.json({ success: true, message: 'Request updated successfully.' })

  } catch (err) {
    console.error('[buyer/update] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})
export default router