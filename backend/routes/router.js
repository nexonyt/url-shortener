const express = require("express");
const router = express.Router();
const cors = require("cors");
const {loginUser,getLink,hello,createLink,forwardLink} = require('../controllers/authControllers')



router.use(
  cors({
    credentials: false,
    // origin: "http://localhost:5173",
    origin: '*'
  })
);
// router.post('/login',loginUser)
router.get('/api/getlink/:id',getLink);
router.get('/api/hello', hello);
router.post('/api/create-link',createLink);
router.get('/v/:id',forwardLink);
router.use((req, res) => {
    res.status(404).json({ error:true,message: "Nie znaleziono takiej ścieżki" });
});
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Wewnętrzny błąd serwera", details: err.message });
});



module.exports = router;