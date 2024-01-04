const express = require("express");
const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  getTourWithin,
  getDistances
} = require("../controllers/tourController");
const { protect, restrictTo } = require("../controllers/authController");
// const { createReview } = require("../controllers/reviewController");
const reviewRouter = require("./reviewRoutes");

const router = express.Router();

router.use("/:tourID/reviews", reviewRouter);

router.route("/top-5-cheap").get(aliasTopTours, getAllTours);
router.route("/tour-stats").get(getToursStats);
router.route("/monthly-plan/:year").get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

router.route("/tours-within/:distance/center/:latlng/unit/:unit").get(getTourWithin);
router.route("/distances/:latlng/unit/:unit").get(getDistances);

router
  .route("/")
  .get(getAllTours)
  .post(protect, restrictTo("admin", "lead-guide"), createTour);
router
  .route("/:id")
  .get(getTour)
  .patch(protect, restrictTo("admin", "lead-guide"), updateTour)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// router.route("/:tourID/reviews").post(protect, restrictTo("user"), createReview);

module.exports = router;
