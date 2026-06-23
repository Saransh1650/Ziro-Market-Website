'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { FaqItem } from '@/lib/blog'

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
              <motion.span
                className="faq-icon"
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                aria-hidden
              >
                +
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="faq-answer-inner">
                    <p>{item.a}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </section>
  )
}
