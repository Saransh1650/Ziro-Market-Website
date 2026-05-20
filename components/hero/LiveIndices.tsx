'use client';
import { STATIC_INDICES, formatINR, isMarketOpen } from '@/lib/marketData';
import { useLiveIndices } from '@/hooks/useLiveIndices';

export default function LiveIndices() {
  const { data, stale } = useLiveIndices(STATIC_INDICES);
  const open = isMarketOpen();
  return (
    <div
      aria-live="polite"
      data-live-indices
      style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
        borderTop: '1px solid var(--border-1)', background: 'var(--bg-1)',
      }}
    >
      {data.map((idx, i) => (
        <div key={idx.symbol} style={{
          padding: '18px 22px',
          borderRight: i < data.length - 1 ? '1px solid var(--border-1)' : 'none',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div className="caption">{idx.name}</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, letterSpacing: '-0.01em' }}>
            {formatINR(idx.value)}
          </div>
          <div className={`mono ${idx.changePct >= 0 ? 'up' : 'down'}`} style={{ fontSize: '0.72rem', fontWeight: 700 }}>
            {idx.changePct >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} · {idx.changePct >= 0 ? '+' : ''}{idx.changePct.toFixed(2)}%
          </div>
        </div>
      ))}
      <div className="caption" style={{
        gridColumn: '1 / -1', padding: '8px 22px', borderTop: '1px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{open ? <><span className="live-dot" /> &nbsp;LIVE · NSE · BSE</> : 'MARKET CLOSED · Last close'}</span>
        <span>{stale ? 'STALE · last update saved' : 'Updated 09:30 IST'}</span>
      </div>
      <style>{`
        @media (max-width: 768px) {
          [data-live-indices] { grid-template-columns: repeat(2, 1fr) !important; }
          [data-live-indices] > div:nth-child(-n+4) { border-right: none !important; }
        }
      `}</style>
    </div>
  );
}
