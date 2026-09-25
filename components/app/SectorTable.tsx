'use client';

import { getAllSectors } from '@/lib/api/market';
import { useResource } from '@/hooks/useResource';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import { compact, num } from '@/lib/format/number';
import type { SectorPerformance } from '@/lib/api/types';

/**
 * Sector performance across horizons — the table beside the heatmap.
 *
 * The heatmap answers "what is moving today"; this answers "what has been
 * moving", which is the question the timeframe toggle on the heatmap can
 * only answer one horizon at a time.
 */
export default function SectorTable() {
  const { data, loading, error, refetch } = useResource<SectorPerformance[]>((signal) => getAllSectors({ signal }));

  const columns: Column<SectorPerformance>[] = [
    {
      key: 'name', header: 'Sector', sortable: true,
      render: (s) => <span className="zw-sym">{s.name}</span>,
    },
    { key: 'marketCap', header: 'Market cap', numeric: true, sortable: true, render: (s) => (s.marketCap ? compact(s.marketCap) : '—') },
    { key: 'changePercent', header: '1D', numeric: true, sortable: true, emphasis: true, render: (s) => <Delta value={s.changePercent} /> },
    { key: 'change5d', header: '1W', numeric: true, sortable: true, render: (s) => <Delta value={s.change5d} /> },
    { key: 'change1m', header: '1M', numeric: true, sortable: true, render: (s) => <Delta value={s.change1m} /> },
    { key: 'change3m', header: '3M', numeric: true, sortable: true, render: (s) => <Delta value={s.change3m} /> },
    { key: 'change6m', header: '6M', numeric: true, sortable: true, render: (s) => <Delta value={s.change6m} /> },
    { key: 'changeYtd', header: 'YTD', numeric: true, sortable: true, render: (s) => <Delta value={s.changeYtd} /> },
    { key: 'rs', header: 'RS', numeric: true, sortable: true, render: (s) => (s.rs != null ? num(s.rs, 0) : '—') },
  ];

  return (
    <section className="zw-panel" style={{ marginTop: 'var(--s-4)' }}>
      <header className="zw-panel-head">
        <h2 className="zw-section">Sector performance</h2>
        <p className="zw-meta">Change over each horizon · RS is relative strength, 0–100</p>
      </header>
      <DataTable
        rows={data ?? []}
        columns={columns}
        rowKey={(s) => s.name}
        href={(s) => `/app/sectors/${encodeURIComponent(s.name.toLowerCase())}`}
        caption="Sector performance"
        loading={loading}
        error={error?.message ?? null}
        onRetry={refetch}
        initialSort={{ key: 'change1m', dir: 'desc' }}
        maxRows={40}
      />
    </section>
  );
}

