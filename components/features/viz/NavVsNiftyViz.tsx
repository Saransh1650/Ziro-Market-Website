const NAV   = [100, 102, 101, 105, 108, 112, 110, 116, 119, 124, 122, 128, 132, 130, 136, 142];
const NIFTY = [100, 101, 102, 103, 102, 104, 105, 106, 107, 108, 110, 111, 112, 114, 115, 118];

function toPath(values: number[], w: number, h: number) {
  const min = Math.min(...values, ...NIFTY);
  const max = Math.max(...values, ...NIFTY);
  const sx = w / (values.length - 1);
  const sy = (v: number) => h - ((v - min) / (max - min)) * h;
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * sx} ${sy(v)}`).join(' ');
}

export default function NavVsNiftyViz() {
  const W = 420, H = 220;
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span className="caption">PORTFOLIO NAV vs NIFTY 50</span>
        <span className="up mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>+18.4%</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" preserveAspectRatio="none" aria-label="NAV vs NIFTY chart">
        <path d={toPath(NIFTY, W, H)} fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={toPath(NAV,   W, H)} fill="none" stroke="var(--amber)" strokeWidth="2.5" />
      </svg>
      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        <Legend swatch="var(--amber)" label="Your NAV" />
        <Legend swatch="var(--text-3)" label="NIFTY 50" dashed />
      </div>
    </div>
  );
}

function Legend({ swatch, label, dashed }: { swatch: string; label: string; dashed?: boolean }) {
  return (
    <span className="caption" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <span style={{ display: 'inline-block', width: 18, height: 2, background: dashed ? 'transparent' : swatch, borderTop: dashed ? `2px dashed ${swatch}` : 'none' }} />
      {label}
    </span>
  );
}
