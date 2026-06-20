/**
 * AAFC Procurement Form — Backend Server
 */

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'

import submitRouter  from './routes/submit.js'
import agentRouter   from './routes/agent.js'
import amendRouter   from './routes/amend.js'
import buyerRouter   from './routes/buyer.js'
import managerRouter from './routes/manager.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

app.use('/api/submit', submitRouter)
app.use('/api/agent', agentRouter)
app.use('/api/amend', amendRouter)
app.use('/api/buyer',   buyerRouter)
app.use('/api/manager', managerRouter)
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'AAFC Procurement Backend',
    timestamp: new Date().toISOString(),
    aiConnected: !!process.env.AZURE_OPENAI_KEY,
    powerAutomateConfigured: !!process.env.POWER_AUTOMATE_URL,
    lookupConfigured: !!process.env.POWER_AUTOMATE_LOOKUP_URL,
  })
})

app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` })
})

app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ error: err.message || 'Internal server error' })
})

app.listen(PORT, () => {
  console.log('')
  console.log('  AAFC Procurement Backend')
  console.log(`  Running on http://localhost:${PORT}`)
  console.log(`  Health: http://localhost:${PORT}/api/health`)
  console.log(`  AI agent: ${process.env.AZURE_OPENAI_KEY ? 'Azure OpenAI connected' : 'Not connected yet (add AZURE_OPENAI_KEY to .env)'}`)
  console.log(`  Power Automate: ${process.env.POWER_AUTOMATE_URL ? 'Configured ✅' : 'Not configured (add POWER_AUTOMATE_URL to .env)'}`)
  console.log(`  Lookup: ${process.env.POWER_AUTOMATE_LOOKUP_URL ? 'Configured ✅' : 'Not configured (add POWER_AUTOMATE_LOOKUP_URL to .env)'}`)
  console.log('')
})