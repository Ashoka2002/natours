const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");

exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "this route not defined yet"
  });
};

exports.createuser = (req, res) => {
  res.status(500).json({
    status: "error"
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: "error"
  });
};

exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: "error"
  });
};
