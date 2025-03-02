const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const { get } = require('http');
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

const decrementLinkUsage = async (shortLinkId) => {
        console.log(shortLinkId)
        return new Promise((resolve, reject) => {
            const updateSQL = `UPDATE links SET usage_limit = usage_limit - 1 WHERE short_link = "https://nexonstudio.pl/${shortLinkId}"`;
    
            db.query(updateSQL, (err, result) => {
                if (err) {
                    console.error('Błąd aktualizacji liczby użyć:', err);
                    return reject(err);
                }
                console.log(`Zmieniono liczbę użyć linku: ${shortLinkId}`);
                resolve(result);
            });
        });
    };
    


const forwardLink = async (req, res) => {
    const SQL = `SELECT * FROM links WHERE short_link = "https://nexonstudio.pl/${req.params.id}"`;
    try {  
        db.query(SQL, async (err, result) => {
            if (err) {
              console.error('error connecting: ' + err.stack);
              res.status(409).json({"error":true, "message":'Wystąpił problem z połączeniem z bazą danych'});
            }
            else {
                console.log(result)
                if (result.length) {
                    // res.status(200).json({"status":"exists","active":true,"link":result[0].extended_link});
                    // res.status(200).json({"status":"exists","active":true,"link":result[0].extended_link});
                    await decrementLinkUsage(req.params.id);
                    console.log(req.params.id)
                    
                    res.redirect(301, result[0].extended_link);

                }
                else {
                    console.error('Wystąpił błąd:', err);   
                    res.status(404).json({"error":true,"message":"Nie znaleziono takiego linku. ADMIN!: Należy dodać stronę 404"});
                }
            }
          });
    } catch (err) {
        throw Error(err);
    }
}


const createLink = async (req, res) => {
    const mysqlDate = new Date().toISOString().slice(0, 19).replace("T", " ");
    let SQL = "";
    if (req.body.valid_from === undefined || req.body.valid_from === null) {
         SQL = `INSERT INTO links (owner_id, status,short_link,extended_link,expiring,created_at) VALUES ("${req.body.owner}","${req.body.status}", "${req.body.short_link}", "${req.body.extended_link}", "${req.body.expiring}","${mysqlDate}")`;
     } else {
         SQL = `INSERT INTO links (owner_id, status,short_link,extended_link,expiring,valid_from,valid_to,created_at) VALUES ("${req.body.owner}","${req.body.status}", "${req.body.short_link}", "${req.body.extended_link}", "${req.body.expiring}", "${req.body.valid_from}", "${req.body.valid_to}", "${mysqlDate}")`;
     }


    try {
        db.query(SQL, (err, result) => {
            if (err) {
              console.error('error connecting: ' + err.stack);
              res.status(409).json({"error":true, "message":'Wystąpił problem z połączeniem z bazą danych'});
            }
            else res.status(201).json({"status":"created"});
          });
    }
    catch (err) {
        throw Error(err);
    }
}

const getLink = async (req, res) => {
    const SQL = `SELECT * FROM links WHERE short_link = "https://nexonstudio.pl/${req.params.id}"`

    try {
         db.query(SQL, (err, result) => {
            if (err) {
              console.error('error connecting: ' + err.stack);
              res.status(409).json({"error":true, "message":'Wystąpił problem z połączeniem z bazą danych'});
            }
            else {
                if (result.length) {
                  console.log(JSON.parse(JSON.stringify(result[0])));

                  const statusMap = {
                    0: "inactive",
                    1: "active",
                    2: "expired",
                    3: "blocked",
                  };

                  const statusCode = result[0].status;
                  const statusText = statusMap[statusCode] || "unknown";

                  res
                    .status(200)
                    .json({"error":false,"data":{
                        "status": statusText,
                      short_link: `${result[0].short_link}`,
                      extended_link: `${result[0].extended_link}`,
                      expiring: `${result[0].expiring}`,
                    //   owner: `${result[0].owner_id}`,
                      created_at: formatDate(`${result[0].created_at}`),
                      valid_from: formatDate(`${result[0].valid_from}`),
                      stats: {
                        clicks: 0,
                        unique_clicks: 0,
                      }
                    //   valid_to: formatDate(`${result[0].valid_to}`),
                }});
                }
                else {
                    res.status(404).json({"error":true,"message":"Nie znaleziono takiego linku."});
                }
            }
          });
    }
    catch (err) {
        throw Error(err);
    }
    }

module.exports = {hello, getLink,createLink,forwardLink,getLink}