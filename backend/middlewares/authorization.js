const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const db = require('../configs/mysql_connection');
const { createClient } = require("redis");
const path = require('path');
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '../.env') })


//
// Redis
//
const redisClient = createClient({
  url: process.env.REDIS_CONNECTION
});

redisClient.connect();

//
// WALIDACJA PARTNERA
//
async function validatePartner(clientId, clientSecret) {

  const [rows] = await db.query(
    "SELECT client_id, client_secret_hash FROM links_credentials WHERE client_id = ?",
    [clientId]
  );

  if (rows.length === 0) return null;

  const partner = rows[0];


  const isValid = await bcrypt.compare(clientSecret, partner.client_secret_hash);

  return isValid ? { clientId: partner.client_id } : null;
}
//
// TOKENY
//
function generateAccessToken(client) {
  return jwt.sign(
    {
      clientId: client.clientId,
      type: "access",
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

async function generateRefreshToken(client) {
  const token = jwt.sign(
    {
      clientId: client.clientId,
      type: "refresh",
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );

  // zapisz refresh token do Redis (TTL 7 dni)
  await redisClient.set(token, client.clientId, { EX: 60 * 60 * 24 * 7 });

  return token;
}

async function refreshAccessToken(refreshToken) {
  try {
    const exists = await redisClient.get(refreshToken);
    if (!exists) return null;

    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    return generateAccessToken({ clientId: payload.clientId });
  } catch (err) {
    return null;
  }
}

async function revokeRefreshToken(refreshToken) {
  await redisClient.del(refreshToken);
}

//
// MIDDLEWARE
//
function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ message: "Brak tokena" });

  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ message: "Token niepoprawny" });
    req.client = payload;
    next();
  });
}

//
// HANDLERY ENDPOINTÓW
//
async function handleToken(req, res) {
  try {
    const { grant_type, client_id, client_secret } = req.body;

    // Sprawdź grant_type
    if (grant_type !== "client_credentials") {
      return res.status(400).json({ 
        error: "unsupported_grant_type",
        error_description: "Obsługiwany tylko grant_type: client_credentials"
      });
    }

    // Sprawdź czy podano wymagane pola
    if (!client_id || !client_secret) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Wymagane pola: client_id, client_secret"
      });
    }

    // Walidacja partnera
    const client = await validatePartner(client_id, client_secret);
    if (!client) {
      return res.status(401).json({
        error: "invalid_client",
        error_description: "Nieprawidłowe dane uwierzytelniające"
      });
    }

    // Wygeneruj tokeny
    const accessToken = generateAccessToken(client);
    const refreshToken = await generateRefreshToken(client);

    res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: "Bearer",
      expires_in: 900, // 15 minut
      scope: "read"
    });

  } catch (error) {
    console.error("Błąd w handleToken:", error);
    res.status(500).json({
      error: "server_error",
      error_description: "Błąd wewnętrzny serwera"
    });
  }
}

async function handleRefresh(req, res) {
  try {
    const { grant_type, refresh_token } = req.body;

    // Sprawdź grant_type
    if (grant_type !== "refresh_token") {
      return res.status(400).json({
        error: "unsupported_grant_type",
        error_description: "Obsługiwany tylko grant_type: refresh_token"
      });
    }

    // Sprawdź czy podano refresh_token
    if (!refresh_token) {
      return res.status(400).json({
        error: "invalid_request",
        error_description: "Wymagane pole: refresh_token"
      });
    }

    // Odśwież token
    const newAccessToken = await refreshAccessToken(refresh_token);
    if (!newAccessToken) {
      return res.status(401).json({
        error: "invalid_grant",
        error_description: "Nieprawidłowy lub wygasły refresh token"
      });
    }

    res.json({
      access_token: newAccessToken,
      token_type: "Bearer",
      expires_in: 900, // 15 minut
      scope: "read"
    });

  } catch (error) {
    console.error("Błąd w handleRefresh:", error);
    res.status(500).json({
      error: "server_error",
      error_description: "Błąd wewnętrzny serwera"
    });
  }
}

//
// EXPORTY
//
module.exports = {
  validatePartner,
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
  authenticateAccessToken,
  handleToken,
  handleRefresh,
};