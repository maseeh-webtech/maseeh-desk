const mongoose = require("mongoose"); // library to connect to MongoDB
const logger = require("pino")(); // import pino logger
const csv = require("csvtojson");
const Resident = require("./models/resident");

async function updateResidents() {
  const residents = csv()
    .fromFile("./server/residents.csv")
    .then(async (residents) => {
      for (var i = 0; i < residents.length; i++) {
        resident = residents[i];
        if (resident.Kerberos) {
          const newResident = new Resident({
            name: resident.FirstName + " " + resident.LastName,
            kerberos: resident.Kerberos,
            room: resident.room,
          });

          let savedResident = await newResident.save();
          logger.info(`Added new resident: ${savedResident}`);
          console.log(savedResident);
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
        // updateResidents().catch((err) => logger.error("Error adding residents"));
      })
      .catch((err) => logger.error("Error connecting to MongoDB", err));
  },
};
