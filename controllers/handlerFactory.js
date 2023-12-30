const AppError = require("../utils/appErrors");
const catchAsync = require("../utils/catchAsync");

exports.deleteOne = Model =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) return next(new AppError("No document found with that ID!", 404));

    res.status(204).send({
      status: "success",
      data: null
    });
  });
