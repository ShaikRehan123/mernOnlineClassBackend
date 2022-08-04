const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../lib/lib");
const multer = require("multer");
const path = require("path");
const admin_controller = require("../controllers/admin");
const category_contoller = require("../controllers/category");

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
      Date.now() +
        "-" +
        courseName +
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

router.post(
  "/create_course",
  verifyAdmin,
  upload.single("image"),
  admin_controller.create_course
);

router.post(
  "/create_category",
  verifyAdmin,
  category_contoller.create_category
);

router.get(
  "/get_all_categories",
  verifyAdmin,
  category_contoller.get_all_categories
);

module.exports = router;
