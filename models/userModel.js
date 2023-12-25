const crypto = require("crypto");

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
  role: { type: String, enum: ["user", "guide", "lead-guide", "admin"], default: "user" },
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date
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

userSchema.methods.isPasswordChanged = function(JWTTimeStamp) {
  console.log("stamp:", JWTTimeStamp);

  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
    return JWTTimeStamp < changedTimeStamp;
  }

  return false;
};

userSchema.methods.createRandomPasswordToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
