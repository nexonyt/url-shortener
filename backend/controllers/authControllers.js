const { authorize } = require("../helpers/authHelper");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");
const path = require("path");
const dotenv = require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});
const crypto = require("crypto");
const { get } = require("http");
const logger = require("../helpers/logger");
const { findFreeAlias } = require("./checkFreeAliases");
const { sha512 } = require("js-sha512");
const { validateBrowserRequest } = require("../middlewares/browserAuthValidator");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});
const util = require("util");
const dbQuery = util.promisify(db.query).bind(db);

const formatDate = (date) => {
  if (date == "null" || date == undefined) return null;
  else return new Date(date).toISOString().slice(0, 19).replace("T", " ");
};


const createLink = async (req, res) => {
  try {

    if (req.headers["authorization"]) {
      const authJWT = authorize(req.headers);
      console.log("Authorization result:", authJWT);
      if (authJWT.error)
        return res.status(authJWT.status).json({ error: true, message: authJWT.message });
    } else if (req.body.browser == true) {
      const result = validateBrowserRequest(req);
      if (result.error) return res.status(400).json({ error: true, message: result.message });
    } else {
      return res.status(401).json({ error: true, message: "Brak wymaganej autoryzacji" });
    }


    // podstawowe sprawdzenia pól
    const requiredFields = ["extended_link"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);
    if (missingFields.length > 0) {
      return res.status(400).json({ error: true, message: `Brak wymaganych pól: ${missingFields.join(", ")}` });
    }

    const secret = process.env.SECRET_PASS_ENCODER ?? "secret";
    const mysqlDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    const defaultValues = {
      email: "not-given",
      password: "NULL",
      tracking: 0,
      status: 1,
      expiring: 0,
      usage_limit: 0,
      notify_url: "NULL"
    };

    const tracking = req.body.tracking ?? defaultValues.tracking;
    const status = req.body.status ?? defaultValues.status;
    const expiring = req.body.expiring ?? defaultValues.expiring;
    const usage_limit = req.body.usage_limit ?? defaultValues.usage_limit;
    const email = req.body.email ?? defaultValues.email;
    let password = req.body.password ?? 0;

    let shortlUrl = req.body.alias ?? null;
    // alias logic (twój kod)...
    if (!shortlUrl) {
      try {
        const alias = await findFreeAlias();
        shortlUrl = alias;
      } catch (err) {
        console.error("Błąd podczas generowania aliasu:", err);
        return res.status(500).json({ error: true, message: "Alias generation failed" });
      }
    } else {
      try {
        const result = await dbQuery(`SELECT COUNT(*) AS count FROM links WHERE short_link = ?`, [shortlUrl]);
        if (result[0].count > 0) {
          logger("ERROR", `Alias already exists: ${shortlUrl}`);
          return res.status(409).json({ error: true, message: "Alias jest już zajęty" });
        }
      } catch (err) {
        logger("ERROR", "Błąd podczas sprawdzania aliasu:", err.message);
        return res.status(500).json({ error: true, message: "Błąd podczas sprawdzania aliasu" });
      }
    }

    let passwordJSON = null;
    if (req.body.password) {
      password = 1;
      passwordJSON = sha512(`{"${process.env.PASSWORD_SECRET_SALT}","${req.body.password}"}`);
    }

    let SQL = "";
    const params = [
      email,
      status,
      shortlUrl,
      req.body.extended_link,
      expiring,
      mysqlDate,
      password,
      passwordJSON,
      tracking,
      usage_limit
    ];

    if (!req.body.valid_from) {
      SQL = `INSERT INTO links (email, status, short_link, extended_link, expiring, created_at, password, hashed_password, tracking,usage_limit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
    } else {
      SQL = `INSERT INTO links (email, status, short_link, extended_link, expiring, valid_from, valid_to, created_at,password,hashed_password, tracking,usage_limit) 
             VALUES (?, ?, ?, ?, ?, ?, ?,?, ?, ?, ?,?)`;
      params.splice(5, 0, req.body.valid_from, req.body.valid_to);
    }


    try {
      await dbQuery(SQL, params);
      return res.status(201).json({
        status: "created",
        short_link: `https://urlpretty.pl/v/${shortlUrl}`,
      });
    } catch (err) {
      logger("ERROR", "Błąd podczas zapisu do bazy:", err.message);
      return res.status(500).json({ error: true, message: "Błąd podczas zapisu do bazy danych" });
    }
  } catch (err) {
    console.error("createLink unexpected error:", err);
    return res.status(500).json({ error: true, message: "server error" });
  }
};


const getLink = async (req, res) => {
  // const auth = authorize(req.headers);
  // console.log("Authorization result:", auth);
  // if (auth.error)
  //   return res.status(auth.status).json({ error: true, message: auth.message });

  // // klient autoryzowany, możesz używać auth.client
  // const client = auth.client;
  // console.log("Authorized client:", client.clientId);

  // console.log(req.params);
  // logger('Asking DB for informations about link: ' + req.params.url);

  const SQL_GET_LINK = `SELECT * FROM links WHERE short_link = ?`;
  const SQL_GET_CLICKS = `SELECT COUNT(*) AS clicks, COUNT(DISTINCT user_ip) AS unique_clicks FROM links_tracking WHERE link_id = ?`;
  const SQL_DAILY_CLICKS = `
      SELECT 
          DATE(created_at) AS click_date, 
          COUNT(*) AS clicks 
      FROM 
          links_tracking 
      WHERE 
          link_id = ? 
      GROUP BY 
          click_date
      ORDER BY 
          click_date ASC
    `;
  const SQL_FIRST_LAST = `
      SELECT 
          MIN(created_at) AS first_click,
          MAX(created_at) AS last_click
      FROM links_tracking
      WHERE link_id = ?
    `;

  try {
    db.query(SQL_GET_LINK, [`${req.params.url}`], (err, result) => {
      if (err) {
        console.error("Error connecting: " + err.stack);
        return res.status(409).json({
          error: true,
          message: "Wystąpił problem z połączeniem z bazą danych",
        });
      }

      if (!result.length) {
        return res
          .status(404)
          .json({ error: true, message: "No link found for provided URL." });
      }

      const linkData = JSON.parse(JSON.stringify(result[0]));

      db.query(SQL_GET_CLICKS, [linkData.id], (err, statsResult) => {
        if (err) {
          console.error("Error fetching stats:", err.stack);
          return res.status(409).json({
            error: true,
            message: "Wystąpił problem z połączeniem z bazą danych",
          });
        }

        const statsData = statsResult[0] || { clicks: 0, unique_clicks: 0 };

        db.query(SQL_DAILY_CLICKS, [linkData.id], (err, dailyClicksResult) => {
          if (err) {
            console.error("Error fetching daily clicks:", err.stack);
            return res.status(409).json({
              error: true,
              message: "Wystąpił problem z połączeniem z bazą danych",
            });
          }

          let daily_clicks = {};
          let most_daily_clicks = { date: null, clicks: 0 };

          dailyClicksResult.forEach((row) => {
            const dayjs = require("dayjs");
            const mysqlDate = dayjs(row.click_date).format("YYYY-MM-DD");
            daily_clicks[mysqlDate] = row.clicks;

            if (row.clicks > most_daily_clicks.clicks) {
              most_daily_clicks = {
                date: mysqlDate,
                clicks: row.clicks,
              };
            }
          });

          db.query(SQL_FIRST_LAST, [linkData.id], (err, timeResult) => {
            if (err) {
              console.error("Error fetching click timestamps:", err.stack);
              return res.status(409).json({
                error: true,
                message: "Wystąpił problem z połączeniem z bazą danych",
              });
            }

            const first_click = formatDate(timeResult[0].first_click);
            const last_click = formatDate(timeResult[0].last_click);

            const statusMap = {
              0: "inactive",
              1: "active",
              2: "expired",
              3: "blocked",
              4: "deleted",
            };

            const statusText = statusMap[linkData.status] || "unknown";
            const responseData = {
              error: false,
              data: {
                id: linkData.id,
                status: statusText,
                short_link: linkData.short_link,
                extended_link: linkData.extended_link,
                expiring: linkData.expiring,
                created_at: formatDate(linkData.created_at),
                remaining_clicks: linkData.usage_limit || "unlimited",
                password: linkData.password,
                tracking: linkData.tracking,
              },
            };
            const validFrom = formatDate(linkData.valid_from);
            const validTo = formatDate(linkData.valid_to);
            const statsResponse = {
              clicks: statsData.clicks,
              unique_clicks: statsData.unique_clicks,
              inactive_clicks: -99,
              expired_clicks: -99,
              first_click,
              last_click,
              daily_clicks,
              most_daily_clicks,
            };
            if (validFrom) responseData.data.valid_from = validFrom;
            if (validTo) responseData.data.valid_to = validTo;
            if (statsResponse) responseData.data.stats = statsResponse;
            res.status(200).json(responseData);
          });
        });
      });
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res
      .status(500)
      .json({ error: true, message: "Wystąpił błąd serwera." });
  }
};

module.exports = { getLink, createLink };
