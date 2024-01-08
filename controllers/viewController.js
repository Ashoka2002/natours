const Tour = require("../models/tourModel");
const catchAsync = require("../utils/catchAsync");

exports.getOverview = catchAsync(async (req, res) => {
  // 1) get tours
  const tours = await Tour.find();

  // 2) render template with tours data
  res.status(200).render("overview", {
    title: "All tours",
    tours
  });
});

exports.getTour = (req, res) => {
  res.status(200).render("tour", {
    title: "The Hills Adventurer"
  });
};
