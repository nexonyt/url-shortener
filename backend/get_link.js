const express = require('express');
const app = express();
const PORT = 3000;

app.get('/api/getlink', (req, res) => {
    const linkId = req.params.id;

    res.status(200).json({
        "status":"exists",
        "active":true
    });
});

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
