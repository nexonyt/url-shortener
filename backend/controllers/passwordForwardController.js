const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { sha512 } = require('js-sha512');

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const checkProviderPassword = async (req, res) => {
    const { alias,signature,password,browser_token } = req.body;
    const SQL = `SELECT hashed_password,extended_link FROM links WHERE short_link = ?`;
    db.query(SQL, [`${alias}`], (err, result) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Wystąpił problem z połączeniem z bazą danych' });
        } else if (result.length > 0) {
            const hashed_password = result[0].hashed_password;
            const provider_password = password;
            const hash_password = sha512(`{"${process.env.PASSWORD_SECRET_SALT}","${provider_password}"}`);

            if (hashed_password === hash_password) {
                res.status(200).json({error: false, valid: true, redirectUrl: `${result[0].extended_link}` });
            }
            else {
                res.status(401).json({error: true, valid: false, message: 'Nieprawidłowe hasło.' });
            }
        } else {
            res.status(404).json({error: true, message: 'Nie znaleziono linku.' });
        }
    });
}

module.exports = { checkProviderPassword };