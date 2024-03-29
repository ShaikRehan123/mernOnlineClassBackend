const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const EnrolledCourseSchema = new Schema({
  course: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  enrolledDate: {
    type: Date,
    default: Date.now,
  },
  lessonsStatus: [
    {
      lesson: {
        type: Schema.Types.ObjectId,
        ref: "Lesson",
        required: true,
      },
      status: {
        type: String,
        enum: ["not-started", "in-progress", "completed"],
        default: "not-started",
      },
      videoCurrentTime: {
        type: Number,
        default: 0,
        required: false,
      },
    },
  ],
});

module.exports = mongoose.model("EnrolledCourse", EnrolledCourseSchema);
