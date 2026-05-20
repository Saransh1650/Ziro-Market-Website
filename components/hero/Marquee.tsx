import { STATIC_TICKERS } from '@/lib/marketData';

export default function Marquee() {
  const items = [...STATIC_TICKERS, ...STATIC_TICKERS];
  return (
    <div
      aria-hidden
      style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--border-1)',
        borderBottom: '1px solid var(--border-1)',
        background: 'var(--bg-1)',
        position: 'relative',
        padding: '14px 0',
      }}
    >
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: 'linear-gradient(90deg, var(--bg-1), transparent)', pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: 120, zIndex: 2,
        background: 'linear-gradient(-90deg, var(--bg-1), transparent)', pointerEvents: 'none',
      }} />
      <div className="mq-track">
        {items.map((t, i) => (
          <span key={i} className="mq-item">
            <span style={{ color: 'var(--text-1)', fontWeight: 700 }}>{t.symbol}</span>
            <span className={t.changePct >= 0 ? 'up' : 'down'}>
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
          font-size: 0.7rem; color: var(--text-3); flex-shrink: 0;
          padding: 0 24px; border-right: 1px solid var(--border-1);
        }
        @keyframes mq-run { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @media (prefers-reduced-motion: reduce) { .mq-track { animation: none; } }
      `}</style>
    </div>
  );
}
