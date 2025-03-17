const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');
const { get } = require('http');
const {logger} = require('../helpers/logger');
const { authorization } = require('./authorization');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });


  const updateLink = async (req, res) => {

    if (!await authorization(req.headers)) {
      return res.status(401).json({ error: true, message: 'Brak autoryzacji.'
      });
    } 
    const { id, email, ...updateFields } = req.body;
  

    if (!id || !email) {
      return res.status(400).json({ error: true, message: 'ID i email są wymagane.' });
    }
  

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ error: true, message: 'Brak danych do aktualizacji.' });
    }
  
    
    const setClause = Object.keys(updateFields)
      .map(field => `${field} = ?`)
      .join(', ');
  
    const sql = `UPDATE links SET ${setClause} WHERE id = ? AND email = ?`;
  
    const values = [...Object.values(updateFields), id, email];
  
    
    db.query(sql, values, (err, result) => {
      if (err) {
        console.error('Błąd podczas aktualizacji bazy danych:', err.stack);
        return res.status(500).json({ error: true, message: 'Błąd serwera.' });
      }
  
      if (result.affectedRows === 0) {
        return res.status(401).json({ error: true, message: 'Brak autoryzacji, e-mail lub ID jest błedny.' });
      }
  
      res.status(200).json({ error: false, message: 'Link został zaktualizowany.' });
    });
  };
  
  module.exports = { updateLink };
  