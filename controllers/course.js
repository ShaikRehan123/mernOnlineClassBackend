const Category = require("../models/Category");
const Course = require("../models/Course");
const User = require("../models/User");

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
