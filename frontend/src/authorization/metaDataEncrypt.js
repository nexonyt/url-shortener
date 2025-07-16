import CryptoJS from "crypto-js";

const SECRET_KEY_RAW = import.meta.env.VITE_AES_SECRET_KEY;
const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_RAW);

// === ENCRYPT ===
export const encryptMetaData = (metaDataObject) => {
  if (!SECRET_KEY_RAW) {
    console.error("Brakuje klucza AES! Sprawdź plik .env");
    return null;
  }

  // 1. Zamiana obiektu na string JSON
  const jsonString = JSON.stringify(metaDataObject);

  // 2. Zamiana stringa na Base64
  const base64Data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonString));

  // 3. Generujemy IV (128-bitowy)
  const iv = CryptoJS.lib.WordArray.random(16);

  // 4. Szyfrujemy Base64
  const encrypted = CryptoJS.AES.encrypt(base64Data, SECRET_KEY, {
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
    iv: iv,
  });

  // 5. Sklejamy IV + ciphertext i kodujemy w Base64
  const combined = iv.clone().concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
};
