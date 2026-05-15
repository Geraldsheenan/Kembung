import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

type AppDatabase = Database.Database;

let databaseInstance: AppDatabase | null = null;

function ensureDataDirectory() {
  const dataDirectory = path.join(process.cwd(), "data");

  if (!fs.existsSync(dataDirectory)) {
    fs.mkdirSync(dataDirectory, { recursive: true });
  }

  return dataDirectory;
}

function initializeDatabase(database: AppDatabase) {
  database.pragma("journal_mode = WAL");
  database.pragma("foreign_keys = ON");

  database.exec(`
    CREATE TABLE IF NOT EXISTS newsletter_signups (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS contact_messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      source TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

export function getDb() {
  if (!databaseInstance) {
    const dataDirectory = ensureDataDirectory();
    const databasePath = path.join(dataDirectory, "kembunk.sqlite");

    databaseInstance = new Database(databasePath);
    initializeDatabase(databaseInstance);
  }

  return databaseInstance;
}
