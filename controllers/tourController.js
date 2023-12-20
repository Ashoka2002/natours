const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: "bad request",
      message: "missing name or price"
    });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success"
    // results: tours.length,
    // data: { tours }
  });
};

exports.getTour = (req, res) => {
  res.status(200).json({
    status: "success"
    // data: { tour }
  });
};

exports.createTour = (req, res) => {
  res.status(201).json({
    status: "success"
    // data: { tour: newTour }
  });
};

exports.updateTour = (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      tour: "<Updated Tour>"
    }
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send({
    status: "success",
    data: null
  });
};
