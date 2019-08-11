const express = require('express');
const cors = require('cors');
const routes = require('./routes');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  console.log('> new connection with websocket', socket.id);
  const { user } = socket.handshake.query;
  connectedUsers[user] = socket.id;
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('> success to connect with mongodb database');
  });

app.use((request, response, next) => {
  request.io = io;
  request.connectedUsers = connectedUsers;
  return next();
});

app.use(express.json());
app.use(cors());
app.use('/api', routes);

module.exports = server;
