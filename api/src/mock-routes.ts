import { Router, Request, Response } from 'express';
import { handleMockRequest } from '../../frontend/src/mocks/handlers.js';
import { requireAuth } from './auth.js';

export const mockRouter = Router();

// Todas as rotas abaixo exigem JWT válido
mockRouter.use(requireAuth);

mockRouter.all('*', (req: Request & { userId?: string }, res: Response) => {
  const method = req.method;
  const url = req.path + (Object.keys(req.query).length ? '?' + new URLSearchParams(req.query as Record<string, string>).toString() : '');

  try {
    const result = handleMockRequest(method, url, req.body);
    return res.json(result);
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string };
    return res.status(e.status ?? 500).json({ message: e.message ?? 'Erro interno' });
  }
});
