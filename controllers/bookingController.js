const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const catchAsync = require("../utils/catchAsync");
const Tour = require("../models/tourModel");

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) GET THE CURRENT BOOKED TOUR
  const tour = await Tour.findById(req.params.tourId);

  // 2) CREATE CHECKOUT SESSION
  ///////1//////
  // const product = await stripe.products.create({
  //   name: `${tour.name} Tour`,
  //   description: tour.summary,
  //   images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
  // });

  // const price = await stripe.prices.create({
  //   product: product.id,
  //   unit_amount: tour.price * 100,
  //   currency: "usd"
  // });

  // const session = await stripe.checkout.sessions.create({
  //   payment_method_types: ["card"],
  //   success_url: `${req.protocol}://${req.get("host")}/`,
  //   cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
  //   customer_email: req.user.email,
  //   client_reference_id: req.params.tourID,
  //   mode: "payment",
  //   line_items: [
  //     {
  //       price: price.id,
  //       quantity: 1
  //     }
  //   ]
  // });
  ///////////1//////
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`]
          }
        }
      }
    ]
  });

  // 3) CREATE SESSION AS RESPONSE
  res.status(200).json({
    status: "success",
    session
  });
});
