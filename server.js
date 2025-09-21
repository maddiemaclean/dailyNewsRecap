require('dotenv').config();
const express = require('express');
const routes = require('./src/users/routes');

const app = express();
const port = process.env.API_PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World");
});


app.use("/api", routes);

app.listen(port, () => {
    console.log('App listening on port ' + port);
});
