const AppError = require("../utils/appErrors");

const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  }
  console.error("ERROR!!! 😱", err);
  return res.status(err.statusCode).render("error", {
    title: "Somthing went wrong!",
    msg: err.message
  });
};

const sendErrorPro = (err, req, res) => {
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    }
    console.error("ERROR!!! 😱", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong!"
    });
  }

  if (err.isOperational) {
    return res.status(err.statusCode).render("error", {
      title: "Somthing went wrong!",
      msg: err.message
    });
  }
  console.error("ERROR!!! 😱", err);
  return res.status(err.statusCode).render("error", {
    title: "Somthing went wrong!",
    msg: "Please try again later"
  });
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

const hadleJWTError = () => new AppError("Invalid token. Please log in again.", 401);
const hadleJWTExpiredError = () => new AppError("Token expired! Please log in again.", 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };
    error.message = err.message;
    if (err.name === "CastError") error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDb(err);
    if (err.name === "ValidationError") error = handlesValidationErrorDb(err);
    if (err.name === "JsonWebTokenError") error = hadleJWTError();
    if (err.name === "TokenExpiredError") error = hadleJWTExpiredError();

    sendErrorPro(error, req, res);
  }
};
