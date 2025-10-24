const { decryptMetaDataObject } = require("../helpers/metaDataDecoder");
const { sha512 } = require("js-sha512");

const oddDigits = ["1", "3", "5", "7", "9"];

function validateBrowserRequest(req) {
  const { "x-request-id": requestId, "x-control-sum": controlSum, "x-time": time } = req.headers;

  if (!req.body.signature || !requestId || !controlSum) {
    return { error: true, message: "Brak wymaganych nagłówków lub signature" };
  }

  const decoded = decryptMetaDataObject(req.body.signature);
  if (!decoded) return { error: true, message: "Niepoprawne signature" };


  const signToCompare = sha512(`{"time":"${time}","key":"${process.env.SIGN_KEY}","fingerprintHash":"${decoded.fingerprint.canvasHash}"}`);

  if (req.body.sign !== signToCompare) return { error: true, message: "Błąd autoryzacji frontendu z backendem" };


  const expectedControlSum = requestId.slice(0, 4) + decoded.uniqueNumber + signToCompare.slice(-4);
  if (controlSum !== expectedControlSum) return { error: true, message: "Niepoprawne controlSum" };


  if (!oddDigits.includes(requestId[3])) return { error: true, message: "Niepoprawna cyfra na 4 miejscu x-request-id" };
  if (requestId[6] !== "9") return { error: true, message: "Cyfra na 7 miejscu x-request-id musi być 9" };

  return { error: false, decoded };
}

module.exports = { validateBrowserRequest };
