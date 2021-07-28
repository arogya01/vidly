require("express-async-errors");
const config = require("config");
const mongoose = require("mongoose");
const Joi = require("joi");
const express = require("express");
const winston = require("winston");
const app = express();
require("./startup/routes")(app);

Joi.objectid = require("joi-objectid")(Joi);

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

process.on("uncaughtException", (ex) => {
  console.log("got an uncaught exception");
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  console.log("got an uncaught exception");
  winston.error(ex.message, ex);
  process.exit(1);
});

mongoose
  .connect("mongodb://localhost/vidly", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("connected to mongodb"))
  .catch((err) => console.error("could not conect to mongodb", err));

const port = process.env.PORT || 300;
app.listen(port, () => console.log(`Listening on port ${port}...`));
