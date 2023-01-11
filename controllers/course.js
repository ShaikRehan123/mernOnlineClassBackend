const Category = require("../models/Category");
const EnrolledCourse = require("../models/EnrolledCourse");
const Course = require("../models/Course");
const User = require("../models/User");
const Cart = require("../models/Cart");
const fs = require("fs");
const path = require("path");

exports.get_all_courses = async (_req, res) => {
  const all_courses = await Course.find({
    is_active: true,
  });

  // get category name
  const courses = await Promise.all(
    all_courses.map(async (course) => {
      const category = await Category.findOne({
        _id: course.category_id,
      });
      return {
        ...course._doc,
        category_name: category.name,
      };
    })
  );

  // get author name
  const courses_with_author = await Promise.all(
    courses.map(async (course) => {
      const author = await User.findOne({
        _id: course.author_id,
      });
      return {
        ...course,
        author_name: author.name,
      };
    })
  );

  if (courses_with_author.length > 0) {
    res.status(200).json({
      message: "Successfully retrieved all courses",
      courses: courses_with_author,
    });
  } else {
    res.status(200).json({
      message: "No courses found",
      courses: [],
    });
  }
};

exports.get_course = async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.status(200).json({
      message: "Successfully retrieved course",
      course: course,
    });
  } else {
    res.status(200).json({
      message: "No course found",
    });
  }
};

exports.get_courses_in_category = async (req, res) => {
  try {
    const courses = await Course.find({
      category_id: req.params.id,
    });
    res.status(200).json({
      status: "success",
      data: courses,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};

exports.course_delete = async (req, res) => {
  const course_id = req.params.id;
  // console.log(course_id);
  try {
    const course = await Course.findById(course_id);

    if (course) {
      await Course.deleteOne({
        _id: course_id,
      });
      const videos_path = path.join(
        __dirname,
        "../public/upload/course_videos/" + course._id
      );
      const image_file_path = path.join(
        __dirname,
        "../public/upload/course_images/" + course.image
      );
      // console.log(image_file_path);
      // console.log(videos_path);

      if (fs.existsSync(videos_path)) {
        fs.rmSync(videos_path, { recursive: true });
      }

      if (
        fs.existsSync(image_file_path) &&
        course.image !== "default-course-image.jpg"
      ) {
        fs.unlinkSync(image_file_path);
      }

      res.status(200).json({
        status: "success",
        message: "Course deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Course not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};

exports.topTenCourses = async (req, res) => {
  const user_id = req.query.user_id ? req.query.user_id : "notLoggedIn";

  const allCourses = await Course.find({ is_active: true });

  const allEnrolledCourses = await EnrolledCourse.find({});
  const coursesEnrolledCount = [];

  let UserId;
  let usersCart;

  if (user_id !== "notLoggedIn") {
    UserId = await User.findOne({ _id: user_id });
    usersCart = await Cart.findOne({
      user_id: UserId._id,
    });
  }

  allCourses.forEach((course) => {
    const courseEnrolledCount = allEnrolledCourses.filter(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString()
    ).length;

    const isEnrolled = allEnrolledCourses.some(
      (enrolledCourse) =>
        enrolledCourse.course.toString() === course._id.toString() &&
        enrolledCourse.user.toString() === user_id.toString()
    );

    if (UserId) {
      const course_ids = usersCart ? usersCart.course_ids : [];

      const isAddedToCart = course_ids.some(
        (course_id) => course_id.toString() === course._id.toString()
      );

      coursesEnrolledCount.push({
        ...course._doc,
        enrolledCount: courseEnrolledCount,
        isEnrolled: isEnrolled,
        isAddedToCart: isAddedToCart,
      });
    }
  });

  coursesEnrolledCount.sort((a, b) => b.enrolledCount - a.enrolledCount);

  const topTenCourses = coursesEnrolledCount.slice(0, 10);

  res.status(200).json({
    message: "Top 10 courses",
    topTenCourses: topTenCourses,
  });
};
