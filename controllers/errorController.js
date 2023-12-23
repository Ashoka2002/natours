const AppError = require("../utils/appErrors");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack
  });
};

const sendErrorPro = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  } else {
    console.error("ERROR!!! 😱", err);

    res.status(500).json({
      status: "error",
      message: "Something went wrong!"
    });
  }
};

function handleCastErrorDB(err) {
  const message = `Invalid ${err.path} ${err.value}`;
  return new AppError(message, 400);
}
function handleDuplicateFieldsDb(err) {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/).at(0);
  const message = `Duplicate field value: ${value}, Please use another value!`;
  return new AppError(message, 400);
}
function handlesValidationErrorDb(err) {
  const errorsMessage = Object.values(err.errors)
    .map((value, i) => `${i + 1}. ${value.message}`)
    .join("/n");
  const message = `Invalid input data: ${errorsMessage}`;
  return new AppError(message, 400);
}

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDb(err);
    if (err.name === "ValidationError") error = handlesValidationErrorDb(err);

    sendErrorPro(error, res);
  }
};
