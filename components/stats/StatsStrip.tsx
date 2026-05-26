const STATS = [
  { value: '32',    label: 'Sectors\ntracked',     unit: '' },
  { value: '5,000+', label: 'Stocks\ntracked daily',   unit: '' },
  { value: '100%',  label: 'Indian\nmarkets',        unit: '' },
  { value: '0',     label: 'Ads.\nEver.',            unit: '' },
];

export default function StatsStrip() {
  return (
    <section className="section-dark stats-section">
      <div className="container">
        {/* Kicker */}
        <div style={{
          fontFamily: 'var(--mono)', fontSize: '0.6rem',
          letterSpacing: '0.22em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.28)', marginBottom: 56,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ display: 'inline-block', width: 24, height: 1, background: 'rgba(255,255,255,0.18)' }} />
          By the numbers
        </div>

        <div className="stats-grid">
          {STATS.map((s, i) => (
            <div key={s.label} className="stat-cell">
              {/* Divider between cells */}
              {i > 0 && <div className="stat-divider" />}
              <div className="stat-num-val">{s.value}</div>
              <div style={{
                fontFamily: 'var(--mono)', fontSize: '0.62rem',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.36)',
                marginTop: 10, lineHeight: 1.6, whiteSpace: 'pre-line',
              }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats-section {
          padding: 88px 0 96px;
          border-top: 1px solid rgba(255,255,255,0.06);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          position: relative;
        }
        .stat-cell {
          position: relative;
          padding: 0 40px 0 0;
        }
        .stat-divider {
          position: absolute;
          left: -1px;
          top: 0;
          bottom: 0;
          width: 1px;
          background: rgba(255,255,255,0.07);
          margin-left: 0;
          padding: 0;
        }
        .stat-cell:not(:first-child) { padding-left: 40px; }
        .stat-num-val {
          font-family: var(--sans);
          font-weight: 800;
          font-size: clamp(3.8rem, 8vw, 7rem);
          letter-spacing: -0.04em;
          line-height: 1;
          color: #ffffff;
        }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 48px 0; }
          .stat-cell:not(:first-child) { padding-left: 0; }
          .stat-divider { display: none; }
          .stat-cell { border-top: 1px solid rgba(255,255,255,0.07); padding-top: 36px; padding-right: 0; }
          .stat-cell:nth-child(1),
          .stat-cell:nth-child(2) { border-top: none; padding-top: 0; }
          .stat-cell:nth-child(even) { padding-left: 32px; border-left: 1px solid rgba(255,255,255,0.07); }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: 1fr; gap: 0; }
          .stat-cell { border-top: 1px solid rgba(255,255,255,0.07) !important; padding: 28px 0 !important; }
          .stat-cell:first-child { border-top: none !important; padding-top: 0 !important; }
          .stat-num-val { font-size: clamp(3.2rem, 14vw, 5rem); }
        }
      `}</style>
    </section>
  );
}
