const multer = require("multer");
const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appErrors");
const { deleteOne, updateOne, getOne, getAll } = require("./handlerFactory");

const multerStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/img/users");
  },
  filename: (req, file, cb) => {
    // user-userId-timeStamp.jpg
    const ext = file.mimetype.split("/")[1];
    cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  }
});

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not an image! Please upload only image", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.updateUserPhoto = upload.single("photo");

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
  if (req.file) filterdObject.photo = req.file.filename;

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

exports.createUser = catchAsync(async (req, res, next) => {
  res.status(500).json({
    status: "error",
    message: "This route is unavailable, Please use signUp"
  });
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.getAllusers = getAll(User);
exports.getUser = getOne(User);
// DO NOT ATTEMPT TO CHANGE PASSWORD USIGN THIS updateUser HANDLER
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);
