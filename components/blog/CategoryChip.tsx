import type { Category } from '@/lib/blog'

const STYLES: Record<Category, { bg: string; color: string; label: string }> = {
  terminology: {
    bg: 'rgba(26,107,60,0.12)',
    color: '#1a6b3c',
    label: 'Terminology',
  },
  event: {
    bg: 'rgba(155,104,16,0.10)',
    color: '#9b6810',
    label: 'Event',
  },
  concept: {
    bg: 'rgba(11,59,46,0.08)',
    color: 'rgba(11,59,46,0.60)',
    label: 'Concept',
  },
}

export default function CategoryChip({ category }: { category: Category }) {
  const { bg, color, label } = STYLES[category]
  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        fontSize: '0.55rem',
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        borderRadius: 4,
        fontWeight: 600,
        background: bg,
        color,
      }}
    >
      {label}
    </span>
  )
}
