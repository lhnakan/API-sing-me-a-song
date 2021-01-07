require('dotenv').config();
const express = require('express');

const genresRouter = require('./routers/genresRouter');

const app = express();
app.use(express.json());

app.use("/genres", genresRouter);

module.exports = app;