/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
|
| This file defines the routes for the server.
|
*/

const express = require("express");
const logger = require("pino")(); // For logging
const User = require("./models/user");
const Package = require("./models/package");

// add error handling to async endpoints
const { decorateRouter } = require("@awaitjs/express");

// api endpoints: all these paths will be prefixed with "/api/"
const router = decorateRouter(express.Router());

router.getAsync("/example", async (req, res, next) => {
  logger.info("Log Hello World");
  res.send({ hello: "world" });
});

router.get("/packages", (req, res) => {
  // TODO: filter find based on request params
  Package.find({}).then((packages) => {
    res.send(packages);
  });
});

router.post("/packages", (req, res) => {
  const newPackage = new Package({
    resident: req.body.resident,
    location: req.body.location,
    checkedInBy: req.user,
    trackingNumber: req.trackingNumber,
  });
  newPackage.logger.info(`Checked in package: ${savedPackage}`);
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  logger.warn(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
