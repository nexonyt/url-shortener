const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const checkAvailable = async (req, res) => {
    const { short_link } = req.params;
    const SQL = `SELECT id FROM links WHERE short_link = ?`;
    db.query(SQL, [`${req.params.url}`], (err, result) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Wystąpił problem z połączeniem z bazą danych' });
        } else if (result.length == 0) {
            res.status(200).json({"available": true });
        } else {
            res.status(403).json({"available": false });
        }
    });
}

module.exports = { checkAvailable };