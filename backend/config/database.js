const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o banco de dados SQLite
const dbPath = path.join(__dirname, '..', 'edenx.db');

// Criar conexão com SQLite
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('✗ Erro ao conectar ao banco de dados SQLite:', err.message);
  } else {
    console.log('✓ Conexão com banco de dados SQLite estabelecida com sucesso');
  }
});

// Wrapper para manter compatibilidade com o código existente (que usa pool MySQL)
const pool = {
  query: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          console.error('Erro na query:', sql, err);
          reject(err);
        } else {
          resolve({ rows });
        }
      });
    });
  },
  getConnection: () => Promise.resolve(db),
  execute: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) {
          console.error('Erro no execute:', sql, err);
          reject(err);
        } else {
          resolve({ insertId: this.lastID, affectedRows: this.changes });
        }
      });
    });
  }
};

module.exports = pool;
