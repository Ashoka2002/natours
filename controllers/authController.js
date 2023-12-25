const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appErrors.js");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  const token = signToken(user._id);

  res.status(201).json({
    status: "success",
    token,
    data: { user }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //CHECK IF EMAIL AND PASSWORD EXIST
  if (!email || !password) {
    return next(new AppError("Please provide email and password", 400));
  }

  //CHECK IF USER EXIST AND PASSWORD IS CORRECT

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.isPasswordCorrect(password, user.password)))
    return next(new AppError("Incorrect password or email", 401));

  //IF EVERYTHING OK THEN SEND JWT TOKEN

  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return next(new AppError("Please log-in to get access!!", 401));

  // Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // Check if user still exist
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError("The user belonging to this token does no longer exist.", 401));

  // Check if user changed password after the token was issued
  if (user.isPasswordChanged(decoded.iat))
    return next(new AppError("User recently changed password! Please log in again", 401));

  // GRANT ACCESS
  req.user = user;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You don't have permission to perform this action", 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // GET USER BASED ON POSTED EMAIL
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(`There is no user with ${req.body.email} email address`, 404));

  // GENERATE RANDOM RESET TOKEN
  const resetToken = user.createRandomPasswordToken();
  await user.save({ validateBeforeSave: false });
  res.send(resetToken);

  // SEND IT TO USER'S EMAIL
});

exports.resetPassword = (req, res, next) => {};
