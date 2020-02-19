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
const Resident = require("./models/resident");
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
  Package.find({})
    .populate("resident")
    .populate("checkedInBy")
    .then((packages) => res.send(packages));
});

router.post("/checkin", (req, res) => {
  logger.info("posting package");
  Resident.findOne({ kerberos: req.body.kerberos }).then((resident) => {
    const newPackage = new Package({
      resident: resident,
      location: req.body.location,
      trackingNumber: req.body.trackingNumber,
      checkedInBy: req.user.id,
    });
    newPackage
      .save()
      .populate("checkedInBy")
      .then((savedPackage) => {
        logger.info(`Checked in package: ${savedPackage}`);
        res.send(savedPackage);
      })
      .catch((err) => logger.error(err));
  });
});

router.post("/checkout", (req, res) => {
  logger.info("checking out package");
  Package.findByIdAndUpdate(req.body._id, { location: "Checked out" }).then((updatedPackage) => {
    res.send(updatedPackage);
  });
});

router.get("/residents", (req, res) => {
  Resident.find({}).then((residents) => res.send(residents));
});

router.post("/residents", (req, res) => {
  logger.info("posting resident");
  const newResident = new Resident({
    name: req.body.name,
    room: req.body.room,
  });
  newResident.save().then((savedResident) => {
    logger.info(`Added new resident: ${savedResident}`);
    res.send(savedResident);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  logger.warn(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
