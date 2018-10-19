const express = require("express");

const app = express();

const api = require("./api/api")
api.setup();


app.get("/", (req, res) => {res.send("API Builder")});

app.listen(3000);