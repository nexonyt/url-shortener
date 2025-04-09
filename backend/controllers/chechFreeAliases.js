const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

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

  return new Promise((resolve, reject) => {
    let tries = 0;

    const tryAlias = () => {
      if (tries >= maxTries) {
        return reject(new Error('Nie znaleziono wolnego aliasu po wielu próbach'));
      }

      const alias = generateRandomAlias(length);
      const fullUrl = `https://nexonstudio.pl/${alias}`;

      db.query(SQL, [fullUrl], (err, result) => {
        if (err) return reject(err);

        if (result.length > 0) {
          tries++;
          tryAlias(); // spróbuj kolejnego
        } else {
          resolve(alias); // znaleziono wolny
        }
      });
    };

    tryAlias();
  });
};

module.exports = { findFreeAlias };
