import { Database } from "bun:sqlite";

const DB_PATH = "data/sniper.db";

export function initDB() {
  const db = new Database(DB_PATH);
  
  // Create jobs table
  db.run(`
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT UNIQUE,
      title TEXT,
      company TEXT,
      location TEXT,
      salary TEXT,
      description TEXT,
      url TEXT,
      source TEXT,
      status TEXT DEFAULT 'new',
      match_score INTEGER DEFAULT 0,
      match_rationale TEXT,
      relevant_projects TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  return db;
}

export function saveJob(db: Database, job: any) {
  const query = db.prepare(`
    INSERT OR IGNORE INTO jobs (
      external_id, title, company, location, salary, description, url, source
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);
  
  return query.run(
    job.external_id,
    job.title,
    job.company,
    job.location,
    job.salary,
    job.description,
    job.url,
    job.source
  );
}
