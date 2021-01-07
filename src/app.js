require('dotenv').config();
const express = require('express');

const genresRouter = require('./routers/genresRouter');
const recommendationsRouter = require('./routers/recommendationsRouter')

const app = express();
app.use(express.json());

app.use("/genres", genresRouter);
app.use("/recommendations", recommendationsRouter);

module.exports = app;