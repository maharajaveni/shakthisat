const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'shakthisat.db');
console.log('Database path:', dbPath);

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to open database:', err);
    return;
  }
  
  // List all tables
  db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
    if (err) {
      console.error('Error fetching tables:', err);
      return;
    }
    
    console.log('Found tables:', tables);
    
    // Find target tables (usually 'users' or 'registrations')
    const clearPromises = tables.map((t) => {
      if (t.name === 'sqlite_sequence') return Promise.resolve();
      
      return new Promise((resolve) => {
        db.run(`DELETE FROM ${t.name}`, [], (err) => {
          if (err) {
            console.error(`Failed to clear table ${t.name}:`, err);
          } else {
            console.log(`Successfully cleared table: ${t.name}`);
          }
          resolve();
        });
      });
    });
    
    Promise.all(clearPromises).then(() => {
      // Reset sqlite sequence indices
      db.run("DELETE FROM sqlite_sequence", [], (err) => {
        if (err) {
          console.error('Failed to reset autoincrement sequence:', err);
        } else {
          console.log('Reset all autoincrement sequence indices.');
        }
        db.close(() => {
          console.log('Database operation complete. Connection closed.');
        });
      });
    });
  });
});
