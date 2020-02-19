const mongoose = require("mongoose");
var schemaOptions = {
  timestamps: {
    createdAt: "checkedInTime",
  },
};

const PackageSchema = new mongoose.Schema(
  {
    resident: { type: mongoose.Schema.Types.ObjectId, ref: "resident" },
    location: String,
    checkedInBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    trackingNumber: String,
    checkedOutBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    checkedOutTime: Date,
  },
  schemaOptions
);

// compile model from schema
module.exports = mongoose.model("package", PackageSchema);
