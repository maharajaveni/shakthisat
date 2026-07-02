const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'shakthisat.db');
const db = new sqlite3.Database(dbPath);

function run(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function get(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

function all(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

async function initDb() {
  // Create submissions_school table
  await run(`
    CREATE TABLE IF NOT EXISTS submissions_school (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      schoolName TEXT NOT NULL,
      shakthiResponse TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Create submissions_college table
  await run(`
    CREATE TABLE IF NOT EXISTS submissions_college (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      collegeName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      shakthiResponse TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Create submissions_public table
  await run(`
    CREATE TABLE IF NOT EXISTS submissions_public (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      shakthiResponse TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Migration: Check if old submissions table exists, copy data, and rename/drop it
  try {
    const tableExists = await get("SELECT name FROM sqlite_master WHERE type='table' AND name='submissions'");
    if (tableExists) {
      // Check if table contains data
      const oldRows = await all("SELECT * FROM submissions");
      if (oldRows.length > 0) {
        // Insert into submissions_public (default target for old submissions)
        for (const row of oldRows) {
          const emailVal = row.email || '';
          const phoneVal = row.phone || '';
          await run(
            "INSERT OR IGNORE INTO submissions_public (id, fullName, email, phone, shakthiResponse, createdAt) VALUES (?, ?, ?, ?, ?, ?)",
            [row.id, row.fullName, emailVal, phoneVal, row.shakthiResponse, row.createdAt]
          );
        }
        console.log(`Database Migration: Migrated ${oldRows.length} rows from submissions to submissions_public`);
      }
      await run("DROP TABLE submissions");
      console.log("Database Migration: Dropped old submissions table");
    }
  } catch (err) {
    console.error('Database migration error:', err);
  }

  // Create admins table
  await run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      passwordHash TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  // Seed default superadmin if not exists
  const superadmin = await get('SELECT * FROM admins WHERE username = ?', ['superadmin']);
  if (!superadmin) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash('ShakthiSAT2026!', salt);
    await run('INSERT INTO admins (username, passwordHash, role) VALUES (?, ?, ?)', ['superadmin', hash, 'superadmin']);
    console.log('Seeded default superadmin user.');
  }
}

module.exports = {
  initDb,
  run,
  get,
  all,
  db
};
