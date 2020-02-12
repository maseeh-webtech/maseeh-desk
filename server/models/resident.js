const mongoose = require("mongoose");
var schemaOptions = {};

const ResidentSchema = new mongoose.Schema(
  {
    name: String,
    room: Number,
  },
  schemaOptions
);

// compile model from schema
module.exports = mongoose.model("resident", ResidentSchema);
