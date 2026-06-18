import type { FaqItem } from '@/lib/blog'

// Interactive, expandable FAQ using the native <details> element: no client JS,
// fully accessible, and the answers stay in the DOM (crawlable) even when
// collapsed, so they still feed the FAQPage structured data and SEO.
export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  if (!items || items.length === 0) return null
  return (
    <section className="faq-accordion" aria-label="Frequently asked questions">
      <h2 className="faq-title">Frequently Asked Questions</h2>
      {items.map((item, i) => (
        <details key={i} className="faq-item">
          <summary>{item.q}</summary>
          <div className="faq-answer">
            <p>{item.a}</p>
          </div>
        </details>
      ))}
    </section>
  )
}
