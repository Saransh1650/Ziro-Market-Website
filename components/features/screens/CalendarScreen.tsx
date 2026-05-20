const EVENTS = [
  { day: 'MON 19', label: 'INFY Q4 Results',  kind: 'earn',  sub: 'Earnings season' },
  { day: 'MON 19', label: 'RELIANCE AGM',      kind: 'macro', sub: 'Shareholder meet' },
  { day: 'TUE 20', label: 'TCS Ex-Dividend',   kind: 'div',   sub: '₹28 per share' },
  { day: 'WED 21', label: 'RBI MPC Decision',  kind: 'macro', sub: 'Rate policy' },
  { day: 'THU 22', label: 'HDFC Q4 Results',   kind: 'earn',  sub: 'Earnings season' },
  { day: 'FRI 23', label: 'CPI Data Release',  kind: 'macro', sub: 'Inflation print' },
  { day: 'FRI 23', label: 'WIPRO Q4 Results',  kind: 'earn',  sub: 'Earnings season' },
];

const KIND: Record<string, { bg: string; dot: string; label: string }> = {
  earn:  { bg: 'rgba(245,158,11,0.12)', dot: 'var(--amber)', label: 'Earnings' },
  div:   { bg: 'rgba(34,197,94,0.12)',  dot: '#22C55E',      label: 'Dividend' },
  macro: { bg: 'rgba(192,192,192,0.06)', dot: '#808080',     label: 'Macro' },
};

export default function CalendarScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 6 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>THIS WEEK</span>
        <span style={{ fontSize: '0.42rem', color: '#808080', fontFamily: 'var(--mono)' }}>19–23 MAY</span>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 8 }}>
        {Object.values(KIND).map(k => (
          <span key={k.label} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.38rem', color: '#808080', fontFamily: 'var(--mono)' }}>
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: k.dot, display: 'inline-block' }} />
            {k.label}
          </span>
        ))}
      </div>

      {/* Event list */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5 }}>
        {EVENTS.map((e, i) => {
          const style = KIND[e.kind];
          return (
            <div key={i} style={{
              display: 'flex', gap: 7, alignItems: 'flex-start',
              background: style.bg, borderRadius: 7, padding: '7px 8px',
              borderLeft: `2px solid ${style.dot}`,
            }}>
              <div style={{ flex: '0 0 32px' }}>
                <div style={{ fontSize: '0.36rem', color: '#808080', fontFamily: 'var(--mono)', lineHeight: 1.3 }}>{e.day.split(' ')[0]}</div>
                <div style={{ fontSize: '0.48rem', fontWeight: 800, color: '#808080', fontFamily: 'var(--mono)' }}>{e.day.split(' ')[1]}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.52rem', fontWeight: 700, color: '#EDEDED' }}>{e.label}</div>
                <div style={{ fontSize: '0.4rem', color: '#808080', marginTop: 2 }}>{e.sub}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
