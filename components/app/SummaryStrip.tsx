'use client';

import Link from 'next/link';
import { getDiscovery } from '@/lib/api/discovery';
import { useResource } from '@/hooks/useResource';
import { Delta } from './Delta';
import { StockLogo } from './StockCell';
import { compact, num } from '@/lib/format/number';
import type { Discovery, MarketSnapshot } from '@/lib/api/types';

/**
 * Three answers before the map: how broad is the move, who led it, where
 * did the money go. TradingView calls this the market summary; on Groww
 * it is the first fold of the stocks page.
 */
export default function SummaryStrip({ snapshot }: { snapshot: MarketSnapshot | null }) {
  const { data } = useResource<Discovery>((signal) => getDiscovery({ signal }));

  const b = snapshot?.breadth;
  const total = b ? b.advancers + b.decliners || 1 : 0;
  const leader = data?.topMovers?.largeCap?.gainers?.[0];
  const laggard = data?.topMovers?.largeCap?.losers?.[0];
  const active = data?.mostActive?.mainBoard?.[0];

  return (
    <div className="zw-summary">
      <div className="zw-panel zw-stat">
        <span className="zw-colhead">Breadth</span>
        {b ? (
          <>
            <span className="big">
              <span style={{ color: 'var(--up)' }}>{num(b.advancers, 0)}</span>
              <span className="sep">/</span>
              <span style={{ color: 'var(--down)' }}>{num(b.decliners, 0)}</span>
            </span>
            <span className="zw-meta">{Math.round((b.advancers / total) * 100)}% of large caps advancing</span>
          </>
        ) : <span className="zw-skel" style={{ width: '50%' }} />}
      </div>

      <Mover label="Top gainer" row={leader} />
      <Mover label="Top loser" row={laggard} />

      <div className="zw-panel zw-stat">
        <span className="zw-colhead">Most active</span>
        {active ? (
          <Link href={`/stocks/${encodeURIComponent(active.symbol)}`} className="who">
            <StockLogo symbol={active.symbol} size={28} />
            <span className="zw-idcell">
              <span className="zw-sym">{active.symbol}</span>
              <span className="name">{active.value ? `${compact(active.value)} traded` : ''}</span>
            </span>
          </Link>
        ) : <span className="zw-skel" style={{ width: '50%' }} />}
      </div>
    </div>
  );
}

function Mover({ label, row }: { label: string; row?: { symbol: string; price: number; changePercent: number } }) {
  return (
    <div className="zw-panel zw-stat">
      <span className="zw-colhead">{label}</span>
      {row ? (
        <Link href={`/stocks/${encodeURIComponent(row.symbol)}`} className="who">
          <StockLogo symbol={row.symbol} size={28} />
          <span className="zw-idcell">
            <span className="zw-sym">{row.symbol}</span>
            <span className="name">{num(row.price, 2)}</span>
          </span>
          <span style={{ marginLeft: 'auto' }}><Delta value={row.changePercent} className="pill" /></span>
        </Link>
      ) : <span className="zw-skel" style={{ width: '50%' }} />}
    </div>
  );
}
