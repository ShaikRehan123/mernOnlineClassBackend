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
        res.send("Not an admin");
      }
    } else {
      res.send("Not logged-in");
    }
  } catch {
    res.send("something went wrong");
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
      res.send("Not logged-in");
    }
  } catch {
    res.send("something went wrong");
  }
}

exports.verifyAdmin = verifyAdmin;
exports.isLoggedIn = isLoggedIn;
