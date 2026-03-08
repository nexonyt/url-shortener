const express = require("express");
const router = express.Router();
const { createLink } = require("../controllers/authControllers");
const { updateLink } = require("../controllers/updateLinkController");
const { getCollectedData } = require("../controllers/getCollectedData");
const { checkLink } = require("../controllers/checkLinkController");
const { deleteLinkRequest, deleteLinkConfirmation } = require("../controllers/deleteLinkController");
const { getLinkStatistics } = require("../controllers/statistics/LinkStatisticsController");

router.get("/check-link/:url", checkLink);
router.post("/create-link", createLink);
router.put("/update-link", updateLink);
router.get("/get-collected-data/:id", getCollectedData);
router.delete("/delete-link/request", deleteLinkRequest);
router.patch("/delete-link/confirmation", deleteLinkConfirmation);
router.get("/get-link-statistics/:alias", getLinkStatistics)

module.exports = router;
