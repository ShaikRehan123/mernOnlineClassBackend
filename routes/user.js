const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const user_controller = require("../controllers/user");

// add a new product to the database
router.post("/create", user_controller.register);
router.post("/login", user_controller.login);

// create test api using jsonwebtoken

module.exports = router;
