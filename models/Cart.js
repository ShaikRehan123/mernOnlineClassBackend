const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  course_ids: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("Cart", cartSchema);
