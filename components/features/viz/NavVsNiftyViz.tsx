const NAV   = [100, 102, 101, 105, 108, 112, 110, 116, 119, 124, 122, 128, 132, 130, 136, 142];
const NIFTY = [100, 101, 102, 103, 102, 104, 105, 106, 107, 108, 110, 111, 112, 114, 115, 118];

const NAV_GAIN_PCT = ((NAV[NAV.length - 1] - NAV[0]) / NAV[0]) * 100;
const NIFTY_GAIN_PCT = ((NIFTY[NIFTY.length - 1] - NIFTY[0]) / NIFTY[0]) * 100;
const ALPHA_PCT = NAV_GAIN_PCT - NIFTY_GAIN_PCT;

const Y_MIN = Math.min(...NAV, ...NIFTY);
const Y_MAX = Math.max(...NAV, ...NIFTY);

function toPath(values: number[], w: number, h: number, yMin: number, yMax: number): string {
  const sx = w / (values.length - 1);
  const sy = (v: number) => h - ((v - yMin) / (yMax - yMin)) * h;
  return values.map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * sx} ${sy(v)}`).join(' ');
}

export default function NavVsNiftyViz() {
  const W = 420, H = 220;
  return (
    <div style={{ background: 'var(--bg-1)', border: '1px solid var(--border-1)', borderRadius: 8, padding: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 14 }}>
        <span className="caption">PORTFOLIO NAV vs NIFTY 50</span>
        <span className="up mono" style={{ fontSize: '0.85rem', fontWeight: 700 }}>
          +{NAV_GAIN_PCT.toFixed(1)}% · +{ALPHA_PCT.toFixed(1)}% alpha
        </span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="auto" preserveAspectRatio="none" aria-label={`NAV vs NIFTY chart, NAV up ${NAV_GAIN_PCT.toFixed(1)} percent versus NIFTY ${NIFTY_GAIN_PCT.toFixed(1)} percent`}>
        <path d={toPath(NIFTY, W, H, Y_MIN, Y_MAX)} fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="4 3" />
        <path d={toPath(NAV,   W, H, Y_MIN, Y_MAX)} fill="none" stroke="var(--amber)" strokeWidth="2.5" />
      </svg>
      <div style={{ display: 'flex', gap: 18, marginTop: 14 }}>
        <Legend swatch="var(--amber)" label={`Your NAV +${NAV_GAIN_PCT.toFixed(0)}%`} />
        <Legend swatch="var(--text-3)" label={`NIFTY 50 +${NIFTY_GAIN_PCT.toFixed(0)}%`} dashed />
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
