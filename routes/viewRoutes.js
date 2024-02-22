const express = require("express");
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUser,
  getSignupForm,
  getForgotPasswordForm,
  resetPasswordForm,
  getMain
} = require("../controllers/viewController");
const { isLoggedIn, protect } = require("../controllers/authController");
const { getMyTours } = require("../controllers/viewController");

const router = express.Router();

router.get("/", getMain);
router.get("/overview", isLoggedIn, getOverview);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/forgot-password", isLoggedIn, getForgotPasswordForm);
router.get("/reset-password/:resetToken", isLoggedIn, resetPasswordForm);
router.get("/signup", isLoggedIn, getSignupForm);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);
router.post("/update-user-data", protect, updateUser);

module.exports = router;
