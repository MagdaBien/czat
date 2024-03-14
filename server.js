const express = require("express");
const path = require("path");

const app = express();

const messages = [];

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "/client/")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/client/index.html"));
});

app.use((req, res) => {
  res.send("error 404");
});

app.listen(8000, () => {
  console.log("Server is running on port: 8000");
});