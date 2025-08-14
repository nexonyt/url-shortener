const CryptoJS = require("crypto-js");
const path = require("path");
const dotenv = require("dotenv");
// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SECRET_KEY_RAW = process.env.VITE_AES_SECRET_KEY;
const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_RAW);

function decryptMetaData(encryptedBase64) {
  if (!SECRET_KEY_RAW) {
    console.error("Brakuje klucza AES! Sprawdź plik .env");
    return null;
  }

  try {
    const combined = CryptoJS.enc.Base64.parse(encryptedBase64);

    // Pierwsze 16 bajtów to IV
    const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
    const ciphertext = CryptoJS.lib.WordArray.create(
      combined.words.slice(4),
      combined.sigBytes - 16
    );

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext },
      SECRET_KEY,
      {
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
        iv
      }
    );

    return JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
  } catch (err) {
    console.error("Błąd podczas deszyfrowania:", err);
    return null;
  }
}

module.exports = { decryptMetaData };
