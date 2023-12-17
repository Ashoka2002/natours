const fs = require("fs");
const express = require("express");
const morgan = require("morgan");

const app = express();

// MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());

const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`, "utf-8"));

// HANDLERS
const getAllTours = (req, res) => {
  res.status(200).json({
    status: "success",
    results: tours.length,
    data: { tours },
  });
};

const getTour = (req, res) => {
  const tour = tours.find((el) => el.id === +req.params.id);
  // if (+req.params.id > tours.length)
  if (!tour)
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });
  res.status(200).json({
    status: "success",
    data: { tour },
  });
};

const createTour = (req, res) => {
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

const updateTour = (req, res) => {
  if (+req.params.id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });

  res.status(200).send({
    status: "success",
    data: {
      tour: "<Updated Tour>",
    },
  });
};

const deleteTour = (req, res) => {
  if (+req.params.id > tours.length)
    return res.status(404).json({
      status: "fail",
      message: "Invalid Id",
    });

  res.status(204).send({
    status: "success",
    data: null,
  });
};

// USERS
const getAllusers = (req, res) => {
  res.status(500).json({
    status: "error",
    message: "This route not defined yet!!",
  });
};

const getUser = (req, res) => {
  res.status(500).json({
    status: "error",
  });
};

const createuser = (req, res) => {
  res.status(500).json({
    status: "error",
  });
};

const updateUser = (req, res) => {
  res.status(500).json({
    status: "error",
  });
};

const deleteUser = (req, res) => {
  res.status(500).json({
    status: "error",
  });
};

// ROUTES

// app.get("/api/v1/tours", getAllTours);
// app.post("/api/v1/tours", createTour);
// app.get("/api/v1/tours/:id", getTour);
// app.patch("/api/v1/tours/:id", updateTour);
// app.delete("/api/v1/tours/:id", deleteTour);

const tourRouter = express.Router();
const userRouter = express.Router();

tourRouter.route("/").get(getAllTours).post(createTour);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

userRouter.route("/").get(getAllusers).post(createuser);
userRouter.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);

// SERVER
const port = 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
