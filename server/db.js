const mongoose = require("mongoose"); // library to connect to MongoDB
const logger = require("pino")(); // import pino logger
const csv = require("csvtojson");
const Resident = require("./models/resident");

async function updateResidents() {
  csv()
    .fromFile("./server/residents.csv")
    .then(async (residents) => {
      logger.info("Adding residents from new list");
      for (var i = 0; i < residents.length; i++) {
        resident = residents[i];
        if (resident.email) {
          const newResident = new Resident({
            name: resident.FirstName + " " + resident.LastName,
            // Remove @mit.edu from email to get kerberos
            kerberos: resident.email.substring(0, resident.email.length - 8),
            room: Number(resident.room),
            current: true,
          });

          let savedResident = await newResident.save().catch((err) => console.log(err));
          logger.info(`Added new resident: ${savedResident}`);
        }
      }
    });
}

module.exports = {
  init: () => {
    // connect to mongodb
    mongoose.set("useFindAndModify", false);
    mongoose
      .connect(process.env.MONGO_CONNECTION_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        logger.info("Server connected to MongoDB");
        // Uncomment the following line to add all residents from server/residents.csv on next
        // server start
        // updateResidents().catch((err) => logger.error(`Error adding residents: ${err}`));
      })
      .catch((err) => logger.error("Error connecting to MongoDB", err));
  },
};
