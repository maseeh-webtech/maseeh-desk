const mongoose = require("mongoose");
var schemaOptions = {};

const ResidentSchema = new mongoose.Schema(
  {
    name: String,
    kerberos: String, // Note that for non-students, kerberos may not be a real kerberos. Use email
    email: String, // Note that email may or may not be existent. If not, then infer from kerberos
    room: Number,
    current: Boolean,
  },
  schemaOptions
);

// compile model from schema
module.exports = mongoose.model("resident", ResidentSchema);
