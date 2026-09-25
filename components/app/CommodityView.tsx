'use client';

import { useState } from 'react';
import { getCommodities } from '@/lib/api/market';
import { getCommodityCandles, getCommodityContracts } from '@/lib/api/commodities';
import { useResource } from '@/hooks/useResource';
import type { CommodityMap } from '@/lib/api/types';
import LineChart from './LineChart';
import DataTable, { type Column } from './DataTable';
import { Delta, Money } from './Delta';
import { num } from '@/lib/format/number';

const RANGES = [
  { id: 30, label: '1M' },
  { id: 90, label: '3M' },
  { id: 180, label: '6M' },
  { id: 365, label: '1Y' },
];

/**
 * One commodity: price header, candle history and the contracts on offer.
 *
 * The route param is the commodity *key* (`gold`), which is what the
 * candle and contract endpoints take. The `symbol` on a price row is a
 * specific contract (`GOLDM FUT 05 OCT 26`) and would 404 there.
 */
export default function CommodityView({ commodityKey }: { commodityKey: string }) {
  const [days, setDays] = useState(90);

  const prices = useResource<CommodityMap>((signal) => getCommodities({ signal }));
  const candles = useResource((signal) => getCommodityCandles(commodityKey, days, { signal }), { deps: [commodityKey, days] });
  const contracts = useResource((signal) => getCommodityContracts(commodityKey, { signal }), { deps: [commodityKey] });

  const c = prices.data?.[commodityKey];
  const series = candles.data?.candles ?? [];

  const fmtDate = (t: number) =>
    new Intl.DateTimeFormat('en-IN', { day: 'numeric', month: 'short', timeZone: 'Asia/Kolkata' }).format(new Date(t));

  const cols: Column<NonNullable<typeof contracts.data>[number]>[] = [
    { key: 'tradingSymbol', header: 'Contract', sortable: true, render: (r) => <span className="zw-sym">{r.tradingSymbol}</span> },
    { key: 'expiry', header: 'Expiry', sortable: true, render: (r) => r.expiry },
    { key: 'unit', header: 'Unit', render: (r) => r.unit },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => (r.price ? num(r.price, 2) : '—') },
    { key: 'changePercent', header: 'Change', numeric: true, sortable: true, render: (r) => (r.price ? <Delta value={r.changePercent} /> : '—') },
  ];

  return (
    <div className="zw-page">
      <header className="zw-panel zw-pricehead">
        <div className="id">
          <span className="zw-logo" style={{ width: 56, height: 56, display: 'grid', placeItems: 'center', fontSize: 28 }} aria-hidden="true">
            {c?.emoji ?? '◆'}
          </span>
          <div>
            <h1 className="zw-title">{c?.name ?? commodityKey}</h1>
            <p className="zw-sub">
              <span className="tag">MCX</span>
              {c?.expiry && <span>Contract expires {c.expiry}</span>}
            </p>
          </div>
        </div>
        {c && (
          <div className="zw-liveprice">
            <Money value={c.price} decimals={0} className="px" />
            <span className="chg">
              <Delta value={c.change} mode="absolute" decimals={0} />
              <Delta value={c.changePercent} className="pill" />
            </span>
          </div>
        )}
      </header>

      <section className="zw-panel" style={{ marginTop: 'var(--s-4)', padding: 'var(--s-5)' }}>
        <div className="zw-subhead">
          <div className="zw-seg" role="group" aria-label="Range">
            {RANGES.map((r) => (
              <button key={r.id} type="button" aria-pressed={days === r.id} onClick={() => setDays(r.id)}>{r.label}</button>
            ))}
          </div>
          <span className="zw-meta">Daily closes, front-month contract</span>
        </div>

        {candles.loading ? (
          <div className="zw-state"><span className="zw-heat-spin" aria-hidden="true" /></div>
        ) : candles.error ? (
          <p role="alert" className="zw-sub">{candles.error.message}</p>
        ) : (
          <LineChart
            fill
            series={[{ name: c?.name ?? commodityKey, values: series.map((k) => k.close), color: 'var(--ink)' }]}
            labels={series.map((k) => fmtDate(k.time))}
            format={(v) => num(v, 0)}
          />
        )}
      </section>

      <section className="zw-panel" style={{ marginTop: 'var(--s-4)' }}>
        <header className="zw-panel-head">
          <h2 className="zw-section">Contracts</h2>
          <p className="zw-meta">Zero price means the contract has not traded yet</p>
        </header>
        <DataTable
          rows={contracts.data ?? []}
          columns={cols}
          rowKey={(r) => r.tradingSymbol}
          caption="Available contracts"
          loading={contracts.loading}
          error={contracts.error?.message ?? null}
          onRetry={contracts.refetch}
        />
      </section>
    </div>
  );
}
