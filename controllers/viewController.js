const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

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
  if (!req.params) {
    res.status(404).send("404 not found");
  }

  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "reviews guides"
  });

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
