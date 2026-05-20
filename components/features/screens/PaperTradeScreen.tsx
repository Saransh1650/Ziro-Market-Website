export default function PaperTradeScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>PAPER TRADE</span>
          <span style={{ fontSize: '0.42rem', fontFamily: 'var(--mono)', color: 'var(--amber)', background: 'rgba(245,158,11,0.12)', padding: '2px 6px', borderRadius: 3, border: '1px solid rgba(245,158,11,0.2)' }}>PAPER</span>
        </div>
        <div style={{ fontSize: '0.42rem', color: '#808080', fontFamily: 'var(--mono)', marginTop: 3 }}>NIFTY 50 · 25 MAY · 22800 CE</div>
      </div>

      {/* P&L callout */}
      <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
        <div style={{ fontSize: '0.42rem', color: '#22C55E', fontFamily: 'var(--mono)', marginBottom: 3 }}>TOTAL P&L</div>
        <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#22C55E', letterSpacing: '-0.03em', lineHeight: 1 }}>+₹4,820</div>
        <div style={{ fontSize: '0.5rem', fontWeight: 700, color: '#22C55E', fontFamily: 'var(--mono)', marginTop: 3 }}>+33.9%</div>
      </div>

      {/* Trade details grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
        {[
          { label: 'Entry Price', value: '₹142.30', color: '#EDEDED' },
          { label: 'LTP',         value: '₹190.50', color: 'var(--amber)' },
          { label: 'Qty',         value: '100 lots', color: '#EDEDED' },
          { label: 'Greeks',      value: 'Δ 0.62 θ -4.2', color: '#808080', small: true },
        ].map(t => (
          <div key={t.label} style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: 7, padding: '9px 9px' }}>
            <div style={{ fontSize: '0.38rem', color: '#808080', fontFamily: 'var(--mono)', marginBottom: 3 }}>{t.label}</div>
            <div style={{ fontSize: t.small ? '0.5rem' : '0.78rem', fontWeight: 800, color: t.color, lineHeight: 1 }}>{t.value}</div>
          </div>
        ))}
      </div>

      {/* Reset badge */}
      <div style={{ background: '#111', border: '1px dashed #2A2A2A', borderRadius: 7, padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.42rem', color: '#505050', fontFamily: 'var(--mono)' }}>No real money at risk</span>
        <span style={{ fontSize: '0.38rem', color: '#505050', fontFamily: 'var(--mono)', background: '#1A1A1A', padding: '2px 5px', borderRadius: 3 }}>RESETS WEEKLY</span>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 7, padding: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, color: '#EF4444', fontFamily: 'var(--mono)' }}>CLOSE</span>
        </div>
        <div style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 7, padding: '8px', textAlign: 'center' }}>
          <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--amber)', fontFamily: 'var(--mono)' }}>ADD LEG</span>
        </div>
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
