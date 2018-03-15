const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const DB_URL = require("./config/index").DB_URL[process.env.NODE_ENV];
const apiRouter = require("./routes/api");
mongoose.Promise = Promise;

const app = express();

mongoose.connect(DB_URL, err => {
  if (err) console.log({ err });
  else console.log(`Connected to ${DB_URL}`);
});

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/", (req, res, next) => {
  res.send("All good!");
});

app.use("/*", (req, res, next) => {
  res.status(404).send("Page not found");
});
app.use((err, req, res, next) => {
  if (err.status === 404) res.status(404).send("Page not found");
  else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send("Internal server error");
});

module.exports = app;
