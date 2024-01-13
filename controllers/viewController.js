const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");
const Apperror = require("../utils/appErrors");

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

exports.getAccount = (req, res) => {
  res.status(200).render("account", {
    title: `${req.user.name.split(" ")[0]}'s account`
  });
};
