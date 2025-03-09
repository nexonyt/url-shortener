const mysql = require('mysql');
const bcrypt = require('bcrypt');
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

  const decrementLinkUsage = async (shortLinkId) => {
    console.log(shortLinkId);
    return new Promise((resolve, reject) => {
      const updateSQL = `UPDATE links SET usage_limit = usage_limit - 1 WHERE short_link = "https://nexonstudio.pl/${shortLinkId}"`;

      db.query(updateSQL, (err, result) => {
        if (err) {
          console.error("Błąd aktualizacji liczby użyć:", err);
          return reject(err);
        }
        console.log(`Zmieniono liczbę użyć linku: ${shortLinkId}`);
        resolve(result);
      });
    });
  };
      
  
  

const forwardLink = async (req, res) => {

  async function GeoData(ip) {
    try {
        const response = await axios.get(`http://ip-api.com/json/${ip}`);
        return response.data;
    } catch (error) {
        return {};
    }
}
  
  function getClientIP(req) {
    let ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.ip;

    // Obsługa adresu IPv6-Mapped IPv4 (np. ::ffff:188.33.225.246)
    if (ip.includes("::ffff:")) {
        ip = ip.split("::ffff:")[1];
    }

    // Jeśli X-Forwarded-For zawiera wiele IP (np. "192.168.1.1, 203.0.113.5"), weź pierwsze
    if (ip.includes(",")) {
        ip = ip.split(",")[0].trim();
    }

    return ip;
}


  
      const userInfo = {
          ip: getClientIP(req),
          userAgent: req.headers["user-agent"],
          referer: req.headers["referer"] || "N/A",
          acceptLanguage: req.headers["accept-language"] || "N/A",
          encoding: req.headers["accept-encoding"] || "N/A",
          cookies: req.headers["cookie"] || "N/A",
          origin: req.headers["origin"] || "N/A",
          // geo: {
          //     country: geoData.country || "Unknown",
          //     city: geoData.city || "Unknown",
          //     timezone: geoData.timezone || "Unknown",
          //     isp: geoData.isp || "Unknown",
          //     isVpn: geoData.proxy || false,
          // },
          browserInfo: req.body.browserInfo || {},
      };
  
      console.log("📊 Dane użytkownika:", userInfo);
  

    logger('Asking DB for redirection link for: ' + req.params.id);
    const SQL = `SELECT * FROM links WHERE short_link = "https://nexonstudio.pl/${req.params.id}"`;
    try {  
        db.query(SQL, async (err, result) => {
            if (err) {
              console.error('error connecting: ' + err.stack);
              res.status(409).json({"error":true, "message":'Wystąpił problem z połączeniem z bazą danych'});
              logger('Error occured during connecting to DB: ' + err);
            }
            else {
                console.log(result)
                if (result.length) {
                  if (result[0].status == 0) {
                    logger(`Link disabled: ${req.params.id}`);
                    return res.redirect(302, process.env.APP_INACTIVE_URL);
                  } else {
                    // if czy jest limit i czy nalezy wykonać dekrementacje + jezeli tak to czy jest wiekszy od 0
                    if(result[0].usage_limit && result[0].usage_limit <= 0) {
                        logger(`Link usage limit reached for requested link: ${req.params.id}`);
                        return res.redirect(302,process.env.APP_NOT_FOUND_URL);
                    }
                    else 
                    await decrementLinkUsage(req.params.id);
                    logger(`Redirecting to: ${result[0].extended_link}`);
                    res.redirect(302, result[0].extended_link);
                  }
                }
                else {
                    logger('Link not found');   
                    res.status(404).json({"error":true,"message":"No link found for provider URL.", data: {requested_webpage: `https://nexonstudio.pl/v/${req.params.id}`}});
                }
            }
          });
    } catch (err) {
        logger('Error occured during connecting to DB: ' + err);
        throw Error(err);
    }
}

module.exports = {forwardLink}