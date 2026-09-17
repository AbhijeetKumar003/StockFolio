// A hand-picked set of liquid, well-known symbols so the Explore page has
// something worth browsing without the person needing to already know a
// ticker. Indices use Yahoo's caret-prefixed symbols.

export const INDICES = [
  { symbol: '^NSEI', label: 'Nifty 50' },
  { symbol: '^BSESN', label: 'Sensex' },
  { symbol: '^GSPC', label: 'S&P 500' },
  { symbol: '^IXIC', label: 'Nasdaq' },
  { symbol: '^DJI', label: 'Dow Jones' },
];

export const TRENDING_INDIA = [
  'RELIANCE.NS',
  'TCS.NS',
  'HDFCBANK.NS',
  'INFY.NS',
  'ICICIBANK.NS',
  'HINDUNILVR.NS',
  'SBIN.NS',
  'BHARTIARTL.NS',
  'ITC.NS',
  'KOTAKBANK.NS',
  'LT.NS',
  'ASIANPAINT.NS',
  'MARUTI.NS',
  'TITAN.NS',
  'WIPRO.NS',
];

export const TRENDING_US = [
  'AAPL',
  'MSFT',
  'GOOGL',
  'AMZN',
  'NVDA',
  'TSLA',
  'META',
  'NFLX',
  'JPM',
  'V',
];

export const ALL_TRENDING_SYMBOLS = [...TRENDING_INDIA, ...TRENDING_US];
