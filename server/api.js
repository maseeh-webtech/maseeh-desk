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
const User = require("./models/user");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

// Auth middleware
const isAdmin = (req, res, next) => {
  if (!req.user || !req.user.admin) {
    res.status(403).send({ msg: "Admin permissions required" });
  } else {
    next();
  }
};

const isDeskWorker = (req, res, next) => {
  if (!req.user || !req.user.deskworker) {
    res.status(403).send({ msg: "Desk worker permissions required" });
  } else {
    next();
  }
};

router.get("/packages", [isDeskWorker], (req, res) => {
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

router.post("/checkin", [isDeskWorker], (req, res) => {
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

router.post("/checkout", [isDeskWorker], (req, res) => {
  // Delete old packages after 3 months of being checked out
  const expireTime = new Date(Date.now());
  expireTime.setMonth(expireTime.getMonth() + 3);
  Package.findByIdAndUpdate(req.body._id, { location: "Checked out", expireAt: expireTime })
    .then((updatedPackage) => {
      res.send(updatedPackage);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({});
    });
});

router.get("/residents", [isDeskWorker], (req, res) => {
  Resident.find({}).then((residents) => res.send(residents));
});

router.post("/residents", [isDeskWorker], (req, res) => {
  const newResident = new Resident({
    name: req.body.name,
    room: req.body.room,
  });
  newResident
    .save()
    .then((savedResident) => {
      res.send(savedResident);
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send({});
    });
});

router.get("/users", [isAdmin], (_req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({});
    });
});

router.post("/user/admin", [isAdmin], (req, res) => {
  if (!req.user || !req.user.admin) {
    res.status(403).send({ msg: "Admin permissions required" });
    return;
  }
  User.findByIdAndUpdate(req.body.id, { admin: req.body.admin })
    .then((user) => res.send(user))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({});
    });
});

router.post("/user/deskworker", [isAdmin], (req, res) => {
  User.findByIdAndUpdate(req.body.id, { deskworker: req.body.deskworker })
    .then((user) => res.send(user))
    .catch((err) => {
      logger.error(err);
      res.status(500).send({});
    });
});

router.post("/user/delete", [isAdmin], (req, res) => {
  User.findByIdAndDelete(req.body.id)
    .then(() => {
      res.send({ success: true });
    })
    .catch(() => res.send({ success: false }));
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  logger.warn(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
