const express = require("express");

const { getAllusers, getUser, createuser, updateUser, deleteUser } = require("../controllers/userController");
const router = express.Router();

router.route("/").get(getAllusers).post(createuser);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
