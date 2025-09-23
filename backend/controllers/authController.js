const {
  validatePartner,
  generateAccessToken,
  generateRefreshToken
} = require("../middlewares/authorization");

async function createAccess(req, res) {
  try {
    const { clientId, clientSecret } = req.body;

    if (!clientId || !clientSecret) {
      return res.status(400).json({ message: "Brak clientId lub clientSecret" });
    }

    // sprawdź partnera w MySQL
    const partner = await validatePartner(clientId, clientSecret);
    if (!partner) {
      return res.status(401).json({ message: "Niepoprawne dane uwierzytelniające" });
    }

    // generuj tokeny
    const accessToken = generateAccessToken(partner);
    const refreshToken = await generateRefreshToken(partner);

    return res.json({
      accessToken,
      refreshToken,
      token_type: "Bearer",
      expires_in: 900 // 15 minut w sekundach
    });
  } catch (err) {
    console.error("Błąd w createAccess:", err);
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
}

module.exports = { createAccess };
