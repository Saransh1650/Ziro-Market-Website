const DATA_POINTS = [
  { label: 'NSE & BSE', desc: 'Both exchanges, live' },
  { label: 'MCX Futures', desc: 'Gold, Silver, Crude Oil & more' },
  { label: '32 Sectors', desc: 'Every Indian sector tracked' },
  { label: 'Mutual Funds', desc: 'MF holdings & overlap analysis' },
  { label: '₹ Rupee', desc: 'Not USD. Always.' },
  { label: 'IST Timezone', desc: 'Indian Standard Time only' },
];

const INDICES = ['Nifty 50', 'Bank Nifty', 'Nifty IT', 'Midcap 150', 'Smallcap 250'];

export default function BuiltForIndia() {
  return (
    <section className="section crosshair">
      <div className="container">
        <span className="section-num">№ Built for India</span>

        <div className="bfi-outer">
          {/* Left: copy */}
          <div>
            <h2 style={{ marginTop: 20 }}>
              Built in India.<br />
              <em style={{ color: 'var(--amber)' }}>For Indian markets.</em>
            </h2>
            <p style={{ marginTop: 18, maxWidth: 440, lineHeight: 1.7 }}>
              NSE and BSE data. 32 sectors. Nifty 50, Bank Nifty, IT, Midcap, Smallcap.
              MCX commodities. Mutual funds. Calibrated for how Indian markets actually work.
            </p>
            <p style={{ marginTop: 12, maxWidth: 440, lineHeight: 1.7 }}>
              Rupee formatting. IST timezone. Lakh and crore conventions.
              Tax rules that match what you actually file.
            </p>
            {/* Index pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 24 }}>
              {INDICES.map(idx => (
                <span key={idx} style={{
                  fontFamily: 'var(--mono)', fontSize: '0.64rem', fontWeight: 600,
                  letterSpacing: '0.06em',
                  color: 'var(--text-2)',
                  border: '1px solid var(--border-2)',
                  padding: '5px 12px', borderRadius: 4,
                  background: 'var(--bg-2)',
                }}>{idx}</span>
              ))}
            </div>
          </div>

          {/* Right: data point grid */}
          <div className="bfi-grid">
            {DATA_POINTS.map((p) => (
              <div key={p.label} style={{
                padding: '16px 18px',
                border: '1px solid var(--border-1)',
                borderRadius: 6,
                background: 'var(--bg-2)',
              }}>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: '0.66rem',
                  fontWeight: 700, letterSpacing: '0.08em',
                  color: 'var(--text-1)', textTransform: 'uppercase',
                }}>{p.label}</div>
                <div style={{ marginTop: 5, fontSize: '0.82rem', color: 'var(--text-3)', lineHeight: 1.4 }}>
                  {p.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>{`
          .bfi-outer { display: grid; grid-template-columns: 1fr 1fr; gap: 56px 80px; margin-top: 24px; align-items: start; }
          .bfi-grid  { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          @media (max-width: 900px) {
            .bfi-outer { grid-template-columns: 1fr; gap: 40px; }
          }
        `}</style>
      </div>
    </section>
  );
}
