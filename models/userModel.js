const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    minlength: [8, "Password must have 8 character"],
    select: false
  },

  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password"],
    validate: {
      //this only works on creating or saveing
      validator: function(el) {
        return el === this.password;
      },
      message: "Passwords are not same!"
    }
  }
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.methods.isPasswordCorrect = async (candidatePassword, encryptedPassword) => {
  return await bcrypt.compare(candidatePassword, encryptedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
