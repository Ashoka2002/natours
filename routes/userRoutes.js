const express = require("express");
const {
  getAllusers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  createUser,
  getMe,
  updateUserPhoto,
  resizeUserPhoto
} = require("../controllers/userController");

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout
} = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/logout", logout);
router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.use(protect);

router.patch("/updateMyPassword", updatePassword);
router.patch("/updateMe", updateUserPhoto, resizeUserPhoto, updateMe);
router.delete("/deleteMe", deleteMe);
router.get("/me", getMe, getUser);

router.use(restrictTo("admin"));

router
  .route("/")
  .get(getAllusers)
  .post(createUser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
