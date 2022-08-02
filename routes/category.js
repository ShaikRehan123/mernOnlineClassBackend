const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const category_controller = require("../controllers/category");

router.get("/get_all_categories", category_controller.get_all_categories);

module.exports = router;
