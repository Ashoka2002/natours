const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");

exports.getAllusers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: "success",
    results: users.length,
    data: { users }
  });
});

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // create Error if user post password data
  if (req.body.password || req.body.passwordConfirm)
    return next(new AppError("This route is not for password updates. Please use /updatePassword.", 400));

  //filtring unwanted fields name that are not allowed to update
  const filterdObject = filterObj(req.body, "name", "email");

  //Update user document
  const updateduser = await User.findByIdAndUpdate(req.user.id, filterdObject, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updateduser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null
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
