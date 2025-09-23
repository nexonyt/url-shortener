function simpleDecrypt(encoded, key = 42) {
  const decoded = Buffer.from(encoded, "base64").toString("utf8");
  return decoded
    .split("")
    .map(ch => String.fromCharCode(ch.charCodeAt(0) ^ key))
    .join("");
}

function decryptMetaDataObject(encStr, key = 42) {
  try {
    const json = simpleDecrypt(encStr, key);
    return JSON.parse(json);
  } catch (err) {
    console.error("Failed to decode metaData:", err.message);
    return null;
  }
}

module.exports = { decryptMetaDataObject };
