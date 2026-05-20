export default function PaperTradeMock() {
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <span className="caption">PAPER · NIFTY 50 · 25 MAY · 22800 CE</span>
        <span className="up mono" style={{ fontSize: '0.78rem', fontWeight: 700 }}>+₹4,820</span>
      </div>
      <div style={{ marginTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <Tile label="Entry" value="₹142.30" />
        <Tile label="LTP"   value="₹190.50" highlight />
        <Tile label="Qty"   value="100" />
        <Tile label="P&L %" value="+33.9%" up />
      </div>
      <div style={{ marginTop: 18, padding: 12, border: '1px dashed var(--border-2)', borderRadius: 6, fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text-3)' }}>
        PAPER MODE · No real money · Reset weekly
      </div>
    </div>
  );
}

function Tile({ label, value, highlight, up }: { label: string; value: string; highlight?: boolean; up?: boolean }) {
  return (
    <div style={{ background: 'var(--bg-2)', padding: 14, borderRadius: 6, border: '1px solid var(--border-1)' }}>
      <div className="caption">{label}</div>
      <div className={up ? 'up' : undefined} style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4, color: highlight ? 'var(--amber)' : undefined }}>
        {value}
      </div>
    </div>
  );
}
