const mysql = require('mysql');
const { sha384 } = require('js-sha512');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    });

    const authorization = async (headers) => {
        return new Promise((resolve, reject) => {
            try {
               
                const authHeader = headers.authorization;
                if (!authHeader || !authHeader.startsWith("Basic ")) {
                    return resolve(false);
                }
    
                
                const base64Credentials = authHeader.split(" ")[1]; 
                const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
                const [email, uuid] = credentials.split(":");
    
                
                if (!email || !uuid) {
                    return resolve(false);
                }
    
                const password = sha384(uuid);
    
                const SQL = `SELECT * FROM links_authorization WHERE email = ? AND password = ?`;
                db.query(SQL, [email, password], (err, result) => {
                    if (err) {
                        console.error('Błąd podczas autoryzacji:', err.stack);
                        return reject(err);
                    }
                    if (result.length === 0) {
                        return resolve(false);
                    }
                    resolve(true);
                });


    
            } catch (error) {
                console.error("Błąd autoryzacji:", error);
                return resolve(false);
            }
        });
    };

module.exports = { authorization };