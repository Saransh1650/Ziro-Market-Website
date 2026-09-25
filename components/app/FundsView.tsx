'use client';

import { useMemo, useState } from 'react';
import { getEtfs, getMutualFunds } from '@/lib/api/discovery';
import { useResource } from '@/hooks/useResource';
import DataTable, { type Column } from './DataTable';
import { Delta } from './Delta';
import InstrumentTabs from './InstrumentTabs';
import { num, compact } from '@/lib/format/number';
import type { Etf, MutualFund } from '@/lib/api/types';

/**
 * ETF and mutual fund lists.
 *
 * One component for both: the tables differ in columns, not in shape,
 * and keeping them together means the filter and empty-state behaviour
 * can't drift apart.
 */
export default function FundsView({ kind }: { kind: 'etf' | 'fund' }) {
  return (
    <div className="zw-page">
      <header className="zw-head">
        <h1 className="zw-title">Discover</h1>
      </header>

      <InstrumentTabs current={kind === 'etf' ? 'etfs' : 'funds'} />

      {kind === 'etf' ? <EtfTable /> : <FundTable />}
    </div>
  );
}

/* ── Category filter ──────────────────────────────────────────── */

function CategoryChips({
  categories,
  active,
  onChange,
}: {
  categories: string[];
  active: string | null;
  onChange: (c: string | null) => void;
}) {
  if (categories.length < 2) return null;
  return (
    <div style={{ display: 'flex', gap: 'var(--s-1)', flexWrap: 'wrap', padding: 'var(--s-4) var(--s-5)' }}>
      <button type="button" className="zw-chip" aria-pressed={active === null} onClick={() => onChange(null)}>
        All
      </button>
      {categories.map((c) => (
        <button key={c} type="button" className="zw-chip" aria-pressed={active === c} onClick={() => onChange(c)}>
          {c}
        </button>
      ))}
    </div>
  );
}

/* ── ETFs ─────────────────────────────────────────────────────── */

function EtfTable() {
  const { data, loading, error, refetch } = useResource<Etf[]>((signal) => getEtfs({ signal }));
  const [category, setCategory] = useState<string | null>(null);

  // Memoised so the category list below is not rebuilt on every render
  // by a fresh `[]` from the nullish fallback.
  const rows = useMemo(() => data ?? [], [data]);
  // Categories come from the data, never a hardcoded list — a new
  // category on the backend would otherwise be invisible and
  // unfilterable.
  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.category).filter((c): c is string => !!c))].sort(),
    [rows],
  );
  const filtered = category ? rows.filter((r) => r.category === category) : rows;

  const columns: Column<Etf>[] = [
    {
      key: 'symbol', header: 'ETF', sortable: true,
      render: (r) => (
        <span style={{ display: 'block', minWidth: 0 }}>
          <span className="zw-sym">{r.symbol}</span>
          <span className="zw-sub" style={{ display: 'block', maxWidth: 320, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</span>
        </span>
      ),
    },
    { key: 'category', header: 'Category', sortable: true, render: (r) => <span className="zw-sub">{r.category ?? '—'}</span> },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (r) => (r.price != null ? num(r.price, 2) : '—') },
    { key: 'nav', header: 'NAV', numeric: true, sortable: true, render: (r) => (r.nav != null ? num(r.nav, 3) : '—') },
    {
      // Price against NAV is the number that matters for an ETF: it is
      // the premium or discount you actually pay.
      key: 'premium', header: 'Prem / disc', numeric: true, sortable: true,
      sortValue: (r) => premium(r) ?? 0,
      render: (r) => {
        const p = premium(r);
        return p == null ? '—' : <Delta value={p} />;
      },
    },
    {
      key: 'avg_volume_10d', header: 'Avg volume 10d', numeric: true, sortable: true,
      render: (r) => (r.avg_volume_10d ? compact(r.avg_volume_10d, false) : '—'),
    },
    {
      key: 'expense_ratio', header: 'Expense', numeric: true, sortable: true,
      render: (r) => (r.expense_ratio != null ? `${num(r.expense_ratio, 2)}%` : '—'),
    },
  ];

  return (
    <section className="zw-panel">
      <CategoryChips categories={categories} active={category} onChange={setCategory} />
      <DataTable
        rows={filtered} columns={columns} rowKey={(r) => r.symbol}
        href={(r) => `/stocks/${encodeURIComponent(r.symbol)}`}
        caption="Exchange traded funds"
        loading={loading} error={error?.message} onRetry={refetch}
        initialSort={{ key: 'avg_volume_10d', dir: 'desc' }} maxRows={100}
      />
    </section>
  );
}

/** Market price against NAV, as a percentage. Null when either is missing. */
function premium(r: Etf): number | null {
  if (r.price == null || r.nav == null || !r.nav) return null;
  return ((r.price - r.nav) / r.nav) * 100;
}

/* ── Mutual funds ─────────────────────────────────────────────── */

function FundTable() {
  const { data, loading, error, refetch } = useResource<MutualFund[]>((signal) => getMutualFunds({ signal }));
  const [category, setCategory] = useState<string | null>(null);

  const rows = useMemo(() => data ?? [], [data]);
  const categories = useMemo(
    () => [...new Set(rows.map((r) => r.scheme_type).filter((c): c is string => !!c))].sort(),
    [rows],
  );
  const filtered = category ? rows.filter((r) => r.scheme_type === category) : rows;

  const columns: Column<MutualFund>[] = [
    {
      key: 'scheme_name', header: 'Scheme', sortable: true,
      render: (r) => (
        <span style={{ display: 'block', minWidth: 0 }}>
          <span className="zw-sym" style={{ display: 'block', maxWidth: 380, overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
            {r.scheme_name}
          </span>
          {r.fund_house && <span className="zw-sub" style={{ display: 'block' }}>{r.fund_house}</span>}
        </span>
      ),
    },
    { key: 'scheme_type', header: 'Type', sortable: true, render: (r) => <span className="zw-sub">{r.scheme_type ?? '—'}</span> },
    { key: 'nav', header: 'NAV', numeric: true, sortable: true, render: (r) => (r.nav != null ? num(r.nav, 3) : '—') },
    { key: 'return_1y', header: '1Y', numeric: true, sortable: true, render: (r) => <Return value={r.return_1y} /> },
    { key: 'return_3y', header: '3Y', numeric: true, sortable: true, render: (r) => <Return value={r.return_3y} /> },
    { key: 'return_5y', header: '5Y', numeric: true, sortable: true, render: (r) => <Return value={r.return_5y} /> },
    {
      key: 'expense_ratio', header: 'Expense', numeric: true, sortable: true,
      render: (r) => (r.expense_ratio != null ? `${num(r.expense_ratio, 2)}%` : '—'),
    },
  ];

  return (
    <section className="zw-panel">
      <CategoryChips categories={categories} active={category} onChange={setCategory} />
      <DataTable
        rows={filtered} columns={columns} rowKey={(r) => String(r.scheme_code)}
        caption="Mutual funds"
        loading={loading} error={error?.message} onRetry={refetch}
        initialSort={{ key: 'return_1y', dir: 'desc' }} maxRows={100}
      />
    </section>
  );
}

/**
 * A period return.
 *
 * Null and zero both render as a dash: a fund younger than the period
 * has no return for it, and "0.00%" would be a wrong number rather than
 * a missing one.
 */
function Return({ value }: { value: number | null | undefined }) {
  if (value == null || !Number.isFinite(value) || value === 0) {
    return <span style={{ color: 'var(--ink-3)' }}>—</span>;
  }
  return <Delta value={value} />;
}
