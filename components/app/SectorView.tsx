'use client';

import { getSectorDetail } from '@/lib/api/sectors';
import { useResource } from '@/hooks/useResource';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import { StockCell } from './StockCell';
import { num, compact, relativeTime } from '@/lib/format/number';
import type { SectorDetail, SectorStockRow } from '@/lib/api/types';

/**
 * One sector's constituents.
 *
 * Sorted by change descending by default, because the reason anyone
 * opens a sector is to find what moved it.
 */
export default function SectorView({ sector }: { sector: string }) {
  const { data, loading, error, refetch } = useResource<SectorDetail>(
    (signal) => getSectorDetail(sector, { limit: 100, signal }),
    { deps: [sector] },
  );

  const stocks = data?.stocks ?? [];

  const columns: Column<SectorStockRow>[] = [
    {
      key: 'symbol',
      header: 'Stock',
      sortable: true,
      render: (r) => <StockCell symbol={r.symbol} name={r.name} />,
    },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => num(r.price, 2) },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => <Delta value={r.changePercent} /> },
    { key: 'marketCap', header: 'Market cap', numeric: true, sortable: true, render: (r) => (r.marketCap ? compact(r.marketCap) : '—') },
    { key: 'tradedValue', header: 'Traded value', numeric: true, sortable: true, render: (r) => (r.tradedValue ? compact(r.tradedValue) : '—') },
    // Zero means "not reported" for these, never a real figure.
    { key: 'pe', header: 'P/E', numeric: true, sortable: true, render: (r) => (r.pe ? num(r.pe, 2) : '—') },
    { key: 'subSector', header: 'Sub-sector', sortable: true, render: (r) => <span className="zw-sub">{r.subSector ?? '—'}</span> },
  ];

  const total = data?.pagination?.total;

  return (
    <div className="zw-page">
      <header className="zw-head">
        <h1 className="zw-title">{data?.sectorName ?? sector}</h1>
        {total != null && (
          <span className="zw-sub">
            {stocks.length} of {num(total, 0)} stocks
          </span>
        )}
        {data?.lastUpdated && (
          <span className="zw-sub" style={{ marginLeft: 'auto', color: 'var(--ink-3)' }}>
            Updated {relativeTime(data.lastUpdated)}
          </span>
        )}
      </header>

      {data?.subSectors && data.subSectors.length > 1 && (
        <p className="zw-sub" style={{ paddingBottom: 'var(--s-3)' }}>
          Covers {data.subSectors.join(', ')}
        </p>
      )}

      <DataTable
        rows={stocks}
        columns={columns}
        rowKey={(r) => r.symbol}
        href={(r) => `/stocks/${encodeURIComponent(r.symbol)}`}
        caption={`${sector} constituents`}
        loading={loading}
        error={error?.message}
        onRetry={refetch}
        initialSort={{ key: 'changePercent', dir: 'desc' }}
        maxRows={100}
        empty={<p className="zw-sub" style={{ color: 'var(--ink-3)' }}>No stocks listed under {sector}.</p>}
      />
    </div>
  );
}
