const db = require('../configs/mysql_connection');

const chars = 'abcdefghijklmnopqrstuvwxyz123456789';

const generateRandomAlias = (length = 5) => {
  let alias = '';
  for (let i = 0; i < length; i++) {
    alias += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return alias;
};

const findFreeAlias = async (maxTries = 20, length = 4) => {
  const SQL = `SELECT 1 FROM links WHERE short_link = ?`;

  let tries = 0;

  while (tries < maxTries) {
    const alias = generateRandomAlias(length);
    const [rows] = await db.query(SQL, [alias]);

    if (rows.length === 0) {
      return alias; // wolny alias znaleziony
    }

    tries++;
  }

  throw new Error('Nie znaleziono wolnego aliasu po wielu próbach');
};
module.exports = { findFreeAlias };
