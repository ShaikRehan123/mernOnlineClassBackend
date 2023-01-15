const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const course_controller = require("../controllers/course");
const { isLoggedIn, verifyAdmin } = require("../lib/lib");

router.get("/get_all_courses", course_controller.get_all_courses);
router.post("/toggle-active", verifyAdmin, course_controller.toggle_active);
router.post("/get_course/:id", course_controller.get_course);
router.get(
  "/get_courses_in_category/:id",
  course_controller.get_courses_in_category
);
router.delete("/delete/:id", course_controller.course_delete);
router.get("/top-ten-courses", course_controller.topTenCourses);
router.get("/all-courses", course_controller.allCourses);
router.post("/create-order", isLoggedIn, course_controller.createOrder);
router.post(
  "/payment-verification",
  // isLoggedIn,
  course_controller.paymentVerification
);
router.post("/enrolled-courses", isLoggedIn, course_controller.enrolledCourses);
router.post(
  "/enrolled-course-lessons",
  isLoggedIn,
  course_controller.enrolledCourseLessons
);
router.put(
  "/update-video-current-time",
  isLoggedIn,
  course_controller.updateVideoCurrentTime
);
router.post(
  "/get-lesson-current-time",
  isLoggedIn,
  course_controller.getLessonCurrentTime
);
router.post(
  "/get-teacher-dashboard-data",
  verifyAdmin,
  course_controller.getTeacherDashboardData
);

module.exports = router;
