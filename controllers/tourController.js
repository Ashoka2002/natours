const Tour = require("../models/tourModel");

// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

exports.getAllTours = async (req, res) => {
  try {
    // console.log(req.query);

    // 1) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ["page", "sort", "limit", "fields"];
    excludeFields.forEach(el => delete queryObj[el]);

    // 2) Advanced Filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    console.log("query ", JSON.parse(queryStr));
    const query = Tour.find(JSON.parse(queryStr));

    // Execute Query
    const tours = await query;
    res.status(200).json({
      status: "success",
      results: tours.length,
      data: { tours }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: "success",
      data: { tour }
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.createTour = async (req, res) => {
  try {
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

exports.updateTour = async (req, res) => {
  try {
    const newUpdatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).send({
      status: "success",
      data: {
        tour: newUpdatedTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).send({
      status: "success",
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message
    });
  }
};
