const express = require("express");
const router = express.Router();
const { getLink, createLink } = require("../controllers/authControllers");
const { updateLink } = require("../controllers/updateLinkController");
const { getCollectedData } = require("../controllers/getCollectedData");

router.get("/check-link/:url", getLink);
router.post("/create-link", createLink);
router.put("/update-link", updateLink);
router.get("/get-collected-data/:id", getCollectedData);

module.exports = router;
