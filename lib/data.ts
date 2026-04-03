export interface Stock {
  sym: string;
  name: string;
  price: number;
  base: number;
}

export const STOCKS: Stock[] = [
  { sym: 'RELIANCE',    name: 'Reliance Industries',  price: 2943.55,  base: 2943.55 },
  { sym: 'HDFCBANK',    name: 'HDFC Bank',            price: 1627.00,  base: 1627.00 },
  { sym: 'TCS',         name: 'Tata Consultancy',     price: 3846.80,  base: 3846.80 },
  { sym: 'INFY',        name: 'Infosys',              price: 1742.15,  base: 1742.15 },
  { sym: 'WIPRO',       name: 'Wipro Ltd',            price: 464.50,   base: 464.50  },
  { sym: 'ICICIBANK',   name: 'ICICI Bank',           price: 1241.30,  base: 1241.30 },
  { sym: 'BAJFINANCE',  name: 'Bajaj Finance',        price: 7290.00,  base: 7290.00 },
  { sym: 'AXISBANK',    name: 'Axis Bank',            price: 1134.80,  base: 1134.80 },
  { sym: 'SUNPHARMA',   name: 'Sun Pharma',           price: 1548.20,  base: 1548.20 },
  { sym: 'TATASTEEL',   name: 'Tata Steel',           price: 163.10,   base: 163.10  },
  { sym: 'ONGC',        name: 'ONGC',                 price: 283.55,   base: 283.55  },
  { sym: 'KOTAKBANK',   name: 'Kotak Mahindra',       price: 1895.40,  base: 1895.40 },
  { sym: 'LT',          name: 'L&T Ltd',              price: 3512.00,  base: 3512.00 },
  { sym: 'NESTLEIND',   name: 'Nestle India',         price: 2246.70,  base: 2246.70 },
  { sym: 'POWERGRID',   name: 'Power Grid Corp',      price: 316.80,   base: 316.80  },
  { sym: 'MARUTI',      name: 'Maruti Suzuki',        price: 12847.90, base: 12847.90 },
  { sym: 'BHARTIARTL',  name: 'Bharti Airtel',        price: 1652.40,  base: 1652.40  },
  { sym: 'TITAN',       name: 'Titan Company',        price: 3428.55,  base: 3428.55  },
  { sym: 'ASIANPAINT',  name: 'Asian Paints',         price: 2547.80,  base: 2547.80  },
  { sym: 'ULTRACEMCO',  name: 'UltraTech Cement',     price: 11234.60, base: 11234.60 },
  { sym: 'ADANIPORTS',  name: 'Adani Ports',          price: 1178.45,  base: 1178.45  },
  { sym: 'HINDALCO',    name: 'Hindalco Industries',  price: 645.30,   base: 645.30   },
  { sym: 'JSWSTEEL',    name: 'JSW Steel',            price: 924.15,   base: 924.15   },
  { sym: 'SBIN',        name: 'State Bank of India',  price: 824.70,   base: 824.70   },
  { sym: 'TECHM',       name: 'Tech Mahindra',        price: 1687.35,  base: 1687.35  },
  { sym: 'EICHERMOT',   name: 'Eicher Motors',        price: 4892.10,  base: 4892.10  },
  { sym: 'DRREDDY',     name: 'Dr Reddys Lab',        price: 1253.90,  base: 1253.90  },
  { sym: 'APOLLOHOSP',  name: 'Apollo Hospitals',     price: 7124.55,  base: 7124.55  },
  { sym: 'DIVISLAB',    name: 'Divis Laboratories',   price: 5847.20,  base: 5847.20  },
  { sym: 'GRASIM',      name: 'Grasim Industries',    price: 2634.85,  base: 2634.85  },
];

export interface Sector {
  name: string;
  val: number;
  cols: number;
}

export const SECTORS: Sector[] = [
  { name: 'Banking',    val: 0, cols: 2 },
  { name: 'IT',         val: 0, cols: 2 },
  { name: 'Energy',     val: 0, cols: 1 },
  { name: 'Pharma',     val: 0, cols: 1 },
  { name: 'Auto',       val: 0, cols: 1 },
  { name: 'FMCG',       val: 0, cols: 1 },
  { name: 'Metal',      val: 0, cols: 1 },
  { name: 'Realty',     val: 0, cols: 1 },
  { name: 'Infra',      val: 0, cols: 1 },
  { name: 'Media',      val: 0, cols: 1 },
];

export interface Index {
  sym: string;
  price: number;
  chg: number;
}

export const INDICES: Index[] = [
  { sym: 'NIFTY 50',    price: 22847.30, chg: 0.82 },
  { sym: 'NIFTY BANK',  price: 48730.15, chg: 1.24 },
  { sym: 'NIFTY IT',    price: 37842.50, chg: -0.61 },
  { sym: 'SENSEX',      price: 75901.55, chg: 0.74 },
  { sym: 'NIFTY MID',   price: 53218.40, chg: 1.43 },
  { sym: 'NIFTY SMALL', price: 17432.80, chg: 2.18 },
];

// Utility functions
export const rand = (a: number, b: number) => Math.random() * (b - a) + a;
export const randInt = (a: number, b: number) => Math.floor(rand(a, b));
export const sign = (n: number) => n >= 0 ? '+' : '';
export const pct = (n: number) => `${sign(n)}${n.toFixed(2)}%`;
export const formatChange = (n: number) => {
  const arrow = n >= 0 ? '▲' : '▼';
  return `${arrow} ${Math.abs(n).toFixed(2)}%`;
};
export const fmtINR = (n: number) => '₹' + n.toLocaleString('en-IN', { 
  minimumFractionDigits: 2, 
  maximumFractionDigits: 2 
});
export const chgColor = (v: number) => v >= 0 ? 'var(--green)' : 'var(--red)';
export const cellBg = (v: number) => {
  const a = Math.min(Math.abs(v) * 0.13, 0.55);
  return v >= 0 ? `rgba(34,197,94,${a})` : `rgba(239,68,68,${a})`;
};
