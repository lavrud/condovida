import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import './db.js'; // inicializa o banco e faz seed se necessário
import { authRouter } from './auth.js';
import { mockRouter } from './mock-routes.js';

const app = express();
const PORT = Number(process.env.PORT) || 3001;

app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

app.use('/auth', authRouter);
app.use('/', mockRouter);

app.get('/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
