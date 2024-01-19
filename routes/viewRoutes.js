const express = require("express");
const { getOverview, getTour, getLoginForm, getAccount, updateUser } = require("../controllers/viewController");
const { isLoggedIn, protect } = require("../controllers/authController");
const { getMyTours } = require("../controllers/viewController");

const router = express.Router();

router.get("/", isLoggedIn, getOverview);
router.get("/login", isLoggedIn, getLoginForm);
router.get("/tour/:slug", isLoggedIn, getTour);
router.get("/me", protect, getAccount);
router.get("/my-tours", protect, getMyTours);
router.post("/update-user-data", protect, updateUser);

module.exports = router;
