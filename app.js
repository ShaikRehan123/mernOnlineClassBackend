// app.js

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const userRouter = require("./routes/user");
const adminRouter = require("./routes/admin");

const app = express();

// Set up mongoose connection

const mongoDB = process.env.MONGODB_URI;

mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/users", userRouter);
app.use("/admin", adminRouter);

const port = process.env.PORT || 8080;

db.once("open", function () {
  console.log("Connected!");
  app.listen(port, () => {
    console.log("Server is up and running on port numner " + port);
  });
});
