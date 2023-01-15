const jwt = require("jsonwebtoken");
const Razorpay = require("razorpay");
const EnrolledCourse = require("../models/EnrolledCourse");
const User = require("../models/User");
const Course = require("../models/Course");

function verifyAdmin(req, res, next) {
  // console.log(req.headers["authorization"]);
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
      if (decoded.role_id == "1") {
        req.user = decoded;
        next();
      } else {
        res.status(401).json({
          status: "error",
          message: "Not an admin",
        });
      }
    } else {
      res.status(401).json({
        status: "error",
        message: "Not logged-in",
      });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      res.status(200).json({
        status: "error",
        message: "Token expired Please login again",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    }
  }
}

function isLoggedIn(req, res, next) {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
      req.user = decoded;

      next();
    } else {
      res.status(401).json({
        status: "error",
        message: "Not logged-in",
      });
    }
  } catch (err) {
    if (err.name == "TokenExpiredError") {
      res.status(200).json({
        status: "error",
        message: "Token expired Please login again",
      });
    } else {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
        error: err,
      });
    }
  }
}

async function checkAssetsisLoggedIn(req, res, next) {
  // if user is trying to access course_images allow him without checking for token
  if (req.url.includes("course_images")) {
    next();
  } else {
    try {
      const bearerHeader = req.cookies.token;
      if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        const decoded = jwt.decode(req.cookies.token, process.env.JWT_SECRET);
        if (decoded.user_id == null) {
          res.status(401).json({
            status: "error",
            message: "Not logged-in",
          });
        } else {
          if (req.url.includes("course_videos")) {
            const course_id = req.url.split("/")[3];
            const user_id = decoded.user_id;
            const user_role = decoded.role_id;
            const user = await User.findOne({ _id: user_id });
            if (user_role == "2") {
              const enrolledCourse = await EnrolledCourse.findOne({
                user: user._id,
                course_id: course_id,
              });
              if (enrolledCourse) {
                next();
              } else {
                res.status(401).json({
                  status: "error",
                  message: "Not enrolled",
                });
              }
            } else {
              const course = await Course.findOne({
                _id: course_id,
                author_id: user._id,
              });
              if (course) {
                next();
              } else {
                res.status(401).json({
                  status: "error",
                  message: "You are not the author of this course",
                });
              }
            }
          } else {
            next();
          }
        }
      } else {
        res.status(401).json({
          status: "error",
          message: "Not logged-in",
        });
      }
    } catch (err) {
      if (err.name == "TokenExpiredError") {
        res.status(200).json({
          status: "error",
          message: "Token expired Please login again",
        });
      } else {
        res.status(500).json({
          status: "error",
          message: "Something went wrong",
          error: err,
        });
      }
    }
  }
}

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.verifyAdmin = verifyAdmin;
exports.isLoggedIn = isLoggedIn;
exports.checkAssetsisLoggedIn = checkAssetsisLoggedIn;
exports.razorpayInstance = razorpayInstance;
