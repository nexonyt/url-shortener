const jwt = require("jsonwebtoken");

function authorize(headers) {
  const authHeader = headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return { error: true, status: 401, message: "Brak tokena" };
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    return { error: false, client: payload };
  } catch (err) {
    return { error: true, status: 403, message: "Token niepoprawny lub wygasł" };
  }
}

module.exports = { authorize };
