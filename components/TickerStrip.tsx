'use client';

import { useMemo } from 'react';
import { STOCKS, INDICES, formatChange } from '@/lib/data';

export default function TickerStrip() {
  const tickerItems = useMemo(() => {
    // Select specific stocks and indices for the premium feel
    const featuredIndices = INDICES.filter(idx => 
      ['NIFTY 50', 'NIFTY BANK', 'SENSEX'].includes(idx.sym)
    );
    
    const featuredStocks = STOCKS.filter(s => 
      ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'SBIN'].includes(s.sym)
    );

    const items = [
      ...featuredIndices.map((idx) => ({
        symbol: idx.sym.toUpperCase(),
        price: idx.price.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        change: idx.chg,
      })),
      ...featuredStocks.map((stock) => ({
        symbol: stock.sym,
        price: `₹${stock.price.toLocaleString('en-IN', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        change: ((stock.price - stock.base) / stock.base) * 100 + 0.5, // Mock slight gain for visual
      })),
    ];
    return items;
  }, []);

  // Double the items for seamless loop via CSS animation
  const doubledItems = [...tickerItems, ...tickerItems];

  return (
    <div className="ticker-strip" aria-label="Live market data ticker" aria-live="off">
      <div className="ticker-inner">
        {doubledItems.map((item, i) => (
          <div key={`${item.symbol}-${i}`} className="t-item">
            <span className="t-sym">{item.symbol}</span>
            <span className="t-price">{item.price}</span>
            <span className={`t-chg ${item.change >= 0 ? 'green' : 'red'}`}>
              {formatChange(item.change)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
