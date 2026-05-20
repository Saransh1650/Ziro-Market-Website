const NAV   = [100, 102, 101, 105, 108, 112, 110, 116, 119, 124, 122, 128, 132, 130, 136, 142];
const NIFTY = [100, 101, 102, 103, 102, 104, 105, 106, 107, 108, 110, 111, 112, 114, 115, 118];

const NAV_PCT = ((NAV[NAV.length - 1] - NAV[0]) / NAV[0]) * 100;
const NIFTY_PCT = ((NIFTY[NIFTY.length - 1] - NIFTY[0]) / NIFTY[0]) * 100;

const Y_MIN = Math.min(...NAV, ...NIFTY);
const Y_MAX = Math.max(...NAV, ...NIFTY);
const W = 240, H = 80;

function toPath(vals: number[]) {
  const sx = W / (vals.length - 1);
  const sy = (v: number) => H - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * H;
  return vals.map((v, i) => `${i === 0 ? 'M' : 'L'}${i * sx} ${sy(v)}`).join(' ');
}

export default function PortfolioScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ paddingTop: 4 }}>
        <div style={{ fontSize: '0.42rem', color: '#808080', fontFamily: 'var(--mono)' }}>PORTFOLIO VALUE</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.04em', color: '#EDEDED', lineHeight: 1.1, marginTop: 2 }}>₹4,28,350</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginTop: 4 }}>
          <span style={{ fontSize: '0.52rem', color: '#22C55E', fontWeight: 700, fontFamily: 'var(--mono)' }}>+₹6,240</span>
          <span style={{ fontSize: '0.45rem', color: '#22C55E', background: 'rgba(34,197,94,0.1)', padding: '1px 5px', borderRadius: 3, fontFamily: 'var(--mono)' }}>+1.48% today</span>
        </div>
      </div>

      {/* NAV vs Nifty chart */}
      <div style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: 8, padding: '8px 8px 6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.4rem', color: '#808080', fontFamily: 'var(--mono)' }}>NAV vs NIFTY · 1Y</span>
          <span style={{ fontSize: '0.45rem', color: '#22C55E', fontFamily: 'var(--mono)', fontWeight: 700 }}>+{NAV_PCT.toFixed(0)}% vs +{NIFTY_PCT.toFixed(0)}%</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" preserveAspectRatio="none">
          <path d={toPath(NIFTY)} fill="none" stroke="#3A3A3A" strokeWidth="1.5" strokeDasharray="4 3" />
          <path d={toPath(NAV)} fill="none" stroke="var(--amber)" strokeWidth="2" />
        </svg>
        <div style={{ display: 'flex', gap: 10, marginTop: 5 }}>
          {[{ color: 'var(--amber)', label: `Your NAV +${NAV_PCT.toFixed(0)}%` }, { color: '#808080', label: `NIFTY +${NIFTY_PCT.toFixed(0)}%`, dash: true }].map(l => (
            <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.4rem', color: '#808080', fontFamily: 'var(--mono)' }}>
              <span style={{ width: 14, height: 0, borderTop: l.dash ? `1.5px dashed ${l.color}` : `1.5px solid ${l.color}`, display: 'inline-block' }} />
              {l.label}
            </span>
          ))}
        </div>
      </div>

      {/* P&L breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, flex: 1 }}>
        {[
          { label: 'Invested', value: '₹3,22,000', color: '#EDEDED' },
          { label: 'Current', value: '₹4,28,350', color: 'var(--amber)' },
          { label: 'Realised P&L', value: '+₹18,420', color: '#22C55E' },
          { label: 'Unrealised', value: '+₹87,930', color: '#22C55E' },
        ].map(t => (
          <div key={t.label} style={{ background: '#111', border: '1px solid #1F1F1F', borderRadius: 7, padding: '8px 8px' }}>
            <div style={{ fontSize: '0.4rem', color: '#808080', fontFamily: 'var(--mono)', marginBottom: 3 }}>{t.label}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: t.color, lineHeight: 1 }}>{t.value}</div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
