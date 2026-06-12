/**
 * useAgentLoop — core agentic loop hook
 * ──────────────────────────────────────
 * Implements: Plan → Act → Observe → Reflect → Learn
 *
 * The agent has 6 tools it can call:
 *   read_form_state    — inspect current form values
 *   set_field          — fill a specific field
 *   validate_field     — check format rules
 *   navigate_tab       — request page change
 *   summarize_progress — count filled vs empty
 *   submit_form        — trigger final submission
 *
 * AI is called via the backend /api/agent/chat endpoint.
 * When Azure OpenAI is connected, only that endpoint changes.
 * All tool-calling logic stays here.
 */

import { useState, useCallback, useRef } from 'react'
import { FIELD_MAP, getFormProgress, getField } from './fieldMap'
import { buildMemoryContext, recordCorrection, recordConfirmation } from './agentMemory'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'

// ─────────────────────────────────────────
// TOOL DEFINITIONS (sent to AI as context)
// ─────────────────────────────────────────

const TOOLS = [
  {
    name: 'set_field',
    description: 'Fill a form field with a value',
    parameters: ['fieldKey (string)', 'value (string|boolean)'],
  },
  {
    name: 'navigate_tab',
    description: 'Switch to a specific page of the form',
    parameters: ['page (number 1-4)'],
  },
  {
    name: 'read_form_state',
    description: 'Read the current values of all form fields',
    parameters: [],
  },
  {
    name: 'validate_field',
    description: 'Check if a value is valid for a given field',
    parameters: ['fieldKey (string)', 'value (string)'],
  },
  {
    name: 'summarize_progress',
    description: 'Return count of filled vs empty fields',
    parameters: [],
  },
  {
    name: 'submit_form',
    description: 'Trigger form submission when all required fields are filled',
    parameters: [],
  },
]

// ─────────────────────────────────────────
// BUILD SYSTEM PROMPT
// ─────────────────────────────────────────

const buildSystemPrompt = (formData) => {
  const memoryContext = buildMemoryContext()
  const { filled, empty, total } = getFormProgress(formData)

  const fieldList = FIELD_MAP.map(
    (f) => `  - [Page ${f.page}] ${f.key} (${f.type})${f.options ? ': ' + f.options.join(' | ') : ''}`
  ).join('\n')

  return `You are a Procurement Copilot for Agriculture and Agri-Food Canada (AAFC).
You help users fill out the AAFC Procurement Request Form A9565-E.

FORM STRUCTURE:
- Page 1: Client Information + Requirement Summary
- Page 2: Procurement Considerations (Accessibility, Indigenous, Environmental, Employee/Employer)
- Page 3: IP, Security, Official Languages, Life Cycle, Estimated Cost
- Page 4: Signatures, Financial Coding, Supporting Documents

CURRENT PROGRESS: ${filled.length}/${total} fields filled.

AVAILABLE FIELDS:
${fieldList}

YOUR TOOLS:
${TOOLS.map((t) => `  ${t.name}(${t.parameters.join(', ')}) — ${t.description}`).join('\n')}

RESPONSE FORMAT:
Respond with a JSON object:
{
  "thoughts": "brief reasoning about what to do",
  "actions": [
    { "tool": "set_field", "fieldKey": "clientFirstName", "value": "John" },
    { "tool": "navigate_tab", "page": 2 }
  ],
  "message": "Human-readable reply to show the user",
  "askUser": "Optional: a clarifying question if you need more info"
}

RULES:
- For date fields always use YYYY-MM-DD format
- For yesno fields use exactly "Yes" or "No"
- For checkbox fields use true or false (boolean)
- If user says "services starting next month" — calculate the actual date
- Always set_field before navigate_tab
- If a field has a learned preference, use it unless user says otherwise
- Never make up values — ask if unsure
- Be concise and professional

${memoryContext ? '\n' + memoryContext : ''}
`
}

// ─────────────────────────────────────────
// VALIDATE A FIELD VALUE
// ─────────────────────────────────────────

const validateFieldValue = (fieldKey, value) => {
  const field = getField(fieldKey)
  if (!field) return { valid: false, error: `Unknown field: ${fieldKey}` }

  if (field.type === 'date') {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    if (!dateRegex.test(value)) {
      return { valid: false, error: `Date must be YYYY-MM-DD format, got: ${value}` }
    }
  }

  if (field.type === 'yesno' && !['Yes', 'No'].includes(value)) {
    return { valid: false, error: `Must be "Yes" or "No", got: ${value}` }
  }

  if (field.type === 'dropdown' && field.options && !field.options.includes(value)) {
    return {
      valid: false,
      error: `Invalid option. Valid options: ${field.options.join(', ')}`,
    }
  }

  if (field.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (value && !emailRegex.test(value)) {
      return { valid: false, error: `Invalid email format: ${value}` }
    }
  }

  return { valid: true }
}

// ─────────────────────────────────────────
// MAIN HOOK
// ─────────────────────────────────────────

export const useAgentLoop = ({ formData, setFormData, currentPage, setCurrentPage }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hi! I'm your Procurement Copilot. I can help you fill this AAFC form. Just tell me what you need — for example: \"I'm John Smith from Corporate Management Branch, requesting services starting June 1st\" and I'll fill in the fields for you.",
      actions: [],
      timestamp: new Date().toISOString(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const [lastActions, setLastActions] = useState([])
  const conversationHistory = useRef([])

  // ─────────────────────────────────────────
  // EXECUTE TOOL CALLS
  // ─────────────────────────────────────────

  const executeActions = useCallback(
    (actions, currentFormData) => {
      let updatedFormData = { ...currentFormData }
      const executedActions = []
      let requestedPage = null

      for (const action of actions) {
        try {
          switch (action.tool) {
            case 'set_field': {
              const { fieldKey, value } = action
              const validation = validateFieldValue(fieldKey, value)

              if (!validation.valid) {
                executedActions.push({
                  ...action,
                  status: 'failed',
                  error: validation.error,
                })
                break
              }

              updatedFormData = { ...updatedFormData, [fieldKey]: value }
              executedActions.push({ ...action, status: 'success' })
              break
            }

            case 'navigate_tab': {
              const page = parseInt(action.page)
              if (page >= 1 && page <= 4) {
                requestedPage = page
                executedActions.push({ ...action, status: 'success' })
              } else {
                executedActions.push({ ...action, status: 'failed', error: 'Invalid page' })
              }
              break
            }

            case 'validate_field': {
              const result = validateFieldValue(action.fieldKey, action.value)
              executedActions.push({ ...action, status: 'success', result })
              break
            }

            case 'read_form_state': {
              executedActions.push({
                ...action,
                status: 'success',
                result: updatedFormData,
              })
              break
            }

            case 'summarize_progress': {
              const progress = getFormProgress(updatedFormData)
              executedActions.push({ ...action, status: 'success', result: progress })
              break
            }

            default:
              executedActions.push({ ...action, status: 'unknown_tool' })
          }
        } catch (err) {
          executedActions.push({ ...action, status: 'error', error: err.message })
        }
      }

      return { updatedFormData, executedActions, requestedPage }
    },
    []
  )

  // ─────────────────────────────────────────
  // SEND MESSAGE → AGENT LOOP
  // ─────────────────────────────────────────

  const sendMessage = useCallback(
    async (userMessage) => {
      if (!userMessage.trim() || isLoading) return

      const userMsg = {
        role: 'user',
        content: userMessage,
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, userMsg])
      setIsLoading(true)

      // Add to conversation history
      conversationHistory.current.push({ role: 'user', content: userMessage })

      try {
        // Call backend AI endpoint
        const response = await fetch(`${BACKEND_URL}/api/agent/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemPrompt: buildSystemPrompt(formData),
            history: conversationHistory.current,
            formData,
            currentPage,
          }),
        })

        if (!response.ok) {
          throw new Error(`Backend returned ${response.status}`)
        }

        const data = await response.json()

        // Parse agent response
        let agentResponse
        try {
          // Backend returns parsed JSON already
          agentResponse = data.agentResponse
        } catch {
          agentResponse = {
            thoughts: '',
            actions: [],
            message: data.rawText || 'I had trouble understanding that. Could you rephrase?',
            askUser: null,
          }
        }

        // Execute tool calls
        const { updatedFormData, executedActions, requestedPage } = executeActions(
          agentResponse.actions || [],
          formData
        )

        // Apply form updates
        setFormData(updatedFormData)

        // Navigate page if requested
        if (requestedPage) {
          setCurrentPage(requestedPage)
        }

        // Store executed actions for feedback UI
        setLastActions(executedActions)

        // Build assistant message
        const assistantMsg = {
          role: 'assistant',
          content: agentResponse.message,
          askUser: agentResponse.askUser || null,
          actions: executedActions,
          timestamp: new Date().toISOString(),
        }

        setMessages((prev) => [...prev, assistantMsg])

        // Add to conversation history (summarized)
        conversationHistory.current.push({
          role: 'assistant',
          content: agentResponse.message,
        })

        // Keep history bounded
        if (conversationHistory.current.length > 20) {
          conversationHistory.current = conversationHistory.current.slice(-16)
        }
      } catch (err) {
        const errorMsg = {
          role: 'assistant',
          content: `⚠️ I couldn't connect to the backend. Make sure the server is running on port 3001.\n\nError: ${err.message}`,
          actions: [],
          timestamp: new Date().toISOString(),
          isError: true,
        }
        setMessages((prev) => [...prev, errorMsg])
      } finally {
        setIsLoading(false)
      }
    },
    [formData, setFormData, currentPage, setCurrentPage, isLoading, executeActions]
  )

  // ─────────────────────────────────────────
  // FEEDBACK HANDLERS (RL signals)
  // ─────────────────────────────────────────

  const handleThumbsUp = useCallback(async (action) => {
    if (action.tool === 'set_field') {
      recordConfirmation(action.fieldKey, action.value)
      // Also send to backend for server-side storage
      try {
        await fetch(`${BACKEND_URL}/api/agent/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'confirmation',
            field: action.fieldKey,
            value: action.value,
          }),
        })
      } catch { /* silent */ }
    }
  }, [])

  const handleThumbsDown = useCallback(async (action, correctedValue) => {
    if (action.tool === 'set_field') {
      recordCorrection(action.fieldKey, action.value, correctedValue)
      try {
        await fetch(`${BACKEND_URL}/api/agent/feedback`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'correction',
            field: action.fieldKey,
            wrongValue: action.value,
            rightValue: correctedValue,
          }),
        })
      } catch { /* silent */ }
    }
  }, [])

  // ─────────────────────────────────────────
  // QUICK FILL — fills obvious fields from formData context
  // ─────────────────────────────────────────

  const quickSummarize = useCallback(() => {
    const { filled, empty } = getFormProgress(formData)
    const msg =
      `**Progress: ${filled.length}/${filled.length + empty.length} fields filled.**\n\n` +
      (empty.length > 0
        ? `Still needed:\n${empty.slice(0, 8).map((f) => `• ${f.label} (Page ${f.page})`).join('\n')}${empty.length > 8 ? `\n…and ${empty.length - 8} more` : ''}`
        : '✅ All fields are filled! Ready to submit.')

    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: msg,
        actions: [],
        timestamp: new Date().toISOString(),
      },
    ])
  }, [formData])

  return {
    messages,
    isLoading,
    lastActions,
    sendMessage,
    handleThumbsUp,
    handleThumbsDown,
    quickSummarize,
  }
}
