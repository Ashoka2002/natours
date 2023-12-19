const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = require("./app");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DATABASE_PASSWORD);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  .then(() => console.log("DB connected succesfully!!"));

const tourSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: [true, "A tour must have name"] },
  rating: { type: Number, default: 4.5 },
  price: { type: Number, required: [true, "A tour must have price"] }
});

const Tour = mongoose.model("Tour", tourSchema);

console.log(tourSchema);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
