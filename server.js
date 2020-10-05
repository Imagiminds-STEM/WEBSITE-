const express = require("express");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.send("Api running");
});

app.listen(PORT, () => {
  console.log("Server is started on port", PORT);
});
