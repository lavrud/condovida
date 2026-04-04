import db from './db.js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'SINDICO' | 'RESIDENT' | 'COUNCIL' | 'ADMIN';
  unit: string;
  block: string;
  avatar: string;
}

export interface UserRow extends User {
  password_hash: string;
}

const COLUMNS_PUBLIC = 'id, name, email, role, unit, block, avatar';

export function findUserByEmail(email: string): UserRow | undefined {
  return db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
}

export function findUserById(id: string): User | undefined {
  return db.prepare(`SELECT ${COLUMNS_PUBLIC} FROM users WHERE id = ?`).get(id) as User | undefined;
}
