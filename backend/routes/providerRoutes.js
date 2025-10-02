const express = require("express");
const router = express.Router();
const { isActive } = require("../controllers/isActiveController");
const { checkLink } = require("../controllers/checkLinkController");
const { checkAvailable } = require("../controllers/checkAvailableController");
const { logExternalEntry } = require("../controllers/logExternalEntry");
const { checkProviderPassword } = require("../controllers/passwordForwardController");
const { getLink } = require("../controllers/authControllers")

router.get("/is-active", isActive);
router.get("/check-available/:url", checkAvailable);
// router.get("/check-link/:url", checkLink);
router.get('/get-link-custom/:url', getLink);
router.post("/log-external-entry", logExternalEntry);
router.post("/password/redirect-confirmation", checkProviderPassword);

module.exports = router;
