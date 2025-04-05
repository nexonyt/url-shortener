const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const pool = require('./pool');
const logger2 = require('../helpers/logger_new');

const path = require('path');
const axios = require('axios')

const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })
const UAParser = require('ua-parser-js');
const { authorization } = require('./authorization');

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const getCollectedData = async (req, res) => {
    if (!await authorization(req.headers)) {
        // logger2.error("Brak autoryzacji").feature("authorization").component("auth");
        // logger2.info('Użytkownik dodał produkt do koszyka', {
        //     userId: '12345',
        //     productId: '67890',
        //     quantity: 2
        //   });
        //   logger2.info('Uwaga');
        logger2.feature('authorization').component('auth').info('Autoryzacja uzyskana');
        return res.status(401).json({ error: true, message: 'Brak autoryzacji.'
        });
      } 

    const SQL = `SELECT links_tracking.*,email FROM links_tracking join links on links.id = links_tracking.link_id WHERE link_id = ? AND email = ?`;

    try {
        const authHeader = req.headers.authorization;
        const base64Credentials = authHeader.split(" ")[1]; // Pobranie zakodowanej części
        const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
        const [email, uuid] = credentials.split(":");

        pool.query(SQL, [req.params.id,email], (err, result) => {
            if (err) {
                // db.end()
                logger('Error connecting: ' + err.stack);
                return res.status(500).json({ "error": true, "message": 'Wystąpił problem z połączeniem z bazą danych' });
            }

            if (result.length === 0) {
                pool.query(`SELECT * FROM links WHERE id = ?`, [req.params.id], (err, linkResult) => {
              
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

            logger2.info("Test")
            logger2.error("Test")
            logger2.error("Test")
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


            // db.end();
            return res.status(200).json({ "error": false, "redirects": redirects });
        });
    } catch (err) {
        logger('Unexpected error: ' + err);
        return res.status(500).json({ "error": true, "message": "Wystąpił nieoczekiwany błąd" });
    }
};




module.exports = { getCollectedData }