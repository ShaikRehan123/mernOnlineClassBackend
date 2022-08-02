const Course = require("../models/course");

exports.get_all_courses = async (_req, res) => {
  const all_courses = await Course.find({});

  if (all_courses.length > 0) {
    res.status(200).json({
      message: "Successfully retrieved all courses",
      courses: all_courses,
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
