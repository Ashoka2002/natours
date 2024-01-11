const express = require("express");
const { getOverview, getTour, getLoginForm } = require("../controllers/viewController");
const { protect } = require("../controllers/authController");

const router = express.Router();

router.get("/", getOverview);
router.get("/login", getLoginForm);
router.get("/tour/:slug", protect, getTour);

module.exports = router;
