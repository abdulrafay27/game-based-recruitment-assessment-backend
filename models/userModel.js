const mongoose = require("mongoose");
const mongooseSequence = require("mongoose-sequence")(mongoose); // Pass mongoose to the plugin

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
    },
    date_of_birth: {
      type: Date,
      required: false,
    },
    location: {
      type: String,
      required: false,
    },
    education: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(mongooseSequence, { inc_field: "id" });

const user = mongoose.model("user", userSchema);

module.exports = user;
