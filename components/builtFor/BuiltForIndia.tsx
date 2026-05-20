const WORDMARKS = ['NSE', 'BSE', 'MCX', 'SEBI registered (DP)', 'Upstox data', 'RBI rates'];

export default function BuiltForIndia() {
  return (
    <section className="section">
      <div className="container">
        <span className="section-num">№ 13 / BUILT FOR INDIA</span>
        <h2 style={{ marginTop: 18, maxWidth: 760 }}>
          Built in India. <span className="amber">For Indian markets.</span>
        </h2>
        <p style={{ marginTop: 14, maxWidth: 540 }}>
          Rupee formatting. IST timezone. Lakh and crore conventions. Tax rules that match what you actually file.
        </p>
        <div className="bfi-strip">
          {WORDMARKS.map((w) => (
            <span key={w} className="mono" style={{ color: 'var(--text-3)', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.06em' }}>
              {w}
            </span>
          ))}
        </div>
        <style>{`
          .bfi-strip {
            margin-top: 40px;
            padding: 32px 24px;
            background: var(--bg-1);
            border: 1px solid var(--border-1);
            border-radius: 8px;
            display: grid;
            grid-template-columns: repeat(${WORDMARKS.length}, 1fr);
            gap: 24px;
            align-items: center;
            text-align: center;
          }
          @media (max-width: 768px) {
            .bfi-strip { grid-template-columns: repeat(2, 1fr); gap: 18px 24px; padding: 24px 16px; }
          }
        `}</style>
      </div>
    </section>
  );
}
