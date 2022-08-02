const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const course_controller = require("../controllers/course");

router.get("/get_all_courses", course_controller.get_all_courses);
router.post("/get_course/:id", course_controller.get_course);
router.get(
  "/get_courses_in_category/:id",
  course_controller.get_courses_in_category
);

module.exports = router;
