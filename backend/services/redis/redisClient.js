require('dotenv').config();
const { createClient } = require('redis');

const client = createClient({
    url: process.env.REDIS_CONNECTION
});

client.on('error', err => console.error('Redis Client Error', err));

(async () => {
    try {
        await client.connect();
        console.log('Połączono z Redis');
    } catch (err) {
        console.error('Błąd połączenia z Redis:', err);
    }
})();

module.exports = client;