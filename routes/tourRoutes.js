const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
// const { createReview } = require("../controllers/reviewController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:tourID/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(getMonthlyPlan);

router
  .route("/")
  .get(protect, getAllTours)
  .post(createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// router.route("/:tourID/reviews").post(protect, restrictTo("user"), createReview);

module.exports = router;
