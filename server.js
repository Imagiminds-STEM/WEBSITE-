const express = require("express");
const connectDB = require("./src/db/mongoose");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "./Imagi1")));

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/index.html"));
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/events.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/about.html"));
});

app.get("/courses", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/courses.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/contact.html"));
});

// middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/Imagi1"));

// Define routes
//app.use("/api/users", require("./src/routers/api/users"));
var users = require("./src/routers/api/users.js");
app.use("/", users);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is started on port", PORT);
});
