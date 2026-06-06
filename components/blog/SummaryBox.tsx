'use client'
import { useState } from 'react'

export default function SummaryBox({ summary }: { summary: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'rgba(11,59,46,0.05)',
          borderRadius: 8,
          margin: '28px 0',
          border: '1px solid rgba(11,59,46,0.10)',
        }}
      >
        <span style={{ fontSize: '0.82rem', color: 'var(--text-2)', fontWeight: 500 }}>
          <strong style={{ color: 'var(--text-1)' }}>Explain like I'm 5</strong>: the simplest possible explanation, no finance knowledge needed
        </span>
        <label style={{ position: 'relative', width: 42, height: 24, cursor: 'pointer', flexShrink: 0 }}>
          <input
            type="checkbox"
            checked={open}
            onChange={(e) => setOpen(e.target.checked)}
            style={{ opacity: 0, width: 0, height: 0 }}
            aria-label="Toggle simple explanation"
          />
          <span
            style={{
              position: 'absolute',
              inset: 0,
              background: open ? '#9b6810' : 'rgba(11,59,46,0.10)',
              borderRadius: 12,
              border: '1px solid rgba(11,59,46,0.20)',
              transition: 'background 0.2s',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 3,
              left: open ? 21 : 3,
              width: 16,
              height: 16,
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            }}
          />
        </label>
      </div>

      {open && (
        <div
          style={{
            background: 'rgba(155,104,16,0.06)',
            border: '1px solid rgba(155,104,16,0.25)',
            borderRadius: 10,
            padding: '22px 24px',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              fontFamily: 'var(--mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: '#9b6810',
              fontWeight: 600,
              marginBottom: 10,
            }}
          >
            Explain like I'm 5
          </div>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-1)', margin: 0 }}>
            {summary}
          </p>
        </div>
      )}
    </div>
  )
}
