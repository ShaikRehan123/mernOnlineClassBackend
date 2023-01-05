const Lesson = require("../models/Lesson");

exports.get_lessons = async (req, res) => {
  const course_id = req.body.course_id;
  try {
    const lessons = await Lesson.find({ course_id: course_id });
    res.status(200).json({
      status: "success",
      data: lessons,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
};
