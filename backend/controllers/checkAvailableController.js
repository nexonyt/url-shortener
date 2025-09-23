const db = require('../configs/mysql_connection'); 
const logger = require('../helpers/logger');

const checkAvailable = async (req, res) => {
  try {
    const { short_link } = req.params;
    logger('REQ', req.params);

    const SQL = `SELECT id FROM links WHERE short_link = ?`;
    const [rows] = await db.query(SQL, [short_link]);

    if (rows.length === 0) {
      res.status(200).json({ available: true });
    } else {
      res.status(403).json({ available: false });
    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: true, message: 'Wystąpił problem z połączeniem z bazą danych' });
  }
};

module.exports = { checkAvailable };