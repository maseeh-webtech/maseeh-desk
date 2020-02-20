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
const Resident = require("./models/resident");
const Package = require("./models/package");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

router.get("/packages", (req, res) => {
  let query;
  if (req.query.noCheckedOut) {
    query = { location: { $ne: "Checked out" } };
  } else {
    query = {};
  }
  Package.find(query)
    .populate("resident")
    .populate("checkedInBy")
    .then((packages) => res.send(packages));
});

router.post("/checkin", (req, res) => {
  // By default, delete old packages after 2 years
  const expireTime = new Date(Date.now());
  expireTime.setMonth(expireTime.getMonth() + 24);
  Resident.findOne({ kerberos: req.body.kerberos }).then((resident) => {
    const newPackage = new Package({
      resident: resident,
      location: req.body.location,
      trackingNumber: req.body.trackingNumber,
      checkedInBy: req.user.id,
      expireAt: expireTime,
    });
    newPackage
      .save()
      // .populate("checkedInBy")
      .then((savedPackage) => {
        res.send(savedPackage);
      })
      .catch((err) => logger.error(err));
  });
});

router.post("/checkout", (req, res) => {
  // Delete old packages after 3 months of being checked out
  const expireTime = new Date(Date.now());
  expireTime.setMonth(expireTime.getMonth() + 3);
  Package.findByIdAndUpdate(req.body._id, { location: "Checked out", expireAt: expireTime }).then(
    (updatedPackage) => {
      res.send(updatedPackage);
    }
  );
});

router.get("/residents", (req, res) => {
  Resident.find({}).then((residents) => res.send(residents));
});

router.post("/residents", (req, res) => {
  const newResident = new Resident({
    name: req.body.name,
    room: req.body.room,
  });
  newResident.save().then((savedResident) => {
    res.send(savedResident);
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  logger.warn(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
