const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const path = require('path');
const axios = require('axios')
const { logger } = require('../helpers/logger');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const UAParser = require('ua-parser-js');


const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const getCollectedData = async (req, res) => {
    const SQL = `SELECT * FROM links_tracking WHERE link_id = ?`;

    try {
        db.query(SQL, [req.params.id], (err, result) => {
            if (err) {
                logger('Error connecting: ' + err.stack);
                return res.status(500).json({ "error": true, "message": 'Wystąpił problem z połączeniem z bazą danych' });
            }

            if (result.length === 0) {
                db.query(`SELECT * FROM links WHERE id = ?`, [req.params.id], (err, linkResult) => {
                    if (err) {
                        return res.status(500).json({ "error": true, "message": 'Wystąpił problem z połączeniem z bazą danych' });
                    }

                    if (linkResult.length === 0) {
                        return res.status(404).json({ "error": true, "message": "Nie znaleziono takiego linku" });
                    }

                    return res.status(200).json({ "error": false, "redirects": [] });
                });

                return;
            }


            const redirects = result.map((redirect) => {
                return {
                    "user_agent": redirect.user_agent,
                    "user_ip": redirect.user_ip,
                    "isp": redirect.isp,
                    "country": redirect.country,
                    "city": redirect.city,
                    "accept_language": redirect.accept_language,
                    "timezone": redirect.timezone,
                    "sucess_redirect": redirect.sucess_redirect,
                    "referer": redirect.referer,
                    "os": redirect.os,
                    "browser": redirect.browser,
                    "redirect_at": redirect.created_at,
                    "cpu": redirect.cpu,
                    "device_type": redirect.device_type
                }
            });


            return res.status(200).json({ "error": false, "redirects": redirects });
        });
    } catch (err) {
        logger('Unexpected error: ' + err);
        return res.status(500).json({ "error": true, "message": "Wystąpił nieoczekiwany błąd" });
    }
};



module.exports = { getCollectedData }