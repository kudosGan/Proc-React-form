/**
 * CopilotPanel — side panel copilot UI
 * ──────────────────────────────────────
 * Slides in from the right beside the form.
 * Shows chat history, action tags, and feedback buttons.
 */

import { useState, useRef, useEffect } from 'react'
import { useAgentLoop } from './useAgentLoop'
import { getMemoryStats, clearMemory } from './agentMemory'
import './copilot.css'

// ─────────────────────────────────────────
// ACTION TAG — shows what the agent did
// ─────────────────────────────────────────

function ActionTag({ action, onThumbsUp, onThumbsDown }) {
  const [correcting, setCorrecting] = useState(false)
  const [correctedValue, setCorrectedValue] = useState('')
  const [feedback, setFeedback] = useState(null) // 'up' | 'down'

  if (action.tool !== 'set_field') return null

  const handleDown = () => {
    if (feedback) return
    setCorrecting(true)
  }

  const handleSubmitCorrection = () => {
    if (!correctedValue.trim()) return
    setFeedback('down')
    setCorrecting(false)
    onThumbsDown(action, correctedValue.trim())
  }

  const handleUp = () => {
    if (feedback) return
    setFeedback('up')
    onThumbsUp(action)
  }

  return (
    <div className={`action-tag ${action.status === 'failed' ? 'action-failed' : ''}`}>
      <span className="action-field">{action.fieldKey}</span>
      <span className="action-arrow">→</span>
      <span className="action-value">
        {typeof action.value === 'boolean' ? (action.value ? '✓ checked' : '✗ unchecked') : action.value}
      </span>

      {action.status === 'failed' && (
        <span className="action-error" title={action.error}>⚠️</span>
      )}

      {action.status === 'success' && !feedback && (
        <span className="action-feedback">
          <button className="fb-btn" onClick={handleUp} title="Correct">👍</button>
          <button className="fb-btn" onClick={handleDown} title="Wrong — correct it">👎</button>
        </span>
      )}

      {feedback === 'up' && <span className="fb-done">✓ noted</span>}
      {feedback === 'down' && <span className="fb-done">✓ learned</span>}

      {correcting && (
        <div className="correction-input">
          <input
            type="text"
            placeholder="Correct value..."
            value={correctedValue}
            onChange={(e) => setCorrectedValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmitCorrection()}
            autoFocus
          />
          <button onClick={handleSubmitCorrection}>Save</button>
          <button onClick={() => setCorrecting(false)}>Cancel</button>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────
// MESSAGE BUBBLE
// ─────────────────────────────────────────

function MessageBubble({ msg, onThumbsUp, onThumbsDown }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`message-wrap ${isUser ? 'msg-user' : 'msg-agent'}`}>
      {!isUser && (
        <div className="agent-avatar" aria-label="Copilot">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="#1a6b3c"/>
            <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
      )}

      <div className={`message-bubble ${isUser ? 'bubble-user' : 'bubble-agent'} ${msg.isError ? 'bubble-error' : ''}`}>
        <div
          className="message-text"
          dangerouslySetInnerHTML={{
            __html: msg.content
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\n/g, '<br/>'),
          }}
        />

        {msg.actions && msg.actions.length > 0 && (
          <div className="action-tags">
            {msg.actions.map((action, i) => (
              <ActionTag
                key={i}
                action={action}
                onThumbsUp={onThumbsUp}
                onThumbsDown={onThumbsDown}
              />
            ))}
          </div>
        )}

        {msg.askUser && (
          <div className="ask-user-hint">
            💬 {msg.askUser}
          </div>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────
// QUICK PROMPT CHIPS
// ─────────────────────────────────────────

const QUICK_PROMPTS = [
  "What fields are still empty?",
  "Fill my name and email",
  "This is a services request",
  "Set accessibility to Included",
  "Show my progress",
]

// ─────────────────────────────────────────
// MAIN PANEL
// ─────────────────────────────────────────

function CopilotPanel({ formData, setFormData, currentPage, setCurrentPage }) {
  const [isOpen, setIsOpen] = useState(true)
  const [input, setInput] = useState('')
  const [showMemoryStats, setShowMemoryStats] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const {
    messages,
    isLoading,
    sendMessage,
    handleThumbsUp,
    handleThumbsDown,
    quickSummarize,
  } = useAgentLoop({ formData, setFormData, currentPage, setCurrentPage })

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return
    sendMessage(input)
    setInput('')
    inputRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const memStats = getMemoryStats()

  return (
    <>
      {/* TOGGLE BUTTON — shown when panel is closed */}
      {!isOpen && (
        <button
          className="copilot-toggle-btn"
          onClick={() => setIsOpen(true)}
          aria-label="Open Copilot"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="white"/>
            <path d="M8 12h8M12 8v8" stroke="#1a6b3c" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          Copilot
        </button>
      )}

      {/* SIDE PANEL */}
      {isOpen && (
        <div className="copilot-panel" role="complementary" aria-label="Procurement Copilot">

          {/* HEADER */}
          <div className="copilot-header">
            <div className="copilot-header-left">
              <div className="copilot-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" fill="white" opacity="0.9"/>
                  <path d="M8 12h8M12 8v8" stroke="#1a6b3c" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <div className="copilot-title">Procurement Copilot</div>
                <div className="copilot-subtitle">AAFC Form A9565-E · Page {currentPage}/4</div>
              </div>
            </div>
            <div className="copilot-header-right">
              <button
                className="header-btn"
                onClick={() => setShowMemoryStats(!showMemoryStats)}
                title="Memory stats"
              >
                M
              </button>
              <button
                className="header-btn"
                onClick={quickSummarize}
                title="Show progress"
            >
                P
              </button>
              <button
                className="header-btn close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* MEMORY STATS */}
          {showMemoryStats && (
            <div className="memory-stats">
              <strong>Agent Memory</strong>
              <span>{memStats.corrections} corrections</span>
              <span>{memStats.confirmations} confirmations</span>
              <span>{memStats.learnedRules} learned rules</span>
              <button onClick={() => { clearMemory(); setShowMemoryStats(false) }}>
                Clear memory
              </button>
            </div>
          )}

          {/* MESSAGES */}
          <div className="copilot-messages">
            {messages.map((msg, i) => (
              <MessageBubble
                key={i}
                msg={msg}
                onThumbsUp={handleThumbsUp}
                onThumbsDown={handleThumbsDown}
              />
            ))}

            {isLoading && (
              <div className="message-wrap msg-agent">
                <div className="agent-avatar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" fill="#1a6b3c"/>
                    <path d="M8 12h8M12 8v8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <div className="message-bubble bubble-agent">
                  <div className="typing-indicator">
                    <span/><span/><span/>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* QUICK PROMPTS */}
          <div className="quick-prompts">
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                className="quick-chip"
                onClick={() => sendMessage(prompt)}
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* INPUT */}
          <div className="copilot-input-area">
            <textarea
              ref={inputRef}
              className="copilot-input"
              placeholder="Ask me to fill fields, check progress, or explain a section..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={2}
              disabled={isLoading}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              aria-label="Send"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

        </div>
      )}
    </>
  )
}

export default CopilotPanel
