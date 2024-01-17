const express = require("express");
const { getOverview, getTour, getLoginForm, getAccount, updateUser } = require("../controllers/viewController");
const { isLoggedIn, protect } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");

const router = express.Router();

router.get("/", createBookingCheckout, isLoggedIn, getOverview);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/me", protect, getAccount);
router.post("/update-user-data", protect, updateUser);

module.exports = router;
