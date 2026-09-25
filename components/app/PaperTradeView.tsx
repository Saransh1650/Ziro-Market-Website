'use client';

import { useMemo, useState } from 'react';
import { useAuth } from './AuthProvider';
import { useResource } from '@/hooks/useResource';
import { getAccount, getPaperHoldings, getOrders, type PaperAccount, type PaperHolding, type PaperOrder } from '@/lib/api/paperTrade';
import DataTable, { type Column } from './DataTable';
import { Delta, Money } from './Delta';
import { num, relativeTime } from '@/lib/format/number';
import SignedOut from './SignedOut';
import { StockCell } from './StockCell';
import OrderTicket from './OrderTicket';

/**
 * Paper trading.
 *
 * Every screen here carries a persistent simulated marker. A trading UI
 * that could be mistaken for a real broker's is a serious problem, not a
 * cosmetic one — someone has to be able to tell at a glance that no real
 * money is involved.
 */
export default function PaperTradeView() {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [tab, setTab] = useState<'holdings' | 'orders'>('holdings');

  const account = useResource<PaperAccount>(
    (signal) => (userId ? getAccount({ userId, signal }) : Promise.resolve({ ok: true as const, data: {} as PaperAccount })),
    { deps: [userId] },
  );
  const holdings = useResource<PaperHolding[]>(
    (signal) => (userId ? getPaperHoldings({ userId, signal }) : Promise.resolve({ ok: true as const, data: [] as PaperHolding[] })),
    { deps: [userId] },
  );
  const orders = useResource<PaperOrder[]>(
    (signal) => (userId ? getOrders({ userId, signal }) : Promise.resolve({ ok: true as const, data: [] as PaperOrder[] })),
    { deps: [userId] },
  );

  const rows = useMemo(() => holdings.data ?? [], [holdings.data]);
  const orderRows = useMemo(() => orders.data ?? [], [orders.data]);

  if (authLoading) return <div style={{ height: 300 }} aria-hidden="true" />;
  if (!user) {
    return (
      <SignedOut
        title="Sign in to paper trade"
        detail="Practise with simulated money. Positions carry over between the app and here."
        next="/app/paper"
      />
    );
  }

  const a = account.data ?? {};

  const holdingColumns: Column<PaperHolding>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: (h) => <StockCell symbol={h.symbol} /> },
    { key: 'product', header: 'Product', sortable: true, render: (h) => <span className="zw-sub">{h.product ?? 'Delivery'}</span> },
    { key: 'quantity', header: 'Qty', numeric: true, sortable: true, render: (h) => num(h.quantity, 0) },
    { key: 'avg_price', header: 'Avg', numeric: true, sortable: true, render: (h) => num(h.avg_price, 2) },
    { key: 'current_price', header: 'LTP', numeric: true, sortable: true, render: (h) => (h.current_price ? num(h.current_price, 2) : '—') },
    { key: 'pnl', header: 'P&L', numeric: true, sortable: true, render: (h) => <Money value={h.pnl ?? null} compact /> },
    { key: 'pnl_percent', header: 'Return', numeric: true, sortable: true, render: (h) => <Delta value={h.pnl_percent} /> },
  ];

  const orderColumns: Column<PaperOrder>[] = [
    { key: 'symbol', header: 'Stock', sortable: true, render: (o) => <StockCell symbol={o.symbol} /> },
    {
      key: 'side', header: 'Side', sortable: true,
      render: (o) => (
        <span style={{ color: /buy/i.test(o.side) ? 'var(--up)' : 'var(--down)', fontWeight: 600 }}>
          {/buy/i.test(o.side) ? 'Buy' : 'Sell'}
        </span>
      ),
    },
    { key: 'quantity', header: 'Qty', numeric: true, sortable: true, render: (o) => num(o.quantity, 0) },
    { key: 'price', header: 'Price', numeric: true, sortable: true, render: (o) => (o.price ? num(o.price, 2) : 'Market') },
    { key: 'order_type', header: 'Type', sortable: true, render: (o) => <span className="zw-sub">{o.order_type ?? '—'}</span> },
    { key: 'status', header: 'Status', sortable: true, render: (o) => <span className="zw-sub">{o.status ?? '—'}</span> },
    { key: 'created_at', header: 'Placed', sortable: true, render: (o) => <span className="zw-sub">{o.created_at ? relativeTime(o.created_at) : '—'}</span> },
  ];

  return (
    <div className="zw-page">
      <header className="zw-head">
        <h1 className="zw-title">Paper trade</h1>
        {/* Not decoration. This is the control that stops someone
            believing they placed a real order. */}
        <span
          style={{
            border: '1px solid var(--ink)', color: 'var(--ink)', borderRadius: 'var(--r-ctl)',
            padding: '2px 8px', fontSize: 11, fontWeight: 600,
          }}
        >
          Simulated · no real money
        </span>
      </header>

      {account.error ? (
        <p className="zw-sub" style={{ color: 'var(--ink-3)', paddingBottom: 'var(--s-4)' }}>
          No paper trading account yet. Start one in the app and it appears here.
        </p>
      ) : (
        <dl
          style={{
            display: 'flex', flexWrap: 'wrap', gap: 'var(--s-6)', margin: 0,
            borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)',
            padding: 'var(--s-3) 0', marginBottom: 'var(--s-4)',
          }}
        >
          <Stat label="Available margin" value={<Money value={numeric(a.available_margin ?? a.balance)} compact />} />
          <Stat label="Invested" value={<Money value={numeric(a.invested)} compact />} />
          <Stat label="Day P&L" value={<Money value={numeric(a.day_pnl)} compact />} tone={numeric(a.day_pnl)} />
          <Stat label="Total P&L" value={<Money value={numeric(a.total_pnl)} compact />} tone={numeric(a.total_pnl)} />
        </dl>
      )}

      <div role="tablist" aria-label="Paper trading" style={{ display: 'flex', gap: 'var(--s-4)', borderBottom: '1px solid var(--line)' }}>
        {([['holdings', `Holdings (${rows.length})`], ['orders', `Orders (${orderRows.length})`]] as const).map(([id, label]) => (
          <button
            key={id} type="button" role="tab" aria-selected={tab === id}
            onClick={() => setTab(id)}
            style={{
              background: 'none', border: 0, padding: '8px 0', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              color: tab === id ? 'var(--ink)' : 'var(--ink-3)',
              borderBottom: `2px solid ${tab === id ? 'var(--ink)' : 'transparent'}`, marginBottom: -1,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="zw-paper-grid">
        <div style={{ minWidth: 0 }}>
      <div role="tabpanel" style={{ paddingTop: 'var(--s-3)' }}>
        {tab === 'holdings' ? (
          <DataTable
            rows={rows} columns={holdingColumns} rowKey={(h) => h.id ?? h.symbol}
            href={(h) => `/stocks/${encodeURIComponent(h.symbol)}`}
            caption="Paper holdings"
            loading={holdings.loading} error={holdings.error?.message ?? null} onRetry={holdings.refetch}
            empty={<p className="zw-sub" style={{ color: 'var(--ink-3)' }}>No positions yet.</p>}
          />
        ) : (
          <DataTable
            rows={orderRows} columns={orderColumns} rowKey={(o) => o.id}
            caption="Paper orders"
            loading={orders.loading} error={orders.error?.message ?? null} onRetry={orders.refetch}
            empty={<p className="zw-sub" style={{ color: 'var(--ink-3)' }}>No orders yet.</p>}
          />
        )}
      </div>
        </div>

        <aside style={{ minWidth: 0 }}>
          <OrderTicket
            userId={user.id}
            onPlaced={() => { holdings.refetch(); orders.refetch(); account.refetch(); }}
          />
        </aside>
      </div>

      <style>{`
        .zw-paper-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 300px;
          gap: var(--s-6);
          align-items: start;
        }
        @media (max-width: 1023px) {
          /* The ticket goes first on a phone: placing an order is why
             you opened the page, and the tables are the reference. */
          .zw-paper-grid { grid-template-columns: 1fr; }
          .zw-paper-grid > aside { order: -1; }
        }
      `}</style>
    </div>
  );
}

/** The account payload is loosely typed; coerce and reject non-numbers. */
function numeric(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: number | null }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <dt className="zw-colhead">{label}</dt>
      <dd
        className="zw-num-lg"
        style={{ margin: 0, color: tone == null ? undefined : tone >= 0 ? 'var(--up)' : 'var(--down)' }}
      >
        {value}
      </dd>
    </div>
  );
}
