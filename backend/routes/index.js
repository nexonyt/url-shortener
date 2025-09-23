const express = require("express");
const cors = require("cors");

const authRoutes = require("./authRoutes");
const linkRoutes = require("./linkRoutes");
const providerRoutes = require("./providerRoutes");
const { forwardLink } = require("../controllers/forwardLinkController");

const router = express.Router();

// globalne CORS
router.use(cors({ origin: "*", credentials: false }));

// endpointy /api
router.use("/api", authRoutes);
router.use("/api", linkRoutes);
router.use("/api", providerRoutes);

// endpointy publiczne poza /api
router.get("/v/:id", forwardLink);

// 404 handler
router.use((req, res) => {
  res.status(404).json({ error: true, message: "Nie znaleziono takiej ścieżki" });
});

// error handler
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Wewnętrzny błąd serwera", details: err.message });
});

module.exports = router;
