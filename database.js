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
  // Create submissions table with email and phone
  await run(`
    CREATE TABLE IF NOT EXISTS submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      fullName TEXT NOT NULL,
      email TEXT,
      phone TEXT,
      shakthiResponse TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  // Migration: Add email and phone columns if table exists without them
  try {
    const columns = await all("PRAGMA table_info(submissions)");
    const emailExists = columns.some(col => col.name === 'email');
    if (!emailExists) {
      await run("ALTER TABLE submissions ADD COLUMN email TEXT");
      console.log('Database Migration: Added email column to submissions table.');
    }
    const phoneExists = columns.some(col => col.name === 'phone');
    if (!phoneExists) {
      await run("ALTER TABLE submissions ADD COLUMN phone TEXT");
      console.log('Database Migration: Added phone column to submissions table.');
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
