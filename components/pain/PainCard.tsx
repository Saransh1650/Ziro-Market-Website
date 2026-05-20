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
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="kicker">{pain.app}</span>
          <span className="caption" style={{ color: pain.ratingColor, border: `1px solid ${pain.ratingColor}`, padding: '3px 8px', borderRadius: 3 }}>
            {pain.ratingLabel}
          </span>
        </div>
        <h2 style={{ marginTop: 18 }}>
          {pain.headlineTop}<br />
          <span style={{ color: 'var(--gold)' }}>{pain.headlineHighlight}</span>
        </h2>
        <div style={{ marginTop: 22, display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <span style={{ fontSize: '3.4rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--gold)' }}>
            {pain.stat.value}
          </span>
          <span className="caption">{pain.stat.unit}</span>
        </div>
        <ul style={{ marginTop: 24, listStyle: 'none', padding: 0 }}>
          {pain.bullets.map((b, i) => (
            <li key={i} style={{ padding: '10px 0', borderTop: '1px solid var(--border-1)', color: 'var(--text-2)', fontSize: '0.95rem' }}>
              <span className="caption" style={{ marginRight: 12 }}>0{i + 1}</span>{b}
            </li>
          ))}
        </ul>
      </div>
      <FauxBrowser kind={pain.fauxFrame} />
      <style>{`
        .pain-card-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; padding: 40px 0; }
        @media (max-width: 900px) { .pain-card-grid { grid-template-columns: 1fr; gap: 32px; } }
      `}</style>
    </div>
  );
}

function FauxBrowser({ kind }: { kind: 'nse' | 'mc' | 'gfin' }) {
  return (
    <div style={{
      background: 'var(--bg-2)', border: '1px solid var(--border-1)', borderRadius: 8, overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px', borderBottom: '1px solid var(--border-1)', background: 'var(--bg-1)' }}>
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-4)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-4)' }} />
        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--text-4)' }} />
        <span className="caption" style={{ marginLeft: 12 }}>
          {kind === 'nse' && 'nseindia.com / market-data'}
          {kind === 'mc'  && 'moneycontrol.com'}
          {kind === 'gfin'&& 'google.com/finance'}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        {kind === 'nse' && <NseMock />}
        {kind === 'mc'  && <McMock />}
        {kind === 'gfin'&& <GfinMock />}
      </div>
    </div>
  );
}

function Skeleton({ w = '100%', h = 12 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, background: 'var(--border-1)', borderRadius: 2 }} />;
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
      <div aria-hidden style={{ marginTop: 20, color: 'var(--text-3)', fontFamily: 'var(--mono)', fontSize: '0.65rem' }}>
        ⌛ loading market-data… (5.2s)
      </div>
    </div>
  );
}

function McMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Skeleton w="50%" h={14} />
      <div style={{ background: 'var(--bg-3)', border: '1px dashed var(--border-2)', padding: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>AD · 728×90</div>
      <Skeleton w="80%" h={10} />
      <div style={{ background: 'var(--bg-3)', border: '1px dashed var(--border-2)', padding: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>AD · autoplay video</div>
      <Skeleton w="60%" h={10} />
      <div style={{ background: 'var(--bg-3)', border: '1px dashed var(--border-2)', padding: 10, textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>AD · sticky bottom</div>
    </div>
  );
}

function GfinMock() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
        S&amp;P 500 &nbsp;<span className="up">▲ 5,431.20</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
        DOW JONES &nbsp;<span className="up">▲ 39,210.10</span>
      </div>
      <div style={{ fontFamily: 'var(--mono)', fontSize: '0.78rem' }}>
        NASDAQ &nbsp;<span className="down">▼ 17,832.40</span>
      </div>
      <div style={{ marginTop: 12, fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text-3)' }}>
        Currency: USD · Indian markets: 3 clicks deep
      </div>
    </div>
  );
}
