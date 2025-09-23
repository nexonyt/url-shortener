// C:\Programowanie\url-shortener\backend\configs\mysql_connection.js
const mysql = require('mysql2/promise');
const logger = require('../helpers/logger');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const mysql_connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,          // brak limitu kolejkowania zapytań
  connectTimeout: 10000,  // 10 sekund timeoutu na połączenie
});

mysql_connection.getConnection()
  .then(conn => {
    logger('DB', 'Połączenie z MySQL działa poprawnie');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Błąd połączenia z MySQL:', err);
  });

module.exports = mysql_connection;
