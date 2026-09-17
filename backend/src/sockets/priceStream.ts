import { Server, Socket } from 'socket.io';
import { getQuotes } from '../services/marketData';

// Each connected client tells the server which symbols it's watching
// (dashboard, watchlist, portfolio, stock-detail page). The server polls
// Yahoo Finance for the union of all subscribed symbols on one shared
// interval and pushes updates only to the sockets that asked for them —
// this is what gives every screen "live" prices without each client
// hammering the API independently.

const POLL_INTERVAL_MS = 4000;

export function attachPriceStream(io: Server) {
  const subscriptions = new Map<string, Set<string>>(); // symbol -> set of socket ids

  io.on('connection', (socket: Socket) => {
    const mySymbols = new Set<string>();

    socket.on('subscribe', (symbols: string[]) => {
      if (!Array.isArray(symbols)) return;
      for (const raw of symbols) {
        const symbol = String(raw).trim().toUpperCase();
        if (!symbol) continue;
        mySymbols.add(symbol);
        if (!subscriptions.has(symbol)) subscriptions.set(symbol, new Set());
        subscriptions.get(symbol)!.add(socket.id);
      }
    });

    socket.on('unsubscribe', (symbols: string[]) => {
      if (!Array.isArray(symbols)) return;
      for (const raw of symbols) {
        const symbol = String(raw).trim().toUpperCase();
        mySymbols.delete(symbol);
        subscriptions.get(symbol)?.delete(socket.id);
      }
    });

    socket.on('disconnect', () => {
      for (const symbol of mySymbols) {
        subscriptions.get(symbol)?.delete(socket.id);
      }
    });
  });

  setInterval(async () => {
    const symbols = [...subscriptions.keys()];
    if (symbols.length === 0) return;

    const quotes = await getQuotes(symbols);
    for (const quote of quotes) {
      const sockets = subscriptions.get(quote.symbol);
      if (!sockets || sockets.size === 0) continue;
      for (const socketId of sockets) {
        io.to(socketId).emit('price', quote);
      }
    }
  }, POLL_INTERVAL_MS);
}
