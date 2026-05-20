const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const EVENTS: { day: number; label: string; kind: 'earn' | 'div' | 'macro' }[] = [
  { day: 0, label: 'INFY Q4',     kind: 'earn' },
  { day: 0, label: 'RELIANCE AGM', kind: 'macro' },
  { day: 1, label: 'TCS ex-div',  kind: 'div'  },
  { day: 2, label: 'RBI MPC',     kind: 'macro' },
  { day: 3, label: 'HDFC Q4',     kind: 'earn' },
  { day: 4, label: 'CPI release', kind: 'macro' },
  { day: 4, label: 'WIPRO Q4',    kind: 'earn' },
];

const KIND_STYLE: Record<string, { bg: string; color: string }> = {
  earn:  { bg: 'rgba(245, 158, 11, 0.15)', color: 'var(--amber)' },
  div:   { bg: 'rgba(34, 197, 94, 0.15)',  color: 'var(--positive)' },
  macro: { bg: 'rgba(192, 192, 192, 0.10)',color: 'var(--text-2)' },
};

export default function EventsGrid() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden' }}>
      <div className="caption" style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-1)' }}>
        WEEK OF 18–22 MAY · IST
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {DAYS.map((d, i) => (
          <div key={d} style={{ borderRight: i < 4 ? '1px solid var(--border-1)' : 'none', minHeight: 180, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="caption">{d}</span>
            {EVENTS.filter((e) => e.day === i).map((e, j) => (
              <span key={j} style={{
                fontSize: '0.72rem', fontWeight: 700, padding: '6px 8px', borderRadius: 4,
                background: KIND_STYLE[e.kind].bg, color: KIND_STYLE[e.kind].color,
              }}>{e.label}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
