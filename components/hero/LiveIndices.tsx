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
        borderTop: '1px solid var(--border-1)',
        background: 'rgba(11,59,46,0.03)',
      }}
    >
      {data.map((idx, i) => (
        <div key={idx.symbol} style={{
          padding: '16px 22px',
          borderRight: i < data.length - 1 ? '1px solid var(--border-1)' : 'none',
          display: 'flex', flexDirection: 'column', gap: 4,
        }}>
          <div className="caption" style={{ color: 'var(--text-3)' }}>{idx.name}</div>
          <div style={{
            fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.01em',
            fontFamily: 'var(--mono)', color: 'var(--text-1)',
          }}>
            {formatINR(idx.value)}
          </div>
          <div className={idx.changePct >= 0 ? 'up' : 'down'} style={{
            fontFamily: 'var(--mono)', fontSize: '0.7rem', fontWeight: 600,
          }}>
            {idx.changePct >= 0 ? '▲' : '▼'} {Math.abs(idx.change).toFixed(2)} · {idx.changePct >= 0 ? '+' : ''}{idx.changePct.toFixed(2)}%
          </div>
        </div>
      ))}
      <div className="caption" style={{
        gridColumn: '1 / -1', padding: '8px 22px',
        borderTop: '1px solid var(--border-1)',
        display: 'flex', justifyContent: 'space-between',
        color: 'var(--text-3)',
      }}>
        <span>
          {open ? <><span className="live-dot" /> &nbsp;Live · NSE · BSE</> : 'Market closed · Last close'}
        </span>
        <span>{stale ? 'Stale · last update saved' : 'Updated 09:30 IST'}</span>
      </div>
      <style>{`
        @media (max-width: 768px) {
          [data-live-indices] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}
