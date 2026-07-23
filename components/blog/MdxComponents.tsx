import type { ReactNode } from 'react'

// Server-rendered MDX components for blog posts. Everything renders to plain
// HTML/SVG in the DOM (no client JS), so all content stays crawlable and SEO
// friendly. Use these organically inside posts to break up text, never the same
// mix every time. See content/blog/RULES.md.

const GREEN = '#0b3b2e'
const GOLD = '#9b6810'
const UP = '#0b7a3e'
const DOWN = '#c0392b'

type CalloutType = 'note' | 'insight' | 'risk' | 'stat'

const CALLOUTS: Record<CalloutType, { bg: string; border: string; label: string }> = {
  note: { bg: '#f4efe3', border: GOLD, label: 'Note' },
  insight: { bg: 'rgba(11,59,46,0.05)', border: GREEN, label: 'Why it matters' },
  risk: { bg: 'rgba(192,57,43,0.06)', border: DOWN, label: 'Risk' },
  stat: { bg: 'rgba(11,122,62,0.07)', border: UP, label: 'Key stat' },
}

// Highlighted aside box. <Callout type="risk" title="...">text</Callout>
export function Callout({
  type = 'note',
  title,
  children,
}: {
  type?: CalloutType
  title?: string
  children?: ReactNode
}) {
  const c = CALLOUTS[type] ?? CALLOUTS.note
  return (
    <aside
      className="callout-body"
      style={{
        borderLeft: `3px solid ${c.border}`,
        background: c.bg,
        borderRadius: 8,
        padding: '16px 18px',
        margin: '26px 0',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: c.border,
          fontWeight: 700,
          marginBottom: 6,
        }}
      >
        {title ?? c.label}
      </div>
      {children}
    </aside>
  )
}

// Highlighted "Key takeaways" card. Wrap a markdown list inside it.
export function KeyTakeaways({
  title = 'Key takeaways',
  children,
}: {
  title?: string
  children?: ReactNode
}) {
  return (
    <aside
      className="key-takeaways"
      style={{
        background: 'rgba(11,59,46,0.04)',
        border: '1px solid rgba(11,59,46,0.12)',
        borderRadius: 12,
        padding: '18px 20px',
        margin: '26px 0',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.62rem',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: GOLD,
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {title}
      </div>
      {children}
    </aside>
  )
}

// Row of big-number stat cards. <StatGrid><Stat value="24,085" label="Nifty 50" trend="up" /></StatGrid>
export function StatGrid({ children }: { children?: ReactNode }) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12,
        margin: '26px 0',
      }}
    >
      {children}
    </div>
  )
}

export function Stat({
  value,
  label,
  trend,
}: {
  value: string
  label: string
  trend?: 'up' | 'down' | 'flat'
}) {
  const color = trend === 'up' ? UP : trend === 'down' ? DOWN : GREEN
  const arrow = trend === 'up' ? '▲ ' : trend === 'down' ? '▼ ' : ''
  return (
    <div
      style={{
        border: '1px solid rgba(11,59,46,0.12)',
        borderRadius: 10,
        padding: '14px 16px',
        background: '#fff',
      }}
    >
      <div style={{ fontSize: '1.5rem', fontWeight: 800, color, letterSpacing: '-0.02em' }}>
        {arrow}
        {value}
      </div>
      <div
        style={{
          fontFamily: 'var(--mono)',
          fontSize: '0.58rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'rgba(11,59,46,0.55)',
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  )
}

// Data-driven horizontal bar chart (pure CSS, responsive, crawlable).
// <BarChart title="..." unit="$bn" data={[{label:'Amazon',value:200}]} caption="Source: ..." />
export function BarChart({
  title,
  unit = '',
  data = [],
  caption,
}: {
  title?: string
  unit?: string
  data?: { label: string; value: number; color?: string }[]
  caption?: string
}) {
  const max = Math.max(...data.map((d) => Math.abs(Number(d.value))), 1)
  return (
    <figure
      style={{
        margin: '28px 0',
        border: '1px solid rgba(11,59,46,0.12)',
        borderRadius: 12,
        padding: '18px 18px 10px',
        background: '#fff',
      }}
    >
      {title && (
        <figcaption style={{ fontWeight: 700, color: GREEN, marginBottom: 16, fontSize: '0.95rem' }}>
          {title}
        </figcaption>
      )}
      <div>
        {data.map((d, i) => {
          const pct = Math.round((Math.abs(Number(d.value)) / max) * 100)
          return (
            <div key={i} style={{ marginBottom: 13 }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '0.8rem',
                  marginBottom: 5,
                  color: GREEN,
                }}
              >
                <span>{d.label}</span>
                <span style={{ fontWeight: 700 }}>
                  {unit}
                  {d.value}
                </span>
              </div>
              <div
                style={{
                  height: 10,
                  background: 'rgba(11,59,46,0.08)',
                  borderRadius: 6,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${pct}%`,
                    height: '100%',
                    background: d.color ?? GREEN,
                    borderRadius: 6,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      {caption && (
        <figcaption style={{ fontSize: '0.7rem', color: 'rgba(11,59,46,0.5)', marginTop: 6 }}>
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// Large pull quote for a standout line.
export function Pullquote({ children, cite }: { children?: ReactNode; cite?: string }) {
  return (
    <figure style={{ margin: '28px 0', borderLeft: `3px solid ${GOLD}`, paddingLeft: 18 }}>
      <blockquote
        style={{
          fontSize: '1.15rem',
          fontWeight: 600,
          color: GREEN,
          lineHeight: 1.5,
          fontStyle: 'italic',
          margin: 0,
        }}
      >
        {children}
      </blockquote>
      {cite && (
        <figcaption style={{ fontSize: '0.78rem', color: 'rgba(11,59,46,0.55)', marginTop: 8 }}>
          {cite}
        </figcaption>
      )}
    </figure>
  )
}

// Wraps every markdown table so it scrolls horizontally inside its own
// container on narrow screens instead of the table itself overflowing the
// page — a bare `overflow-x: auto` on a wide comparison table with no visual
// cue reads as clipped data, not "scroll for more" (RULES.md tables are
// exactly this: real multi-column comparisons that don't fit at 375px).
function TableWrap({ children }: { children?: ReactNode }) {
  return <div className="table-wrap">{children}</div>
}

export const mdxComponents = {
  Callout,
  KeyTakeaways,
  StatGrid,
  Stat,
  BarChart,
  Pullquote,
  table: TableWrap,
}
