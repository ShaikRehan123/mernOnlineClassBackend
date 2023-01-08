const jwt = require("jsonwebtoken");

function verifyAdmin(req, res, next) {
  // console.log(req.headers["authorization"]);
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      const decoded = jwt.verify(req.token, process.env.JWT_SECRET);
      if (decoded.role_id === "1") {
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
  } catch {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

function isLoggedIn(req, res, next) {
  try {
    const bearerHeader = req.headers["authorization"];
    if (typeof bearerHeader !== "undefined") {
      const bearerToken = bearerHeader.split(" ")[1];
      req.token = bearerToken;
      next();
    } else {
      res.status(401).json({
        status: "error",
        message: "Not logged-in",
      });
    }
  } catch {
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}

function checkAssetsisLoggedIn(req, res, next) {
  // if user is trying to access course_images allow him without checking for token
  if (req.url.includes("course_images")) {
    next();
  } else {
    try {
      const bearerHeader = req.cookies.token;
      if (typeof bearerHeader !== "undefined") {
        const bearerToken = bearerHeader.split(" ")[1];
        req.token = bearerToken;
        next();
      } else {
        res.status(401).json({
          status: "error",
          message: "Not logged-in",
        });
      }
    } catch {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  }
}

exports.verifyAdmin = verifyAdmin;
exports.isLoggedIn = isLoggedIn;
exports.checkAssetsisLoggedIn = checkAssetsisLoggedIn;
