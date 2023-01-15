const Lesson = require("../models/Lesson");
const EnrolledCourse = require("../models/EnrolledCourse");

const path = require("path");
const fs = require("fs");

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

exports.lesson_delete = async (req, res) => {
  const lesson_id = req.params.id;
  try {
    const lesson = await Lesson.findById(lesson_id);

    if (lesson) {
      await Lesson.deleteOne({ _id: lesson_id });
      const video_path = path.join(
        __dirname,
        "../public/upload/course_videos/" +
          lesson.course_id +
          "/" +
          lesson.video_link
      );
      // console.log(video_path);
      if (fs.existsSync(video_path)) {
        fs.unlinkSync(video_path);
      }

      //remove lesson from enrolled course lessonstatus
      // const EnrolledCourseSchema = new Schema({
      //   course: {
      //     type: Schema.Types.ObjectId,
      //     ref: "Course",
      //     required: true,
      //   },
      //   user: {
      //     type: Schema.Types.ObjectId,
      //     ref: "User",
      //     required: true,
      //   },
      //   enrolledDate: {
      //     type: Date,
      //     default: Date.now,
      //   },
      //   lessonsStatus: [
      //     {
      //       lesson: {
      //         type: Schema.Types.ObjectId,
      //         ref: "Lesson",
      //         required: true,
      //       },
      //       status: {
      //         type: String,
      //         enum: ["not-started", "in-progress", "completed"],
      //         default: "not-started",
      //       },
      //       videoCurrentTime: {
      //         type: Number,
      //         default: 0,
      //         required: false,
      //       },
      //     },
      //   ],
      // });

      await EnrolledCourse.updateMany(
        { "lessonsStatus.lesson": lesson_id },
        { $pull: { lessonsStatus: { lesson: lesson_id } } }
      );

      res.status(200).json({
        status: "success",
        message: "Lesson deleted",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Lesson not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};

exports.lesson_toggleActive = async (req, res) => {
  const lesson_id = req.params.id;
  try {
    const lesson = await Lesson.findById(lesson_id);
    // console.log(lesson);
    if (lesson) {
      await Lesson.updateOne(
        { _id: lesson_id },
        { $set: { is_active: !lesson.is_active } }
      );
      res.status(200).json({
        status: "success",
        message: "Lesson updated",
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "Lesson not found",
      });
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err.message || "Something went wrong",
    });
  }
};
