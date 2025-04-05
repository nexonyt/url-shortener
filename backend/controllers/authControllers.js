const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');
const { get } = require('http');
const {logger} = require('../helpers/logger');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  });

const hello = async (req, res) => {
try {
        res.status(200).json({ message: "cześć" });
}
catch (err) {
    throw Error(err);
}
}

const formatDate = (date) => {
    if (date=="null" || date==undefined) return null;
    else return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};





const createLink = async (req, res) => {
    const mysqlDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    let SQL = "";
    if (req.body.valid_from === undefined || req.body.valid_from === null) {
         SQL = `INSERT INTO links ( email,status,short_link,extended_link,expiring,created_at) VALUES ("${req.body.email}","${req.body.status}", "${req.body.short_link}", "${req.body.extended_link}", "${req.body.expiring}","${mysqlDate}")`;
     } else {
         SQL = `INSERT INTO links (email, status,short_link,extended_link,expiring,valid_from,valid_to,created_at) VALUES ("${req.body.email}","${req.body.status}", "${req.body.short_link}", "${req.body.extended_link}", "${req.body.expiring}", "${req.body.valid_from}", "${req.body.valid_to}", "${mysqlDate}")`;
     }


    try {
        db.query(SQL, (err, result) => {
            if (err) {
              logger('Error connecting: ' + err.stack);
              res.status(409).json({"error":true, "message":'Wystąpił problem z połączeniem z bazą danych'});
            }
            else res.status(201).json({"status":"created"});
          });
          db.end();

    }
    catch (err) {
        throw Error(err);
    }
}

const getLink = async (req, res) => {
  console.log(req.params);
  logger('Asking DB for informations about link: ' + req.params.url);

  const SQL_GET_LINK = `SELECT * FROM links WHERE short_link = ?`;
  const SQL_GET_CLICKS = `SELECT COUNT(*) AS clicks, COUNT(DISTINCT user_ip) AS unique_clicks FROM links_tracking WHERE link_id = ?`;

  try {
      db.query(SQL_GET_LINK, [`https://nexonstudio.pl/${req.params.url}`], (err, result) => {
          if (err) {
              console.error('Error connecting: ' + err.stack);
              return res.status(409).json({ "error": true, "message": 'Wystąpił problem z połączeniem z bazą danych' });
          }

          if (!result.length) {
              return res.status(404).json({ "error": true, "message": "No link found for provided URL." });
          }

          const linkData = JSON.parse(JSON.stringify(result[0]));

         
          db.query(SQL_GET_CLICKS, [linkData.id], (err, statsResult) => {
              if (err) {
                  console.error('Error fetching stats:', err.stack);
                  return res.status(409).json({ "error": true, "message": 'Wystąpił problem z połączeniem z bazą danych' });
              }

              const statsData = statsResult[0] || { clicks: 0, unique_clicks: 0 };

              const statusMap = {
                  0: "inactive",
                  1: "active",
                  2: "expired",
                  3: "blocked",
                  4: "deleted"
              };

              const statusText = statusMap[linkData.status] || "unknown";

              res.status(200).json({
                  "error": false,
                  "data": {
                      id: linkData.id,
                      status: statusText,
                      short_link: linkData.short_link,
                      extended_link: linkData.extended_link,
                      expiring: linkData.expiring,
                      created_at: formatDate(linkData.created_at),
                      valid_from: formatDate(linkData.valid_from),
                      valid_to: formatDate(linkData.valid_to),
                      remaining_clicks: linkData.usage_limit,
                      password: linkData.password,
                      tracking: linkData.tracking,
                      stats: {
                          clicks: statsData.clicks,
                          unique_clicks: statsData.unique_clicks,
                      },
                  }
              });
          });
      });
  } catch (err) {
      console.error("Unexpected error:", err);
      return res.status(500).json({ "error": true, "message": "Wystąpił błąd serwera." });
  }
};


module.exports = {hello, getLink,createLink}