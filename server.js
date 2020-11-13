const express = require("express");
const connectDB = require("./src/db/mongoose");
const path = require("path");
const userRouter = require("./src/routers/api/users");
const publicRouter = require("./src/routers/publicRoutes/publicRouter");
var bodyParser = require("body-parser");
let ejs=require('ejs');

const app = express();

// middleware
app.use(express.json({ extended: false }));
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, "./Imagi1")));

// Connect to database
connectDB();

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/index.html"));
});

app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/events.html"));
});

app.get("/contact", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/contact.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/about.html"));
});

app.get("/courses", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/courses.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "./Imagi1/register.html"));
});

app.use("/api/users", userRouter);
app.use("/publicRoutes", publicRouter);

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/Imagi1/views"));
// Define routes
app.use("/api/users", require("./src/routers/api/users"));
//var users = require("./src/routers/api/users.js");
var users = require("./src/routers/api/users.js");
app.use("/",users);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Server is started on port", PORT);
});
