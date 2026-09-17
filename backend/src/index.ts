import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import { attachPriceStream } from './sockets/priceStream';
import authRoutes from './routes/auth';
import marketRoutes from './routes/market';
import portfolioRoutes from './routes/portfolio';
import watchlistRoutes from './routes/watchlist';
import './db'; // ensures schema is created on boot

const requiredEnv = ['JWT_SECRET'];
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing required environment variable: ${key}. Copy .env.example to .env and fill it in.`);
    process.exit(1);
  }
}

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/watchlist', watchlistRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Not found.' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: corsOrigin } });
attachPriceStream(io);

const port = Number(process.env.PORT) || 4000;
server.listen(port, () => {
  console.log(`StockPro API listening on http://localhost:${port}`);
});
