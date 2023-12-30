const Review = require("../models/reviewModel");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne } = require("./handlerFactory");

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.tourID) filter = { tour: req.params.tourID };

  const reviews = await Review.find(filter);

  res.status(200).json({
    status: "success",
    results: reviews.length,
    data: {
      reviews
    }
  });
});

exports.setTourUserIds = (req, res, next) => {
  //Allow nested routes..
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.tour) req.body.tour = req.params.tourID;

  next();
};

exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);
