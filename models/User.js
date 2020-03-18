const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  colour: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: false
  }

});

module.exports = User = mongoose.model("users", UserSchema);
