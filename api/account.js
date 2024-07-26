const express = require("express");
const config = require("config");
const limiter = require("express-rate-limit");
const throttle = config.get("throttle");
const api = express.Router();

const use = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

app = express.Router();

app.get("/", () => {
  console.log("hello world");
});

module.exports = app;
