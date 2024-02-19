const crypto = require("crypto");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const catchAsync = require("../utils/catchAsync.js");
const AppError = require("../utils/appErrors.js");
const Email = require("../utils/email.js");

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createAndSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: true
  };

  if (req.secure || req.get("X-Forwarded-Proto") === "https") cookieOptions.secure = true;

  // if (req.get("X-Forwarded-Proto") === "https") {
  //   cookieOptions.secure = true;
  // }

  //Remove password from output
  user.password = undefined;
  res.cookie("jwt", token, cookieOptions);
  res.status(statusCode).json({
    status: "success",
    token,
    data: { user }
  });
};

exports.logout = (req, res) => {
  res.cookie("jwt", "null", { expires: new Date(Date.now() - 10 * 1000), httpOnly: true });
  res.status(200).json({ status: "success" });
};

exports.signup = catchAsync(async (req, res, next) => {
  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    passwordChangedAt: req.body.passwordChangedAt
  });

  const url = `${req.protocol}://${req.get("host")}/me`;
  await new Email(user, url).sendWelcome();

  createAndSendToken(user, 201, req, res);
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
  createAndSendToken(user, 200, req, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  // Getting token and check of it's there
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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
  res.locals.user = user;
  next();
});

// ONLY FOR RENDERED PAGES
exports.isLoggedIn = async (req, res, next) => {
  // Getting token and check of it's there
  if (req.cookies.jwt) {
    try {
      const token = req.cookies.jwt;

      // Verification token
      const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

      // Check if user still exist
      const user = await User.findById(decoded.id);
      if (!user) return next();

      // Check if user changed password after the token was issued
      if (user.isPasswordChanged(decoded.iat)) return next();

      // AT THIS POINT USER LOGGED IN
      res.locals.user = user;
      return next();
    } catch (err) {
      return next();
    }
  }
  next();
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(new AppError("You don't have permission to perform this action", 403));
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // GET USER BASED ON POSTED EMAIL
  console.log(req.body);
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError(`There is no user with ${req.body.email} email address`, 404));

  // GENERATE RANDOM RESET TOKEN
  const resetToken = user.createRandomPasswordToken();
  await user.save({ validateBeforeSave: false });

  // SEND IT TO USER'S EMAIL
  try {
    const resetUrl = `${req.protocol}://${req.get("host")}/reset-password/${resetToken}`;
    await new Email(user, resetUrl).sendPasswordResetEmail();

    res.status(200).json({
      status: "success",
      message: "Token sent to email!"
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.save({ validateBeforeSave: false });

    return next(new AppError("There was an error sending the email, Try again later!", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //Get user based on token
  const encryptedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({ passwordResetToken: encryptedToken, passwordResetExpires: { $gt: Date.now() } });

  //If token has not expired, and there is user, set the new password
  if (!user) return next(new AppError("Invalid token or Expired!", 400));
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  //update changedpasswordAt property for the user
  //Log the user in, send JWT
  createAndSendToken(user, 200, req, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  // Get user from collection
  const user = await User.findById(req.user.id).select("+password");

  //check if current posted password correct
  if (!(await user.isPasswordCorrect(req.body.passwordCurrent, user.password))) {
    return next(new AppError("Your current password is wrong", 404));
  }
  //if so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // log user in send jwt
  createAndSendToken(user, 200, req, res);
});
