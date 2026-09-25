'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The workhorse table.
 *
 * Watchlist, holdings, movers, ETFs, funds, orders and constituents are
 * all this component with different columns.
 *
 * A real `<table>` with `<th scope>` and `aria-sort`, never a grid of
 * divs — a screen reader announces a real table correctly and a div grid
 * not at all, and essentially all of this product's data is tabular.
 */

export interface Column<T> {
  key: string;
  header: string;
  /** Right-aligned with tabular figures. Use for anything numeric. */
  numeric?: boolean;
  width?: string;
  sortable?: boolean;
  /** Value used for sorting. Falls back to the raw field. */
  sortValue?: (row: T) => number | string;
  render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  /** Navigating on row click. Makes the whole row a target. */
  href?: (row: T) => string;
  caption?: string;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  empty?: React.ReactNode;
  /** Rows rendered before windowing kicks in. */
  maxRows?: number;
}

export default function DataTable<T>({
  rows,
  columns,
  rowKey,
  href,
  caption,
  initialSort,
  loading,
  error,
  onRetry,
  empty,
  maxRows = 200,
}: DataTableProps<T>) {
  const router = useRouter();
  const [sort, setSort] = useState(initialSort ?? null);

  const sorted = useMemo(() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;

    const value = (row: T): number | string => {
      if (col.sortValue) return col.sortValue(row);
      const v = (row as Record<string, unknown>)[col.key];
      return typeof v === 'number' || typeof v === 'string' ? v : '';
    };

    // Copy before sorting: mutating the caller's array would reorder
    // whatever else is reading it.
    return [...rows].sort((a, b) => {
      const av = value(a);
      const bv = value(b);
      let cmp: number;
      if (typeof av === 'number' && typeof bv === 'number') cmp = av - bv;
      else cmp = String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, columns, sort]);

  const visible = sorted.slice(0, maxRows);

  if (loading) return <TableSkeleton columns={columns.length} />;

  if (error) {
    return (
      <div role="alert" style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', padding: 'var(--s-4) 0' }}>
        <p className="zw-sub">{error}</p>
        {onRetry && <button type="button" className="zw-chip" onClick={onRetry}>Try again</button>}
      </div>
    );
  }

  if (!rows.length) {
    return <div style={{ padding: 'var(--s-4) 0' }}>{empty ?? <p className="zw-sub" style={{ color: 'var(--text-3)' }}>Nothing here yet.</p>}</div>;
  }

  return (
    <div className="zw-scroll-x">
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: columns.length > 4 ? 560 : undefined }}>
        {caption && <caption className="zw-sr">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className="zw-colhead"
                  aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  style={{
                    textAlign: col.numeric ? 'right' : 'left',
                    width: col.width,
                    padding: '0 var(--s-2) 6px 0',
                    position: 'sticky',
                    top: 0,
                    background: 'var(--bg-0)',
                    borderBottom: '1px solid var(--border-2)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      onClick={() =>
                        setSort((prev) =>
                          prev?.key === col.key
                            ? { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
                            : { key: col.key, dir: col.numeric ? 'desc' : 'asc' },
                        )
                      }
                      style={{
                        background: 'none',
                        border: 0,
                        padding: 0,
                        cursor: 'pointer',
                        font: 'inherit',
                        letterSpacing: 'inherit',
                        textTransform: 'inherit',
                        color: active ? 'var(--text-1)' : 'inherit',
                      }}
                    >
                      {col.header}
                      <span aria-hidden="true" style={{ opacity: active ? 1 : 0.25, marginLeft: 3 }}>
                        {active && sort!.dir === 'asc' ? '↑' : '↓'}
                      </span>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {visible.map((row) => {
            const to = href?.(row);
            return (
              <tr
                key={rowKey(row)}
                onClick={to ? () => router.push(to) : undefined}
                style={{
                  borderBottom: '1px solid var(--border-1)',
                  cursor: to ? 'pointer' : undefined,
                }}
                className={to ? 'zw-rowlink' : undefined}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={col.numeric ? 'zw-num' : undefined}
                    style={{
                      textAlign: col.numeric ? 'right' : 'left',
                      padding: '7px var(--s-2) 7px 0',
                      fontSize: 12,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {/* The first cell carries the link, so the row is
                        reachable by keyboard and openable in a new tab —
                        a click handler alone is neither. */}
                    {i === 0 && to ? (
                      <a href={to} onClick={(e) => e.stopPropagation()} style={{ color: 'inherit' }}>
                        {col.render(row)}
                      </a>
                    ) : (
                      col.render(row)
                    )}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>

      {sorted.length > visible.length && (
        <p className="zw-sub" style={{ padding: 'var(--s-2) 0', color: 'var(--text-3)' }}>
          Showing {visible.length} of {sorted.length}
        </p>
      )}

      <style>{`
        .zw-rowlink:hover { background: var(--bg-2); }
      `}</style>
    </div>
  );
}

function TableSkeleton({ columns }: { columns: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 8 }).map((_, r) => (
        <div
          key={r}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            gap: 'var(--s-3)',
            height: 'var(--row-h)',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-1)',
          }}
        >
          {Array.from({ length: columns }).map((__, c) => (
            <span key={c} style={{ height: 9, background: 'var(--bg-2)', borderRadius: 2, width: c === 0 ? '70%' : '50%', justifySelf: c === 0 ? 'start' : 'end' }} />
          ))}
        </div>
      ))}
    </div>
  );
}
