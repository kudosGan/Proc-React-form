/**
 * AGENT MEMORY SERVICE
 * --------------------
 * Stores feedback signals and learned rules in localStorage.
 * When you connect Azure later, swap localStorage calls for
 * Azure Table Storage API calls — interface stays identical.
 *
 * Memory types:
 *   corrections  — user corrected a value the agent filled
 *   confirmations— user thumbs-up'd an agent action
 *   rules        — derived rules from repeated corrections
 */

const MEMORY_KEY = 'procurement_agent_memory'

const defaultMemory = {
  corrections: [],    // { field, wrongValue, rightValue, timestamp }
  confirmations: [],  // { field, value, timestamp }
  rules: {},          // { fieldKey: [{ pattern, value, confidence }] }
  sessionCount: 0,
}

// ─────────────────────────────────────────
// READ / WRITE
// ─────────────────────────────────────────

export const readMemory = () => {
  try {
    const raw = localStorage.getItem(MEMORY_KEY)
    return raw ? JSON.parse(raw) : { ...defaultMemory }
  } catch {
    return { ...defaultMemory }
  }
}

const writeMemory = (memory) => {
  try {
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory))
  } catch {
    // storage full or unavailable — silent fail
  }
}

// ─────────────────────────────────────────
// RECORD CORRECTION (thumbs down)
// ─────────────────────────────────────────

export const recordCorrection = (field, wrongValue, rightValue) => {
  const memory = readMemory()

  memory.corrections.push({
    field,
    wrongValue,
    rightValue,
    timestamp: new Date().toISOString(),
  })

  // Derive a rule: if this field was corrected 2+ times to the same value,
  // lock it in as a high-confidence rule
  const sameCorrections = memory.corrections.filter(
    (c) => c.field === field && c.rightValue === rightValue
  )

  if (sameCorrections.length >= 2) {
    if (!memory.rules[field]) memory.rules[field] = []

    const existingRule = memory.rules[field].find((r) => r.value === rightValue)
    if (existingRule) {
      existingRule.confidence = Math.min(1, existingRule.confidence + 0.2)
    } else {
      memory.rules[field].push({
        value: rightValue,
        confidence: 0.6,
        learnedAt: new Date().toISOString(),
      })
    }
  }

  writeMemory(memory)
}

// ─────────────────────────────────────────
// RECORD CONFIRMATION (thumbs up)
// ─────────────────────────────────────────

export const recordConfirmation = (field, value) => {
  const memory = readMemory()

  memory.confirmations.push({
    field,
    value,
    timestamp: new Date().toISOString(),
  })

  // Boost confidence of matching rule
  if (memory.rules[field]) {
    const rule = memory.rules[field].find((r) => r.value === value)
    if (rule) {
      rule.confidence = Math.min(1, rule.confidence + 0.1)
    }
  }

  writeMemory(memory)
}

// ─────────────────────────────────────────
// GET SUGGESTED VALUE for a field
// ─────────────────────────────────────────

export const getSuggestedValue = (fieldKey) => {
  const memory = readMemory()
  const rules = memory.rules[fieldKey]

  if (!rules || rules.length === 0) return null

  // Return highest-confidence rule above threshold
  const best = rules
    .filter((r) => r.confidence >= 0.5)
    .sort((a, b) => b.confidence - a.confidence)[0]

  return best ? best.value : null
}

// ─────────────────────────────────────────
// BUILD MEMORY CONTEXT STRING for AI prompt
// ─────────────────────────────────────────

export const buildMemoryContext = () => {
  const memory = readMemory()
  const lines = []

  Object.entries(memory.rules).forEach(([field, rules]) => {
    rules.forEach((rule) => {
      if (rule.confidence >= 0.6) {
        lines.push(
          `Field "${field}" is usually "${rule.value}" (confidence: ${Math.round(rule.confidence * 100)}%)`
        )
      }
    })
  })

  return lines.length > 0
    ? `Learned preferences from past sessions:\n${lines.join('\n')}`
    : ''
}

// ─────────────────────────────────────────
// CLEAR MEMORY (for testing / reset)
// ─────────────────────────────────────────

export const clearMemory = () => {
  writeMemory({ ...defaultMemory })
}

export const getMemoryStats = () => {
  const memory = readMemory()
  return {
    corrections: memory.corrections.length,
    confirmations: memory.confirmations.length,
    learnedRules: Object.keys(memory.rules).length,
  }
}
