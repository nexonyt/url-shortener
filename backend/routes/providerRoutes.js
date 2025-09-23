const express = require("express");
const router = express.Router();
const { isActive } = require("../controllers/isActiveController");
const { checkLink } = require("../controllers/checkLinkController");
const { checkAvailable } = require("../controllers/checkAvailableController");
const { logExternalEntry } = require("../controllers/logExternalEntry");
const { checkProviderPassword } = require("../controllers/passwordForwardController");

router.get("/is-active", isActive);
router.get("/check-available/:url", checkAvailable);
router.get("/check-link/:url", checkLink);
router.post("/log-external-entry", logExternalEntry);
router.post("/password/redirect-confirmation", checkProviderPassword);

module.exports = router;
