const express = require("express");
const app = express();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Api running");
});

app.listen(PORT, () => {
  console.log("Server is started on port", PORT);
});
