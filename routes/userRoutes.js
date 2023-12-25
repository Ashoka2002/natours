const express = require("express");

const { getAllusers, getUser, createuser, updateUser, deleteUser } = require("../controllers/userController");
const { signup, login, forgotPassword, resetPassword } = require("../controllers/authController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword", resetPassword);

router
  .route("/")
  .get(getAllusers)
  .post(createuser);

router
  .route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
