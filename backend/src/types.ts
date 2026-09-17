export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

export interface JwtPayload {
  id: number;
  name: string;
  email: string;
}

export interface Quote {
  symbol: string;
  shortName: string;
  currency: string;
  regularMarketPrice: number;
  regularMarketChange: number;
  regularMarketChangePercent: number;
  regularMarketDayHigh: number;
  regularMarketDayLow: number;
  regularMarketVolume: number;
  regularMarketPreviousClose: number;
  marketState: string;
}

export interface CandlePoint {
  time: string;
  close: number;
}
