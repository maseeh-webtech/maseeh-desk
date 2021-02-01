const mongoose = require("mongoose");
var schemaOptions = {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
};

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

// virtual field to tell how many packages a given user has checked into them at this point in time.
// need to use .populate("numPackages") in order to access this field.
ResidentSchema.virtual("numPackages", {
  ref: "package",
  localField: "_id",
  foreignField: "resident",
  count: true,
  match: { location: { $ne: "Checked out" } },
});

// compile model from schema
module.exports = mongoose.model("resident", ResidentSchema);
