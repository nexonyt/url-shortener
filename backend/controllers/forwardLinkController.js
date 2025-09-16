const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const path = require("path");
const axios = require("axios");
const logger = require("../helpers/logger");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const UAParser = require("ua-parser-js");
const { discordSender } = require("../helpers/discordNotifications.js");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

const decrementLinkUsage = async (shortLinkId) => {
  // console.log(shortLinkId);
  return new Promise((resolve, reject) => {
    const updateSQL = `UPDATE links SET usage_limit = usage_limit - 1 WHERE short_link = "${shortLinkId}"`;

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

const addTrackingToDB = async (linkData, collectedUserInfo, status) => {
  const SQL = `INSERT INTO links_tracking (link_id,user_agent,user_ip,isp,country,city,accept_language,timezone,sucess_redirect,referer,os,browser,created_at,cpu,device_type) VALUES ('${
    linkData.id
  }','${collectedUserInfo.userAgent}','${collectedUserInfo.ip}','${
    collectedUserInfo.geo.isp
  }','${collectedUserInfo.geo.country}','${collectedUserInfo.geo.city}','${
    collectedUserInfo.acceptLanguage
  }','${collectedUserInfo.geo.timezone}',${status},'${
    collectedUserInfo.referer
  }','${
    collectedUserInfo.device.os + " " + collectedUserInfo.device.osVersion
  }','${
    collectedUserInfo.device.browser +
    " " +
    collectedUserInfo.device.browserVersion
  }',NOW(),'${collectedUserInfo.device.cpu}','${
    collectedUserInfo.device.deviceType
  }')`;

  db.query(SQL, async (err, result) => {
    console.log(err);
  });
};

const forwardLink = async (req, res) => {
  async function getGeoData(ip) {
    let geoData = {};
    try {
      const response = await axios.get(
        `http://ip-api.com/json/${ip}?fields=status,country,city,timezone,isp,proxy,zip,lat,lon,continent`
      );
      if (response.data.status === "success") {
        geoData = {
          country: response.data.country || "N/A",
          city: response.data.city,
          timezone: response.data.timezone,
          isp: response.data.isp,
          isVpn: response.data.proxy,
          zip: response.data.zip,
          lat: response.data.lat,
          lon: response.data.lon,
          continent: response.data.continent,
        };
      }
    } catch (error) {
      logger("ERROR", "Błąd pobierania geolokalizacji:", error.message);
    }

    return geoData;
  }

  const getDeviceType = (userAgent) => {
    const ua = userAgent.toLowerCase();
    if (/mobile|android|iphone|ipad|ipod/i.test(ua)) return "mobile";
    return "desktop";
  };

  const clientIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  const geoData = await getGeoData(clientIp);
  const userAgent = req.headers["user-agent"];
  const parser = new UAParser(userAgent);
  const deviceInfo = parser.getResult();
  const collectedUserInfo = {
    ip: clientIp,
    userAgent: req.headers["user-agent"],
    referer: req.headers["referer"] || "N/A",
    acceptLanguage: req.headers["accept-language"] || "N/A",
    encoding: req.headers["accept-encoding"] || "N/A",
    cookies: req.headers["cookie"] || "N/A",
    origin: req.headers["origin"] || "N/A",
    geo: {
      country: geoData.country || "N/A",
      city: geoData.city || "N/A",
      timezone: geoData.timezone || "N/A",
      isp: geoData.isp || "N/A",
      isVpn: geoData.proxy || false,
    },
    device: {
      browser: deviceInfo.browser.name || "N/A",
      browserVersion: deviceInfo.browser.version || "N/A",
      os: deviceInfo.os.name || "N/A",
      osVersion: deviceInfo.os.version || "N/A",
      deviceType: getDeviceType(userAgent) || "N/A",
      deviceVendor: deviceInfo.device.vendor || "N/A",
      cpu: deviceInfo.cpu.architecture || "N/A",
    },
  };

  logger("INFO", "Asking DB for redirection link for: " + req.params.id);

  const SQL = `SELECT * FROM links WHERE short_link = "${req.params.id}"`;
  try {
    db.query(SQL, async (err, result) => {
      if (err) {
        console.error("error connecting: " + err.stack);
        res.status(409).json({
          error: true,
          message: "Wystąpił problem z połączeniem z bazą danych",
        });
        logger("Error occured during connecting to DB: " + err);
      } else {
        if (result.length) {
          if (result[0].status == 0) {
            logger(`Link disabled: ${req.params.id}`);
            return res.redirect(
              302,
              process.env.APP_INACTIVE_URL + `/${result[0].short_link}`
            );
          } else {
            await addTrackingToDB(result[0], collectedUserInfo, 1);
            // if czy jest limit i czy nalezy wykonać dekrementacje + jezeli tak to czy jest wiekszy od 0
            if (result[0].usage_limit && result[0].usage_limit <= 0) {
              logger(
                `Link usage limit reached for requested link: ${req.params.id}`
              );
              return res.redirect(
                302,
                process.env.APP_NOT_FOUND_URL + `/${result[0].short_link}`
              );
            } else await decrementLinkUsage(req.params.id);
            logger("INFO", `Redirecting to: ${result[0].extended_link}`);
            console.log("Discord" + process.env.DISCORD_NOTIFICATIONS);
            if (process.env.DISCORD_NOTIFICATIONS == "true") {
              discordSender(result[0].short_link);
            }
            if (result[0].password == 1)
              res.redirect(
                302,
                process.env.APP_PASSWORD_URL + `/${result[0].short_link}`
              );
            else res.redirect(302, result[0].extended_link);
          }
        } else {
          logger("Link not found");
          res.status(404).json({
            error: true,
            message: "No link found for provider URL.",
            data: { requested_webpage: `v/${req.params.id}` },
          });
        }
      }
    });
  } catch (err) {
    logger("ERROR", "Error occured during connecting to DB: " + err);
    throw Error(err);
  }
};

module.exports = { forwardLink };
