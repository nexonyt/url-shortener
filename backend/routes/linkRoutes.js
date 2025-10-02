const express = require("express");
const router = express.Router();
const { createLink } = require("../controllers/authControllers");
const { updateLink } = require("../controllers/updateLinkController");
const { getCollectedData } = require("../controllers/getCollectedData");
const { checkLink } = require("../controllers/checkLinkController");

router.get("/check-link/:url", checkLink);
router.post("/create-link", createLink);
router.put("/update-link", updateLink);
router.get("/get-collected-data/:id", getCollectedData);

module.exports = router;
