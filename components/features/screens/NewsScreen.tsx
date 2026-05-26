const NEWS = [
  {
    headline: 'RBI holds repo rate at 6.5% — third consecutive pause',
    time: '2m ago',
    tags: ['BANK', 'HDFCBANK', 'KOTAKBANK'],
    sentiment: 'neutral',
    move: '±',
  },
  {
    headline: 'Infosys raises FY25 revenue guidance to 4.5–5% in USD terms',
    time: '18m ago',
    tags: ['IT', 'INFY', 'TCS'],
    sentiment: 'up',
    move: '+2.4%',
  },
  {
    headline: 'Crude at $82 — Asia buying ahead of OPEC+ decision',
    time: '34m ago',
    tags: ['ENERGY', 'ONGC', 'RELIANCE'],
    sentiment: 'mixed',
    move: '+0.8%',
  },
  {
    headline: 'Adani Total Gas Q2 profit down 18% on margin pressure',
    time: '52m ago',
    tags: ['ENERGY', 'ADANIGAS'],
    sentiment: 'down',
    move: '-3.1%',
  },
];

const sentimentColor = (s: string) =>
  s === 'up' ? '#22C55E' : s === 'down' ? '#EF4444' : '#808080';

export default function NewsScreen() {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 8 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 4 }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#EDEDED', letterSpacing: '0.06em' }}>NEWS & IMPACT</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#22C55E' }} />
          <span style={{ fontSize: '0.42rem', color: '#22C55E', fontFamily: 'var(--mono)' }}>LIVE</span>
        </div>
      </div>

      {/* News items */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 0 }}>
        {NEWS.map((n, i) => (
          <div key={i} style={{
            padding: '9px 0',
            borderTop: i > 0 ? '1px solid #141414' : 'none',
          }}>
            {/* Headline */}
            <div style={{
              fontSize: '0.52rem', color: '#D0D0D0', lineHeight: 1.4, marginBottom: 5,
              fontWeight: 500,
            }}>
              {n.headline}
            </div>
            {/* Tags row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
              {n.tags.map(tag => (
                <span key={tag} style={{
                  fontSize: '0.36rem', fontFamily: 'var(--mono)',
                  color: '#606060', background: '#111',
                  padding: '1px 5px', borderRadius: 3,
                  border: '1px solid #1F1F1F',
                }}>{tag}</span>
              ))}
              <span style={{ marginLeft: 'auto', fontSize: '0.36rem', color: '#505050', fontFamily: 'var(--mono)' }}>
                {n.time}
              </span>
              <span style={{
                fontSize: '0.38rem', fontFamily: 'var(--mono)', fontWeight: 700,
                color: sentimentColor(n.sentiment),
              }}>{n.move}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingBottom: 6 }} />
    </div>
  );
}
