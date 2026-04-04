import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
const DB_PATH = process.env.DATABASE_PATH || '/data/condovida.db';

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

const SEED_USERS = [
  { id: '1', name: 'Demo User',         email: 'demo@email.com',    role: 'SINDICO',  unit: '304', block: 'B', avatar: 'D' },
  { id: '2', name: 'Camila Rodrigues',  email: 'camila@email.com',  role: 'RESIDENT', unit: '101', block: 'A', avatar: 'C' },
  { id: '3', name: 'Rafael Souza',      email: 'rafael@email.com',  role: 'RESIDENT', unit: '502', block: 'A', avatar: 'R' },
  { id: '4', name: 'Beatriz Lima',      email: 'beatriz@email.com', role: 'COUNCIL',  unit: '203', block: 'B', avatar: 'B' },
];

const empty = (db.prepare('SELECT COUNT(*) as c FROM users').get() as { c: number }).c === 0;
if (empty) {
  const demoPassword = process.env.DEMO_PASSWORD;
  if (!demoPassword) throw new Error('DEMO_PASSWORD não definida no .env');

  const hash = bcrypt.hashSync(demoPassword, 12);
  const insert = db.prepare(
    'INSERT INTO users (id, name, email, password_hash, role, unit, block, avatar) VALUES (@id, @name, @email, @password_hash, @role, @unit, @block, @avatar)',
  );

  db.transaction(() => {
    for (const u of SEED_USERS) {
      insert.run({ ...u, password_hash: hash });
    }
  })();

  console.log('Banco populado com usuários demo');
}

export default db;
