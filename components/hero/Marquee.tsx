import { STATIC_TICKERS } from '@/lib/marketData';

export default function Marquee() {
  const items = [...STATIC_TICKERS, ...STATIC_TICKERS];
  return (
    <div
      aria-hidden
      className="section-dark"
      style={{
        overflow: 'hidden',
        borderTop: '1px solid rgba(255,255,255,0.09)',
        position: 'relative',
        padding: '13px 0',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: 'linear-gradient(90deg, #0b3b2e, transparent)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 100, zIndex: 2,
        background: 'linear-gradient(-90deg, #0b3b2e, transparent)', pointerEvents: 'none',
      }} />
      <div className="mq-track">
        {items.map((t, i) => (
          <span key={i} className="mq-item">
            <span style={{ color: 'rgba(255,255,255,0.80)', fontWeight: 600 }}>{t.symbol}</span>
            <span style={{ color: t.changePct >= 0 ? '#22C55E' : '#EF4444' }}>
              {t.changePct >= 0 ? '▲' : '▼'} {Math.abs(t.changePct).toFixed(2)}%
            </span>
          </span>
        ))}
      </div>
      <style>{`
        .mq-track {
          display: flex; white-space: nowrap;
          animation: mq-run 60s linear infinite;
          will-change: transform;
        }
        .mq-item {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--mono);
          font-size: 0.68rem; color: rgba(255,255,255,0.38); flex-shrink: 0;
          padding: 0 24px; border-right: 1px solid rgba(255,255,255,0.08);
        }
        @keyframes mq-run { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .mq-track { animation: none; } }
      `}</style>
    </div>
  );
}
