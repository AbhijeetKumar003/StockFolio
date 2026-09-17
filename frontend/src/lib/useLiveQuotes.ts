import { useEffect, useRef, useState } from 'react';
import { getSocket } from './socket';

export interface LiveQuote {
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

// Subscribes to live ticks for the given symbols over the shared socket
// connection and keeps a map of the latest quote per symbol, updating as
// price events arrive. Re-subscribes automatically when `symbols` changes.
export function useLiveQuotes(symbols: string[]) {
  const [quotes, setQuotes] = useState<Record<string, LiveQuote>>({});
  const symbolsKey = symbols.slice().sort().join(',');
  const prevSymbols = useRef<string[]>([]);

  useEffect(() => {
    if (!symbolsKey) return;
    const socket = getSocket();
    const current = symbolsKey.split(',').filter(Boolean);

    socket.emit('subscribe', current);

    function handlePrice(quote: LiveQuote) {
      setQuotes((prev) => ({ ...prev, [quote.symbol]: quote }));
    }
    socket.on('price', handlePrice);

    return () => {
      socket.off('price', handlePrice);
      socket.emit('unsubscribe', prevSymbols.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [symbolsKey]);

  useEffect(() => {
    prevSymbols.current = symbolsKey.split(',').filter(Boolean);
  }, [symbolsKey]);

  return quotes;
}
