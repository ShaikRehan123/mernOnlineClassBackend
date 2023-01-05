const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const lessons_controller = require("../controllers/lesson");
const { verifyAdmin } = require("../lib/lib");

router.post("/get-lessons", verifyAdmin, lessons_controller.get_lessons);
module.exports = router;
