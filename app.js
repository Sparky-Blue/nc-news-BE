process.env.NODE_ENV = process.env.NODE_ENV || "development";
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const DB_URL =
  process.env.DB_URL || require("./config/index").DB_URL[process.env.NODE_ENV];
const apiRouter = require("./routes/api");
mongoose.Promise = Promise;

const app = express();

mongoose
  .connect(DB_URL, { useMongoClient: true })
  .then(() => console.log(`successfully connected to ${DB_URL}`))
  .catch(err => console.log("connection failed", err));

app.use(bodyParser.json());

app.use("/api", apiRouter);

app.use("/", (req, res, next) => {
  res.send("All good!");
});

app.use("/*", (req, res, next) => {
  res.status(404).send("Page not found");
});

app.use((err, req, res, next) => {
  if (err.status === 404) return res.status(404).send("Page not found");
  next(err);
});

app.use((err, req, res, next) => {
  if (err.name === "CastError" || err.name === "ValidationError")
    return next({ status: 400 });
  next(err);
});

app.use((err, req, res, next) => {
  if (err.msg) return res.status(400).send(err.msg);
  next(err);
});

app.use((err, req, res, next) => {
  if (err.status === 400) return res.status(400).send("Invalid input");
  next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error");
});

module.exports = app;
