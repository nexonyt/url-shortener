const mysql = require('mysql');
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const { sha512 } = require('js-sha512');
const redisClient = require('../services/redis/redisClient');

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function tokenValid(linkAlias, timestamp, token) {
    if (!linkAlias || !timestamp || !token) return false;
    const redisKey = `${process.env.REDIS_PREFIX}LINK_PASSWORD_FORWARD_ACCESS_${linkAlias}_${timestamp}`;
    const rawValue = await redisClient.get(redisKey);
    if (!rawValue) return false;

    try {
        const parsedValue = JSON.parse(rawValue);

        if (parsedValue === token) {
            await redisClient.del(redisKey);
            return true;
        }
    } catch (e) {
        if (rawValue === token) {
            await redisClient.del(redisKey);
            return true;
        }
    }
    
    return false;
}

const checkProviderPassword = async (req, res) => {
    const { alias, password } = req.body;
    const SQL = `SELECT hashed_password,extended_link FROM links WHERE short_link = ?`;
    db.query(SQL, [`${alias}`], async (err, result) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Wystąpił problem z połączeniem z bazą danych' });
        } else if (result.length > 0) {
            const hashed_password = result[0].hashed_password;
            const provider_password = password;
            const hash_password = sha512(`{"${process.env.PASSWORD_SECRET_SALT}","${provider_password}"}`);

            if (hashed_password === hash_password) {
                const { alias, token, timestamp } = req.body; 

                const isRedisTokenValid = await tokenValid(alias, timestamp, token);
                console.log(isRedisTokenValid);
                if (!isRedisTokenValid) {
                    return res.status(401).json({ error: true, message: 'Nieprawidłowy token dostępu.' });
                }
                
                return res.status(200).json({ error: false, redirectUrl: result[0].extended_link });
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