const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const course_controller = require("../controllers/course");
const { isLoggedIn } = require("../lib/lib");

router.get("/get_all_courses", course_controller.get_all_courses);
router.post("/get_course/:id", course_controller.get_course);
router.get(
  "/get_courses_in_category/:id",
  course_controller.get_courses_in_category
);
router.delete("/delete/:id", course_controller.course_delete);
router.get("/top-ten-courses", course_controller.topTenCourses);
router.post("/create-order", isLoggedIn, course_controller.createOrder);
router.post(
  "/payment-verification",
  // isLoggedIn,
  course_controller.paymentVerification
);

module.exports = router;
