const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require("http");
const cors = require("cors");
const app = express();
app.use(cors({
  origin: 'https://uwemakan.github.io',
  optionsSuccessStatus: 200
}));
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const port = process.env.PORT || 8000;
const users = {};

app.use(
  '/socket.io',
  createProxyMiddleware({
    target: 'https://signals-server.herokuapp.com',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug',
  })
);

io.on("connection", (socket) => {
  if (!users[socket.id]) {
    users[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", users);
  socket.on("disconnect", () => {
    delete users[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(port, () => console.log("server is running on port " + port));
