const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'edenx.db');
const db = new sqlite3.Database(dbPath);

db.get('SELECT COUNT(*) as count FROM users', [], (err, row) => {
  if (err) {
    console.error('Erro no banco:', err);
  } else {
    console.log('Usuários no banco:', row.count);
  }
  db.close();
});