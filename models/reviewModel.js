const mongoose = require("mongoose");
const Tour = require("./tourModel");

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, "Review can not be empty"], trim: true, maxLength: 1000 },
    rating: { type: Number, max: 5, min: 1, default: 1 },
    createdAt: { type: Date, default: Date.now() },
    tour: { type: mongoose.Schema.ObjectId, ref: "Tour", required: [true, "Review must belong to a tour"] },
    user: { type: mongoose.Schema.ObjectId, ref: "User", required: [true, "Review must belong to a author"] }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.pre(/^find/, function(next) {
  // this.populate({ path: "tour", select: "name" });
  this.populate({ path: "user", select: "name photo" });
  next();
});

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" }
      }
    }
  ]);

  if (stats.length > 0) {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: stats[0].avgRating,
      ratingsQuantity: stats[0].nRating
    });
  } else {
    await Tour.findByIdAndUpdate(tourId, {
      ratingsAverage: 4,
      ratingsQuantity: 0
    });
  }
};

reviewSchema.post("save", function() {
  //This points to the current review document
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^findByIdAnd/, async function(next) {
  this.r = await this.findOne();
  next();
});

reviewSchema.post(/^findByIdAnd/, async function() {
  await this.r.constructor.calcAverageRatings(this.r.tour);
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
