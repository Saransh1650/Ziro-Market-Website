'use client'

import { useState } from 'react'
import type { FaqItem } from '@/lib/blog'

// Answers are always in the DOM (never conditionally mounted) so crawlers that
// don't execute JS or simulate clicks — GPTBot, ClaudeBot, PerplexityBot,
// Googlebot's non-JS pass — see the real answer text, not just the question.
// Open/close is a pure-CSS grid-rows transition driven by the `data-open`
// attribute; no motion library needed for a collapse/expand this simple.
export default function FaqAccordion({
  items,
  title = 'Frequently Asked Questions',
}: {
  items: FaqItem[]
  title?: string
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  if (!items || items.length === 0) return null

  return (
    <section className="faq-accordion" aria-label={title}>
      <h2 className="faq-title">{title}</h2>
      {items.map((item, i) => {
        const isOpen = openIndex === i
        return (
          <div key={i} className="faq-item" data-open={isOpen ? 'true' : undefined}>
            <button
              className="faq-summary"
              onClick={() => setOpenIndex(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="faq-question">{item.q}</span>
              <span className="faq-icon" aria-hidden>+</span>
            </button>
            <div className="faq-answer">
              <div className="faq-answer-inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </section>
  )
}
