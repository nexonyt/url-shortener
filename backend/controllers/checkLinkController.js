const mysql = require('mysql');

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const checkLink = async (req, res) => {
    const { short_link } = req.params;
    const SQL = `SELECT * FROM links WHERE short_link = ?`;
    db.query(SQL, [`${req.params.url}`], (err, result) => {
        if (err) {
            res.status(500).json({ error: true, message: 'Wystąpił problem z połączeniem z bazą danych' });
        } else if (result.length > 0) {
            const statusMap = {
                0: "inactive",
                1: "active",
                2: "expired",
                3: "blocked",
                4: "deleted"
              };
    
              const statusText = statusMap[result[0].status] || "unknown";
            const link = {"short_link":result[0].short_link, "extended_link":result[0].extended_link,"status":statusText};
            res.status(200).json({error: false, data: link });
        } else {
            res.status(404).json({error: true, message: 'Link not found' });
        }
    });
}

module.exports = { checkLink };