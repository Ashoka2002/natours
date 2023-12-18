const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, "utf-8"));

exports.checkId = (req, res, next, val) => {
  console.log(req.params);
  console.log("tour id is " + val);
  if (+req.params.id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
};

exports.getTour = (req, res) => {
  const tour = tours.find((el) => el.id === +req.params.id);
  // if (+req.params.id > tours.length)
  // if (!tour)
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "Invalid Id",
  //   });
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

exports.createTour = (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);

  fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), (err) => {
    res.status(201).json({
      status: "success",
      data: { tour: newTour },
    });
    if (err) res.status(500).send("faild");
  });
};

exports.updateTour = (req, res) => {
  res.status(200).send({
    status: "success",
    data: {
      tour: "<Updated Tour>",
    },
  });
};

exports.deleteTour = (req, res) => {
  res.status(204).send({
    status: "success",
    data: null,
  });
};
