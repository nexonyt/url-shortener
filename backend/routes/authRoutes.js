// router.js
const express = require("express");
const router = express.Router();
const {
  authenticateAccessToken,
  handleToken,
  handleRefresh,
} = require("../middlewares/authorization");

// Endpoint token
router.post("/token", handleToken);

// Endpoint refresh
router.post("/refresh", handleRefresh);

// Chroniony endpoint
router.get("/secure", authenticateAccessToken, (req, res) => {
  res.json({ message: "Chronione dane", client: req.client });
});

module.exports = router;