const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../lib/lib");
const multer = require("multer");
const path = require("path");
const admin_controller = require("../controllers/admin");
const category_contoller = require("../controllers/category");
const Course = require("../models/Course");
const fs = require("fs");

router.post("/create_admin", admin_controller.create_admin);

router.post("/create_role", verifyAdmin, admin_controller.create_role);
router.get("/get_users", verifyAdmin, admin_controller.get_users);

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(__dirname, "../public/upload/course_images"));
  },
  filename: function (req, file, cb) {
    // first word of the course name
    const name = req.body.name.split(" ")[0];
    // last word of the course name
    const lastWord =
      req.body.name.split(" ")[req.body.name.split(" ").length - 1];
    // course name
    const courseName = `${name}_${lastWord}`;
    // console.log(name);
    cb(
      null,
      courseName +
        "-" +
        Date.now() +
        "-" +
        file.originalname[0] +
        `.${file.mimetype.split("/")[1]}`
    );
  },
});

const fileFilter = (_req, file, cb) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  }
  cb(null, false);
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.post("/create", admin_controller.create_admin);

router.post(
  "/create_course",
  verifyAdmin,
  upload.single("image"),
  admin_controller.create_course
);

router.post(
  "/create_category",
  verifyAdmin,
  upload.none(),
  category_contoller.create_category
);

router.get(
  "/get_all_categories",
  verifyAdmin,
  category_contoller.get_all_categories
);

const uploadVideo = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      const course_id = req.body.course_id;
      const parent_folder = path.join(
        __dirname,
        "../public/upload/course_videos"
      );
      const course_folder = path.join(parent_folder, course_id);
      if (!fs.existsSync(parent_folder)) {
        fs.mkdirSync(parent_folder);
      }
      if (!fs.existsSync(course_folder)) {
        fs.mkdirSync(course_folder);
      }
      cb(null, course_folder);
    },
    filename: function (req, file, cb) {
      const fileName = `${req.body.name.split(" ").join("_")}_${Date.now()}`;
      cb(null, fileName + `.${file.mimetype.split("/")[1]}`);
    },
  }),
  limits: {
    // 100 mb
    fileSize: 1024 * 1024 * 100,
  },
  fileFilter: (_req, file, cb) => {
    if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/avi" ||
      file.mimetype === "video/mkv"
    ) {
      cb(null, true);
    }
    cb(null, false);
  },
});
router.post(
  "/upload_lesson",
  verifyAdmin,
  uploadVideo.single("video"),
  admin_controller.upload_lesson
);

router.post(
  "/get_teacher_courses",
  verifyAdmin,
  admin_controller.get_teacher_courses
);

module.exports = router;
