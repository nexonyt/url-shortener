const express = require("express");
const router = express.Router();
const cors = require("cors");
const {loginUser,getLink,createLink} = require('../controllers/authControllers')
const {forwardLink} = require('../controllers/forwardLinkController')
const {updateLink} = require('../controllers/updateLinkController')
const {getCollectedData} = require('../controllers/getCollectedData')
const {createAccess} = require('../controllers/createAccess')
const {isActive} = require('../controllers/isActiveController')
router.use(
  cors({
    credentials: false,
    // origin: "http://localhost:5173",
    origin: '*'
  })
);
// router.post('/login',loginUser)
router.get('/api/is-active', isActive);
router.get('/api/get-link-custom/:url',getLink);
// router.get('/api/get-link-custom/:url',getLinkCustom);
router.post('/api/create-link',createLink);
router.put('/api/update-link',updateLink);
// router.delete('/api/delete-link/:id',deleteLink);
router.get('/v/:id',forwardLink);
router.get('/api/get-collected-data/:id',getCollectedData);
router.post('/api/create-access/api-key',createAccess);

router.use((req, res) => {
    res.status(404).json({ error:true,message: "Nie znaleziono takiej ścieżki" });
});
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Wewnętrzny błąd serwera", details: err.message });
});



module.exports = router;