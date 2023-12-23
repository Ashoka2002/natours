const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, "Please tell us you name"] },
  email: {
    type: String,
    required: [true, "Please provide you email address"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"]
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [8, "Password must have 8 character"]
  },

  passwordConfirm: { type: String, required: [true, "Please confirm your password"] }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
