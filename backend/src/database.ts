// src/database.ts
import Database from 'better-sqlite3';
import path from 'path';

const dbPath = process.env.DATABASE_PATH || './database.db';
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    age INTEGER NOT NULL,
    hobbies TEXT NOT NULL,
    createdAt TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS friendships (
    user1_id TEXT NOT NULL,
    user2_id TEXT NOT NULL,
    PRIMARY KEY (user1_id, user2_id),
    FOREIGN KEY (user1_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES users(id) ON DELETE CASCADE,
    CHECK (user1_id < user2_id)
  );

  CREATE INDEX IF NOT EXISTS idx_friendships_user1 ON friendships(user1_id);
  CREATE INDEX IF NOT EXISTS idx_friendships_user2 ON friendships(user2_id);
`);

export default db;