const mysql = require('mysql2/promise');
const db = require('../configs/mysql_connection'); 
const logger = require('../helpers/logger');

const chars = 'abcdefghijklmnopqrstuvwxyz123456789';

const generateRandomAlias = (length = 5) => {
  let alias = '';
  for (let i = 0; i < length; i++) {
    alias += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return alias;
};

const findFreeAlias = async (maxTries = 20, length = 4) => {
 
  try {
    
    const SQL = `SELECT 1 FROM links WHERE short_link = ?`;
    let tries = 0;

    while (tries < maxTries) {
      const alias = generateRandomAlias(length);
      logger('ALIAS_TRY', alias);

      const [rows] = await db.query(SQL, [alias]);

      if (rows.length === 0) {
        logger('ALIAS_FREE', alias);
        return alias;
      }

      tries++;
    }

    throw new Error('Nie znaleziono wolnego aliasu po wielu próbach');
  } catch (err) {
    console.error("Błąd w findFreeAlias:", err);
    throw err;
  } 
};

module.exports = { findFreeAlias };
