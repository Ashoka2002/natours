const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const Apperror = require("../utils/appErrors");
const User = require("../models/userModel");
const Booking = require("../models/bookingModel");

exports.getOverview = catchAsync(async (req, res, next) => {
  // 1) get tours
  const tours = await Tour.find();
  // 2) render template with tours data
  res.status(200).render("overview", {
    title: "All tours",
    tours
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "reviews guides"
  });

  if (!tour) return next(new Apperror("There is no tour with that name", 404));

  res.status(200).render("tour", {
    title: `${tour.name} Tour`,
    tour
  });
});

exports.getLoginForm = (req, res) => {
  res.status(200).render("login", {
    title: "Log into your account"
  });
};

exports.getForgotPasswordForm = (req, res) => {
  res.status(200).render("forgot-password", {
    title: "Forgot password"
  });
};

exports.resetPasswordForm = (req, res) => {
  res.status(200).render("reset-password-form", {
    title: "Password reset"
  });
};

exports.getSignupForm = (req, res) => {
  res.status(200).render("signup", {
    title: "Create new account"
  });
};

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: `${req.user.name.split(" ")[0]}'s account`
  });
};

exports.updateUser = catchAsync(async (req, res) => {
  const { email, name } = req.body;
  const updatedUser = await User.findByIdAndUpdate(req.user.id, { name, email }, { new: true, runValidators: true });

  res.status(200).render("account", {
    title: `${req.user.name.split(" ")[0]}'s account`,
    user: updatedUser
  });
});

exports.getMyTours = catchAsync(async (req, res, next) => {
  const bookings = await Booking.find({ user: req.user.id });
  const tourIds = bookings.map(el => el.tour);
  const tours = await Tour.find({ _id: { $in: tourIds } });

  res.status(200).render("overview", {
    title: "My bookings",
    tours
  });
});

/////// EXPERIMENTAL ///

exports.getMain = catchAsync(async (req, res, next) => {
  res.status(200).render("main");
});
