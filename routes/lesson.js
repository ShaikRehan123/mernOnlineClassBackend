const express = require("express");
const router = express.Router();
// Require the controllers WHICH WE DID NOT CREATE YET!!
const lessons_controller = require("../controllers/lesson");
const { verifyAdmin } = require("../lib/lib");

router.post("/get-lessons", verifyAdmin, lessons_controller.get_lessons);
router.delete("/delete/:id", verifyAdmin, lessons_controller.lesson_delete);
router.patch(
  "/toggleActive/:id",
  verifyAdmin,
  lessons_controller.lesson_toggleActive
);
module.exports = router;
