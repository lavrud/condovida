import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { findUserByEmail, findUserById, User } from './users.js';

export const authRouter = Router();

interface JwtPayload {
  sub: string;
  role: string;
}

function signTokens(user: User) {
  const secret = process.env.JWT_SECRET!;
  type Expiry = jwt.SignOptions['expiresIn'];
  const accessToken = jwt.sign(
    { sub: user.id, role: user.role } satisfies JwtPayload,
    secret,
    { expiresIn: (process.env.JWT_EXPIRES_IN || '15m') as Expiry },
  );
  const refreshToken = jwt.sign(
    { sub: user.id },
    secret,
    { expiresIn: (process.env.REFRESH_EXPIRES_IN || '7d') as Expiry },
  );
  return { accessToken, refreshToken };
}

// POST /auth/login
authRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ message: 'email e password são obrigatórios' });
  }

  const row = findUserByEmail(email);

  // Mesmo tempo de resposta para e-mail inexistente e senha errada (evita user enumeration)
  const DUMMY_HASH = '$2b$12$aaaaaaaaaaaaaaaaaaaaaa.aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
  const valid = await bcrypt.compare(password, row?.password_hash ?? DUMMY_HASH);

  if (!row || !valid) {
    return res.status(401).json({ message: 'Credenciais inválidas' });
  }

  const { password_hash: _, ...user } = row;
  const tokens = signTokens(user);
  return res.json({ data: { user, ...tokens } });
});

// Middleware para rotas protegidas
export function requireAuth(req: Request & { userId?: string }, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Não autenticado' });
  }

  try {
    const payload = jwt.verify(auth.slice(7), process.env.JWT_SECRET!) as JwtPayload;
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
}

// GET /auth/me
authRouter.get('/me', requireAuth, (req: Request & { userId?: string }, res: Response) => {
  const user = findUserById(req.userId!);
  if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
  return res.json({ data: user });
});
