const express = require('express');
const app = express();
const PORT = 3000;
app.use(express.json());


app.use("/", require("./routes/router"));

app.listen(PORT, () => {
    console.log(`Serwer działa na http://localhost:${PORT}`);
});
