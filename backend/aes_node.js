const CryptoJS = require("crypto-js");

const SECRET_KEY_RAW = "marcinmarcinmarc"; // identyczny jak we froncie
const SECRET_KEY = CryptoJS.enc.Utf8.parse(SECRET_KEY_RAW);

function encryptMetaData(metaDataObject) {
  const jsonString = JSON.stringify(metaDataObject);
  const base64Data = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonString));
  const iv = CryptoJS.lib.WordArray.random(16);
  const encrypted = CryptoJS.AES.encrypt(base64Data, SECRET_KEY, {
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
    iv: iv,
  });
  const combined = iv.clone().concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}

function decryptMetaData(encryptedBase64) {
  const combined = CryptoJS.enc.Base64.parse(encryptedBase64);
  const iv = CryptoJS.lib.WordArray.create(combined.words.slice(0, 4), 16);
  const ciphertext = CryptoJS.lib.WordArray.create(
    combined.words.slice(4),
    combined.sigBytes - 16
  );
  const decrypted = CryptoJS.AES.decrypt({ ciphertext }, SECRET_KEY, {
    mode: CryptoJS.mode.CTR,
    padding: CryptoJS.pad.NoPadding,
    iv: iv,
  });
  const base64String = CryptoJS.enc.Latin1.stringify(decrypted);
  const jsonString = CryptoJS.enc.Utf8.stringify(CryptoJS.enc.Base64.parse(base64String));
  return JSON.parse(jsonString);
}

// Test
const original = { foo: "bar", number: 123 };
const encrypted = encryptMetaData(original);
const decrypted = decryptMetaData(encrypted);

console.log({ original, encrypted, decrypted });
