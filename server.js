require("dotenv").config();
const express = require("express");
const config = require("config");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const throttle = config.get("throttle");
const limiter = require("express-rate-limit");
const port = process.env.SERVER_PORT || 8080;
const api = require("./api");

// Create server
const app = express();

// Use helmet to set content security policy
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        connectSrc: ["'self'", "https://api.stripe.com"],
        frameSrc: [
          "'self'",
          "https://js.stripe.com",
          "https://hooks.stripe.com",
        ],
        childSrc: ["'self'", "https://js.stripe.com"],
        scriptSrc: ["'self'", "https://js.stripe.com"],
        styleSrc: [
          "'self'",
          "https://fonts.googleapis.com",
          "https://js.stripe.com",
        ],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: [
          "'self'",
          `https://${process.env.S3_BUCKET}.s3.eu-west-2.amazonaws.com`,
          "https://*.stripe.com",
          process.env.AVATAR_API,
        ],
        baseUri: ["'self'"],
      },
    },
  })
);

// CORS to only allow verified origins
const opts = { origin: [process.env.CLIENT_URL, process.env.DOMAIN] };
app.use(cors(opts));
app.options("*", cors(opts));

// Point to static build if in staging or production
if (
  process.env.NODE_ENV === "staging" ||
  process.env.NODE_ENV === "production"
) {
  app.use(express.static(path.join(__dirname, "client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname + "/client/build/index.html"));
  });
}

// Global error handling
app.use(function (err, req, res, next) {
  const message = err.raw?.message || err.message || err.sqlMessage || null;
  console.log(err);
  return res.status(500).send({ message: message });
});

// Allow processign of the body
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", 1); // rate limiter proxy

// Import API
app.use("/api/", limiter(throttle.api));
app.use(api);

app.listen(port, () => {
  console.log(`Console log server listening on port ${port}`);
});

module.exports = app;
