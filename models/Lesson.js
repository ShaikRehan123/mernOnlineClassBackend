const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lessonSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true },
  course_id: {
    type: Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  is_active: { type: Boolean, required: true, default: true },
  video_link: { type: String, required: true },
});

module.exports = mongoose.model("Lesson", lessonSchema);
