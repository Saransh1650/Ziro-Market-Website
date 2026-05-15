// Server component — no 'use client' needed
const items = [
  { sym: 'NIFTY 50',    price: '22,847', chg: '+0.62%', up: true },
  { sym: 'SENSEX',      price: '75,190', chg: '+0.44%', up: true },
  { sym: 'RELIANCE',    price: '₹2,847', chg: '+2.4%',  up: true },
  { sym: 'HDFCBANK',    price: '₹1,687', chg: '+1.2%',  up: true },
  { sym: 'INFY',        price: '₹1,634', chg: '-0.8%',  up: false },
  { sym: 'TCS',         price: '₹4,122', chg: '+3.1%',  up: true },
  { sym: 'ICICIBANK',   price: '₹1,234', chg: '+0.6%',  up: true },
  { sym: 'SBIN',        price: '₹791',   chg: '+3.1%',  up: true },
  { sym: 'BHARTIARTL',  price: '₹1,145', chg: '-0.4%',  up: false },
  { sym: 'WIPRO',       price: '₹482',   chg: '-1.1%',  up: false },
  { sym: 'BAJFINANCE',  price: '₹7,142', chg: '+4.7%',  up: true },
  { sym: 'TITAN',       price: '₹3,742', chg: '+0.2%',  up: true },
  { sym: 'ITC',         price: '₹412',   chg: '+0.5%',  up: true },
  { sym: 'MARUTI',      price: '₹11,456',chg: '+0.9%',  up: true },
  { sym: 'ADANIENT',    price: '₹2,456', chg: '+1.8%',  up: true },
];

// Double for seamless loop
const doubled = [...items, ...items];

export default function Marquee() {
  return (
    <div className="marquee-section" aria-hidden="true">
      <div className="marquee-track">
        {doubled.map((item, idx) => (
          <span className="marquee-item" key={idx}>
            <span className="sym">{item.sym}</span>
            <span style={{ color: 'var(--text-4)' }}>{item.price}</span>
            <span className={item.up ? 'chg-up' : 'chg-down'}>{item.chg}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
