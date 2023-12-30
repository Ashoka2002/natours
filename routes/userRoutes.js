const express = require("express");

const {
  getAllusers,
  getUser,
  createuser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe
} = require("../controllers/userController");
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);
router.patch("/updatePassword", protect, updatePassword);
router.patch("/updateMe", protect, updateMe);
router.delete("/deleteMe", protect, deleteMe);

router
  .route("/")
  .get(getAllusers)
  .post(createuser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(protect, restrictTo("admin"), deleteUser);

module.exports = router;
