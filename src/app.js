const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('> success to connect with mongodb database');
  });

app.use(express.json());
app.use(cors());
app.use('/api', routes);

module.exports = app;
