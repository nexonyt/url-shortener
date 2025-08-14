import CryptoJS from "crypto-js";

const SECRET_KEY_RAW = import.meta.env.VITE_AES_SECRET_KEY;
const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_RAW);

export function encryptMetaData(metaDataObject) {
  if (!SECRET_KEY_RAW) {
    console.error("Brakuje klucza AES! Sprawdź plik .env");
    return null;
  }

  const jsonString = JSON.stringify(metaDataObject);

  const iv = CryptoJS.lib.WordArray.random(16);

  const encrypted = CryptoJS.AES.encrypt(jsonString, SECRET_KEY, {
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
    iv
  });

  // IV + ciphertext (oba w Base64)
  const combined = iv.concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}
