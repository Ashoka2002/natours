const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

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

exports.createTour = async (req, res) => {
  try {
    console.log(req.body);
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: "success",
      data: { tour: newTour }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
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
