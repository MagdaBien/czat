const express = require("express");
const path = require("path");
const socket = require("socket.io");

const app = express();

const messages = [];
const users = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client/")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

app.use((req, res) => {
  res.send("error 404");
});

const server = app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});
const io = socket(server);

io.on("connection", (socket) => {
  console.log("New client! Its id: " + socket.id);

  socket.on("message", (message) => {
    console.log("Oh, I've got something from " + socket.id);
    messages.push(message);
    socket.broadcast.emit("message", message);
  });

  socket.on("join", (userName) => {
    console.log(
      "Oh, I've got something from " + userName + " from socket: " + socket.id
    );
    users.push({ name: userName, id: socket.id });
    socket.broadcast.emit("userJoin", userName);
  });

  socket.on("disconnect", () => {
    console.log("Oh, socket " + socket.id + " has left");
    const userIndex = users.findIndex((user) => user.id == socket.id);
    socket.broadcast.emit("userLeft", users[userIndex].name);
    users.splice(userIndex, 1);
  });

  //console.log("I've added a listener on message and disconnect events \n");
});
