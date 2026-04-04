import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import { fileURLToPath } from 'url';
import { USERS } from '../../frontend/src/mocks/db.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, '../../condovida.db');

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id          TEXT PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role        TEXT NOT NULL CHECK(role IN ('SINDICO','RESIDENT','COUNCIL','ADMIN')),
    unit        TEXT NOT NULL,
    block       TEXT NOT NULL,
    avatar      TEXT NOT NULL,
    created_at  TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
  )
`);

// Seed demo users se o banco estiver vazio
const empty = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c === 0;
if (empty) {
  const demoPassword = process.env.DEMO_PASSWORD;
  if (!demoPassword) throw new Error('DEMO_PASSWORD não definida no .env');

  const hash = bcrypt.hashSync(demoPassword, 12);
  const insert = db.prepare(
    'INSERT INTO users (id, name, email, password_hash, role, unit, block, avatar) VALUES (@id, @name, @email, @password_hash, @role, @unit, @block, @avatar)',
  );

  db.transaction(() => {
    for (const u of USERS) {
      insert.run({ id: u.id, name: u.name, email: u.email, password_hash: hash, role: u.role, unit: u.unit, block: u.block, avatar: u.avatar });
    }
  })();

  console.log('Banco populado com usuários demo');
}

export default db;
