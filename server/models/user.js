const mongoose = require("mongoose");
var schemaOptions = {
  toJSON: {
    transform: function (doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
};

const UserSchema = new mongoose.Schema(
  {
    username: String,
    password: String,
    admin: Boolean,
    deskworker: Boolean,
  },
  schemaOptions
);

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
