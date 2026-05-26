export interface Pain {
  app: string;
  ratingLabel: string;
  ratingColor: string;
  headlineTop: string;
  headlineHighlight: string;
  stat: { value: string; unit: string };
  bullets: string[];
  fauxFrame: 'nse' | 'mc' | 'gfin';
}

export default function PainCard({ pain }: { pain: Pain }) {
  return (
    <div className="pain-card-grid">
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 36 }}>
          <span className="kicker" style={{ color: 'var(--text-3)' }}>{pain.app}</span>
          <span style={{
            fontFamily: 'var(--mono)', fontSize: '0.6rem', letterSpacing: '0.12em',
            textTransform: 'uppercase', color: pain.ratingColor,
            border: `1px solid ${pain.ratingColor}`,
            padding: '3px 8px', borderRadius: 3, opacity: 0.9,
          }}>
            {pain.ratingLabel}
          </span>
        </div>
        <h2 style={{ marginTop: 16, color: 'var(--text-1)' }}>
          {pain.headlineTop}<br />
          <em style={{ color: 'var(--amber)' }}>{pain.headlineHighlight}</em>
        </h2>
        <div style={{ marginTop: 24, display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <span style={{
            fontFamily: 'var(--serif)', fontSize: '3.2rem', fontWeight: 400,
            fontStyle: 'italic', color: 'var(--amber)', lineHeight: 1,
          }}>
            {pain.stat.value}
          </span>
          <span className="caption">{pain.stat.unit}</span>
        </div>
        <ul style={{ marginTop: 24, listStyle: 'none', padding: 0 }}>
          {pain.bullets.map((b, i) => (
            <li key={i} style={{
              padding: '11px 0',
              borderTop: '1px solid var(--border-1)',
              color: 'var(--text-2)', fontSize: '0.92rem',
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span className="caption" style={{ flexShrink: 0, paddingTop: 2, opacity: 0.5 }}>0{i + 1}</span>
              {b}
            </li>
          ))}
        </ul>
      </div>
      <FauxBrowser kind={pain.fauxFrame} />
      <style>{`
        .pain-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding-top: 8px; }
        @media (max-width: 900px) { .pain-card-grid { grid-template-columns: 1fr; gap: 32px; } }
      `}</style>
    </div>
  );
}

function FauxBrowser({ kind }: { kind: 'nse' | 'mc' | 'gfin' }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.09)',
      borderRadius: 8, overflow: 'hidden', alignSelf: 'start', marginTop: 36,
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
        <span className="caption" style={{ marginLeft: 10 }}>
          {kind === 'nse'  && 'nseindia.com / market-data'}
          {kind === 'mc'   && 'moneycontrol.com'}
          {kind === 'gfin' && 'google.com/finance'}
        </span>
      </div>
      <div style={{ padding: 18 }}>
        {kind === 'nse'  && <NseMock />}
        {kind === 'mc'   && <McMock />}
        {kind === 'gfin' && <GfinMock />}
      </div>
    </div>
  );
}

function Skeleton({ w = '100%', h = 12 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, background: 'rgba(255,255,255,0.08)', borderRadius: 2 }} />;
}

function NseMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton w="40%" h={14} />
      <Skeleton w="70%" h={10} />
      <Skeleton w="55%" h={10} />
      <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} h={18} />)}
      </div>
      <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.28)', fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>
        ⌛ loading market-data… (5.2s)
      </div>
    </div>
  );
}

function McMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton w="50%" h={14} />
      <div style={{
        border: '1px dashed rgba(255,255,255,0.15)',
        padding: 10, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.28)',
      }}>AD · 728×90</div>
      <Skeleton w="80%" h={10} />
      <div style={{
        border: '1px dashed rgba(255,255,255,0.15)',
        padding: 10, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.28)',
      }}>AD · autoplay video</div>
      <Skeleton w="60%" h={10} />
      <div style={{
        border: '1px dashed rgba(255,255,255,0.15)',
        padding: 10, textAlign: 'center',
        fontFamily: 'var(--mono)', fontSize: '0.65rem',
        color: 'rgba(255,255,255,0.28)',
      }}>AD · sticky bottom</div>
    </div>
  );
}

function GfinMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>
        S&amp;P 500 &nbsp;<span style={{ color: '#22C55E' }}>▲ 5,431.20</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>
        DOW JONES &nbsp;<span style={{ color: '#22C55E' }}>▲ 39,210.10</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem', color: 'rgba(255,255,255,0.72)' }}>
        NASDAQ &nbsp;<span style={{ color: '#EF4444' }}>▼ 17,832.40</span>
      </div>
      <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'rgba(255,255,255,0.28)' }}>
        Currency: USD · Indian markets: 3 clicks deep
      </div>
    </div>
  );
}
