const multer = require("multer");
const sharp = require("sharp");
const Tour = require("../models/tourModel");
const AppError = require("../utils/appErrors.js");
const catchAsync = require("../utils/catchAsync");
const { deleteOne, updateOne, createOne, getOne, getAll } = require("./handlerFactory.js");

///////// MULTER /////////
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) cb(null, true);
  else cb(new AppError("Not an image! Please upload only image", 400), false);
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 }
]);

// upload.single("image"); // for one picture req.file
// upload.array("image", 5); // for multiple picture req.files

exports.resizeTourImages = catchAsync(async (req, res, next) => {
  if (!req.files.imageCover && !req.files.images) return next();

  // COVER IMAGE
  req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`;

  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`public/img/tours/${req.body.imageCover}`);

  // IMAGES
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const fileName = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(`public/img/tours/${fileName}`);

      req.body.images.push(fileName);
    })
  );

  next();
});

//////////////////

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = "5";
  req.query.sort = "-ratingsAverage price";
  req.query.fields = "name,price,ratingsAverage,summary,difficulty";
  next();
};

exports.getToursStats = catchAsync(async (req, res, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } }
    },
    {
      $group: {
        // _id: null,
        _id: { $toUpper: "$difficulty" },
        numTours: { $sum: 1 },
        numRating: { $sum: "$ratingsQuantity" },
        avgRating: { $avg: "$ratingsAverage" },
        avgPrice: { $avg: "$price" },
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    },
    {
      $sort: { avgPrice: 1 }
    }
  ]);

  res.status(200).send({
    status: "success",
    data: {
      tour: stats
    }
  });
});
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    { $unwind: "$startDates" },
    { $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } },
    {
      $group: {
        _id: { $month: "$startDates" },
        numTourStart: { $sum: 1 },
        tours: { $push: "$name" }
      }
    },
    { $addFields: { month: "$_id" } },
    { $project: { _id: 0 } },
    { $sort: { numTourStart: -1 } },
    { $limit: 12 }
  ]);
  res.status(200).send({
    status: "success",
    data: {
      plan
    }
  });
});

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: "reviews" });
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

// router.route("/tours-within/:distance/center/:latlng/unit/:unit", getTourWithin);

exports.getTourWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  if (!lat || !lng) next(new AppError("Please provide latitude and longitude in lat,lng format", 400));

  const radius = unit === "mi" ? distance / 3963.2 : distance / 6378.1;

  const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } } });

  res.status(200).json({
    status: "success",
    results: tours.length,
    data: {
      data: tours
    }
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(",");
  if (!lat || !lng) next(new AppError("Please provide latitude and longitude in lat,lng format", 400));

  const multiplier = unit === "mi" ? 0.000621371 : 0.001;

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [lng * 1, lat * 1]
        },
        distanceField: "distance",
        distanceMultiplier: multiplier
      }
    },
    {
      $project: {
        name: 1,
        distance: 1
      }
    }
  ]);

  res.status(200).json({
    status: "success",
    data: {
      data: distances
    }
  });
});

// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);

//   if (!tour) return next(new AppError("No tour found with that ID!", 404));

//   res.status(204).send({
//     status: "success",
//     data: null
//   });
// });

// exports.getAllTours = catchAsync(async (req, res, next) => {
//   // // 1A) Filtering
//   // const queryObj = { ...req.query };
//   // const excludeFields = ["page", "sort", "limit", "fields"];
//   // excludeFields.forEach(el => delete queryObj[el]);

//   // // 1B) Advanced Filtering
//   // let queryStr = JSON.stringify(queryObj);
//   // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

//   // let query = Tour.find(JSON.parse(queryStr));
//   // // 2) Sorting
//   // if (req.query.sort) {
//   //   const sortBy = req.query.sort.split(",").join(" ");
//   //   query = query.sort(sortBy);
//   // } else {
//   //   query = query.sort("-createdAt");
//   // }

//   // // 3) field limiting
//   // if (req.query.fields) {
//   //   const fields = req.query.fields.split(",").join(" ");
//   //   query = query.select(fields);
//   // } else {
//   //   query = query.select("-__v");
//   // }

//   // // 4) Pagination
//   // const page = req.query.page * 1 || 1;
//   // const limit = req.query.limit * 1 || 10;
//   // const skip = (page - 1) * limit || 0;
//   // // page = 2,limit = 10,
//   // if (req.query.page) {
//   //   const tourCount = await Tour.countDocuments();
//   //   if (skip >= tourCount) throw new Error("This page does not exit!");
//   // }
//   // query = query.skip(skip).limit(limit);

//   // Execute Query

//   const features = new APIFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const tours = await features.query;

//   res.status(200).json({
//     status: "success",
//     results: tours.length,
//     data: { tours }
//   });
// });
// exports.getTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findById(req.params.id).populate("reviews");

//   if (!tour) return next(new AppError("No tour found with that ID!", 404));

//   res.status(200).json({
//     status: "success",
//     data: { tour }
//   });
// });

// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);

//   res.status(201).json({
//     status: "success",
//     data: { tour: newTour }
//   });
// });
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const newUpdatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

//   if (!newUpdatedTour) return next(new AppError("No tour found with that ID!", 404));

//   res.status(200).send({
//     status: "success",
//     data: {
//       tour: newUpdatedTour
//     }
//   });
// });
