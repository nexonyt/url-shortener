const { v4: uuidv4 } = require('uuid');
const { sha384 } = require('js-sha512');
const mysql = require('mysql');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});


function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (typeof email !== 'string' || !emailRegex.test(email)) {
        return false;
    }
    return true; 
}

const checkExistingEmail = (email) => {
    return new Promise((resolve, reject) => {
        const SQL = `SELECT * FROM links_authorization WHERE email = ?`;

        db.query(SQL, [email], (err, result) => {
            if (err) {
                logger('Error connecting: ' + err.stack);
                return reject(err);
            }
            resolve(result.length > 0);
        });
    });
};


const createAccess = async (req, res) => { 
    const email = req.body.email;


    if (!isValidEmail(email)) {
        return res.status(400).json({ error: true, message: "Podany email jest niepoprawny" });
    }
    else {
        const uuid = uuidv4();
        const hash = sha384(uuid);
        const emailExists = await checkExistingEmail(email);
        if (emailExists) {
            return res.status(409).json({ error: true, message: "Dla podanego e-maila utworzono już klucz API" });
        }
        else {
            const SQL = `INSERT INTO links_authorization (email, password) VALUES ('${email}', '${hash}')`;
            db.query(SQL, (err) => {
            if (err) {
                logger('Error connecting: ' + err.stack);
                return res.status(500).json({ "error": true, "message": 'Wystąpił problem z połączeniem z bazą danych' });
            }
            else {
                return res.status(200).json({"api_key": uuid });
            }
        });

    }
    }
   
}

module.exports = { createAccess }