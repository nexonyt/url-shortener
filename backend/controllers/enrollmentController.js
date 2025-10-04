const mysql = require("mysql2/promise");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { validate } = require("../middlewares/requestValidator");

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

async function enrollmentHandler(req, res) {
  const validationError = validate("enrollment-register", req.body);
  if (validationError) {
    return res.status(400).json(validationError);
  }

  const {
    companyName,
    contactEmail,
    contactName,
    websiteUrl,
    apiUsagePurpose,
    pricingPlan,
    expectedVolume,
    termsAccepted,
    emailNotifications,
    notifyUrl,
  } = req.body;

  const pricingPlans = {
    free: { monthly_request_limit: 10000, hourly_rate_limit: 500 },
    pro: { monthly_request_limit: 100000, hourly_rate_limit: 5000 },
    enterprise: { monthly_request_limit: 1000000, hourly_rate_limit: 25000 },
  };
  const selectedPlan = pricingPlans[pricingPlan] || pricingPlans["free"];

  // 🔐 Wygenerowanie danych uwierzytelniających
  const client_id = crypto.randomBytes(8).toString("hex");
  const client_secret = crypto.randomBytes(16).toString("hex");
  const crc = crypto.randomBytes(4).toString("hex");

  try {
    // ⚡ Hashowanie bcrypt z 8 rundami (kompromis: bezpieczeństwo vs szybkość)
    // 8 rund = ~50-80ms, 10 rund = ~200ms, 12 rund = ~800ms
    const client_secret_hash = await bcrypt.hash(client_secret, 8);

    // 1️⃣ Zapis do links_api_users
    const insertUserSQL = `
      INSERT INTO links_api_users 
      (company_name, contact_email, contact_name, website_url, api_usage_purpose, pricing_plan, expected_volume, terms_accepted, email_notifications, notify_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [userResult] = await db.query(insertUserSQL, [
      companyName,
      contactEmail,
      contactName || null,
      websiteUrl || null,
      apiUsagePurpose,
      pricingPlan,
      expectedVolume || null,
      termsAccepted ? 1 : 0,
      emailNotifications ? 1 : 0,
      notifyUrl || null,
    ]);

    const userId = userResult.insertId;

    // 2️⃣ Zapis do links_credentials
    const insertCredSQL = `
      INSERT INTO links_credentials (api_user_id, client_id, client_secret_hash, crc, created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;

    await db.query(insertCredSQL, [userId, client_id, client_secret_hash, crc]);

    // ✅ Sukces
    return res.status(200).json({
      error: false,
      data: {
        customer_id: userId,
        status: "active",
        pricing_plan: pricingPlan,
        pricing_details: selectedPlan,
        email: contactEmail,
        company_name: companyName,
        authentication: {
          client_id,
          client_secret,
          crc,
          scope: ["create_link", "update_link", "delete_link", "view_stats"],
        },
      },
    });
  } catch (err) {
    console.error("Błąd podczas rejestracji:", err);
    return res.status(500).json({
      error: true,
      message: "Błąd serwera podczas rejestracji",
      details: err.message,
    });
  }
}

function unenrollmentHandler(req, res) {
  try {
    res.status(200).json({ message: "Usunięcie zakończone sukcesem" });
  } catch (err) {
    console.error("Błąd w unenrollmentHandler:", err);
    res.status(500).json({ message: "Błąd serwera", error: err.message });
  }
}

module.exports = { enrollmentHandler, unenrollmentHandler };