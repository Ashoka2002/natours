const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    review: { type: String, required: [true, "Review can not be empty"], trim: true, maxLength: 150 },
    rating: { type: Number, max: 5, min: 1, default: 1 },
    createdAt: { type: Date, default: Date.now() },
    tour: [{ type: mongoose.Schema.ObjectId, ref: "Tour", required: [true, "Review must belong to a tour"] }],
    user: [{ type: mongoose.Schema.ObjectId, ref: "User", required: [true, "Review must belong to a author"] }]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;