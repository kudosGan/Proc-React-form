/**
 * POST /api/agent/chat   — AI copilot (Azure OpenAI — connect later)
 * POST /api/agent/feedback — store RL feedback signals
 * GET  /api/agent/memory   — return learned rules summary
 *
 * TO CONNECT AZURE OPENAI:
 *   1. Create Azure OpenAI resource in Azure portal
 *   2. Deploy a model (gpt-4o recommended)
 *   3. Add to .env:
 *        AZURE_OPENAI_KEY=your-key
 *        AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com
 *        AZURE_OPENAI_DEPLOYMENT=gpt-4o
 *   4. Uncomment the Azure OpenAI block below and comment out the stub
 */

import express from 'express'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const router = express.Router()
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const MEMORY_FILE = join(__dirname, '..', 'memory', 'agentMemory.json')

// ─────────────────────────────────────────────────────────────
// MEMORY HELPERS
// ─────────────────────────────────────────────────────────────
const readMemory = () => {
  try {
    if (!existsSync(MEMORY_FILE)) return { rules: {}, corrections: [], confirmations: [] }
    return JSON.parse(readFileSync(MEMORY_FILE, 'utf8'))
  } catch { return { rules: {}, corrections: [], confirmations: [] } }
}

const writeMemory = (data) => {
  try { writeFileSync(MEMORY_FILE, JSON.stringify(data, null, 2)) } catch { /* silent */ }
}

// ─────────────────────────────────────────────────────────────
// POST /api/agent/chat
// ─────────────────────────────────────────────────────────────
router.post('/chat', async (req, res) => {
  try {
    const { systemPrompt, history, formData, currentPage } = req.body

    // ── AZURE OPENAI (uncomment when ready) ──────────────────
    /*
    const { AzureOpenAI } = await import('openai')

    const client = new AzureOpenAI({
      apiKey      : process.env.AZURE_OPENAI_KEY,
      endpoint    : process.env.AZURE_OPENAI_ENDPOINT,
      deployment  : process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      apiVersion  : '2024-10-01-preview',
    })

    const response = await client.chat.completions.create({
      model    : process.env.AZURE_OPENAI_DEPLOYMENT || 'gpt-4o',
      messages : [
        { role: 'system', content: systemPrompt },
        ...history,
      ],
      max_tokens  : 1000,
      temperature : 0.2,
    })

    const raw = response.choices[0]?.message?.content || ''

    let agentResponse
    try {
      const clean = raw.replace(/```json|```/g, '').trim()
      agentResponse = JSON.parse(clean)
    } catch {
      agentResponse = { thoughts: '', actions: [], message: raw, askUser: null }
    }

    return res.json({ agentResponse })
    */

    // ── STUB (remove when Azure OpenAI connected) ─────────────
    // Returns a helpful offline message so the UI works without AI
    const userMessage = history[history.length - 1]?.content || ''
    const lowerMsg = userMessage.toLowerCase()

    let stubMessage = ''
    let stubActions = []

    if (lowerMsg.includes('progress') || lowerMsg.includes('empty') || lowerMsg.includes('filled')) {
      stubMessage = '⏳ **Azure OpenAI not connected yet.**\n\nTo see real progress, add your Azure OpenAI credentials to `backend/.env` and restart the server.\n\nOnce connected, I\'ll analyze all 4 pages and tell you exactly which fields still need filling.'
    } else if (lowerMsg.includes('fill') || lowerMsg.includes('my name') || lowerMsg.includes('email')) {
      stubMessage = '⏳ **Azure OpenAI not connected yet.**\n\nOnce connected, I\'ll understand your message and fill the matching fields automatically across all 4 pages.\n\nFor now, fill fields directly in the form above.'
    } else {
      stubMessage = '⏳ **Copilot not connected yet.**\n\nTo activate the AI agent:\n1. Create an Azure OpenAI resource\n2. Add credentials to `backend/.env`\n3. Restart the backend\n\nSee README.md → "Connecting Azure OpenAI" for step-by-step instructions.'
    }

    res.json({
      agentResponse: {
        thoughts : 'Azure OpenAI not yet connected — returning stub response',
        actions  : stubActions,
        message  : stubMessage,
        askUser  : null,
      }
    })

  } catch (err) {
    console.error('[agent/chat] Error:', err.message)
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// POST /api/agent/feedback  — store RL signal
// ─────────────────────────────────────────────────────────────
router.post('/feedback', (req, res) => {
  try {
    const { type, field, value, wrongValue, rightValue } = req.body
    const memory = readMemory()

    if (type === 'confirmation') {
      memory.confirmations.push({ field, value, timestamp: new Date().toISOString() })
      if (!memory.rules[field]) memory.rules[field] = []
      const existing = memory.rules[field].find(r => r.value === value)
      if (existing) {
        existing.confidence = Math.min(1, existing.confidence + 0.1)
      } else {
        memory.rules[field].push({ value, confidence: 0.6, learnedAt: new Date().toISOString() })
      }
    }

    if (type === 'correction') {
      memory.corrections.push({ field, wrongValue, rightValue, timestamp: new Date().toISOString() })
      if (!memory.rules[field]) memory.rules[field] = []
      const sameCorrections = memory.corrections.filter(c => c.field === field && c.rightValue === rightValue)
      if (sameCorrections.length >= 2) {
        const existing = memory.rules[field].find(r => r.value === rightValue)
        if (existing) {
          existing.confidence = Math.min(1, existing.confidence + 0.2)
        } else {
          memory.rules[field].push({ value: rightValue, confidence: 0.7, learnedAt: new Date().toISOString() })
        }
      }
    }

    writeMemory(memory)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ─────────────────────────────────────────────────────────────
// GET /api/agent/memory  — return learned rules summary
// ─────────────────────────────────────────────────────────────
router.get('/memory', (req, res) => {
  const memory = readMemory()
  res.json({
    learnedRules  : Object.keys(memory.rules).length,
    corrections   : memory.corrections.length,
    confirmations : memory.confirmations.length,
    rules         : memory.rules,
  })
})

export default router
