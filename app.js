// app.js

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");
const courseRouter = require("./routes/course");
const categoryRouter = require("./routes/category");
const lessonsRouter = require("./routes/lesson");
const { checkAssetsisLoggedIn } = require("./lib/lib");
const cookieParser = require("cookie-parser");

const app = express();

// Set up mongoose connection

const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(cookieParser());

app.use("/assets", checkAssetsisLoggedIn, (req, res, next) => {
  const url = req.url;
  res.sendFile(__dirname + "/public/" + url);
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/users", userRouter);
app.use("/admin", adminRouter);
app.use("/course", courseRouter);
app.use("/category", categoryRouter);
app.use("/lessons", lessonsRouter);

const port = process.env.PORT || 8080;

db.once("open", function () {
  console.log("Connected!");
  app.listen(port, () => {
    console.log("Server is up and running on port numner " + port);
  });
});
