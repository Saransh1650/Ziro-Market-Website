'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

/**
 * The workhorse table.
 *
 * Structure and spacing live in `product.css` (`.zw-table`), not in
 * inline styles — a row is 44px and a cell is 11px/12px everywhere,
 * which is the only way the reading rhythm survives across surfaces.
 *
 * A real `<table>` with `<th scope>` and `aria-sort`, never a grid of
 * divs: a screen reader announces a real table correctly and a div grid
 * not at all.
 */

export interface Column<T> {
  key: string;
  header: string;
  /** Right-aligned with asymmetric padding. Use for anything numeric. */
  numeric?: boolean;
  width?: string;
  sortable?: boolean;
  /** Value used for sorting. Falls back to the raw field. */
  sortValue?: (row: T) => number | string;
  /** Gives the column a permanent colourless wash, to draw the eye. */
  emphasis?: boolean;
  /** Hidden until the row is hovered or focused. For row actions. */
  onHover?: boolean;
  render: (row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  rows: T[];
  columns: Column<T>[];
  rowKey: (row: T) => string;
  href?: (row: T) => string;
  caption?: string;
  initialSort?: { key: string; dir: 'asc' | 'desc' };
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  empty?: React.ReactNode;
  /** Rows rendered before the "showing N of M" cut-off. */
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
      const cmp =
        typeof av === 'number' && typeof bv === 'number'
          ? av - bv
          : String(av).localeCompare(String(bv));
      return sort.dir === 'asc' ? cmp : -cmp;
    });
  }, [rows, columns, sort]);

  const visible = sorted.slice(0, maxRows);

  if (loading) return <TableSkeleton columns={columns} />;

  if (error) {
    return (
      <div role="alert" className="zw-state">
        <p className="zw-sub">{error}</p>
        {onRetry && (
          <button type="button" className="zw-chip" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="zw-state">
        {empty ?? <p className="zw-sub">Nothing here yet.</p>}
      </div>
    );
  }

  return (
    <div className="zw-scroll-x">
      <table className="zw-table">
        {caption && <caption className="zw-sr">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={`zw-colhead${col.numeric ? ' num' : ''}${col.emphasis ? ' emphasis' : ''}`}
                  aria-sort={active ? (sort!.dir === 'asc' ? 'ascending' : 'descending') : undefined}
                  style={col.width ? { width: col.width } : undefined}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="zw-sortbtn"
                      data-active={active || undefined}
                      onClick={() =>
                        setSort((prev) =>
                          prev?.key === col.key
                            ? { key: col.key, dir: prev.dir === 'asc' ? 'desc' : 'asc' }
                            : { key: col.key, dir: col.numeric ? 'desc' : 'asc' },
                        )
                      }
                    >
                      {col.header}
                      <svg
                        aria-hidden="true"
                        className="zw-sortarrow"
                        data-dir={active ? sort!.dir : undefined}
                        width="8" height="10" viewBox="0 0 8 10" fill="none"
                        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                      >
                        <path d="M4 1.5v7M1.5 6 4 8.5 6.5 6" />
                      </svg>
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
                className={to ? 'zw-rowlink' : undefined}
              >
                {columns.map((col, i) => (
                  <td
                    key={col.key}
                    className={[
                      col.numeric ? 'num' : '',
                      col.emphasis ? 'emphasis' : '',
                      col.onHover ? 'zw-rowaction' : '',
                    ].filter(Boolean).join(' ') || undefined}
                  >
                    {/* The first cell carries the link, so a row is
                        keyboard-reachable and openable in a new tab —
                        a click handler alone is neither. */}
                    {i === 0 && to ? (
                      <a href={to} onClick={(e) => e.stopPropagation()} className="zw-cellink">
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
        <p className="zw-meta zw-tablefoot">
          Showing {visible.length} of {sorted.length}
        </p>
      )}
    </div>
  );
}

function TableSkeleton({ columns }: { columns: { numeric?: boolean }[] }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: 6 }).map((_, r) => (
        <div key={r} className="zw-skelrow">
          {columns.map((col, c) => (
            <span
              key={c}
              className="zw-skel"
              style={{
                width: c === 0 ? '55%' : '70%',
                justifySelf: col.numeric ? 'end' : 'start',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
