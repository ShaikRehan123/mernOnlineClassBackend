const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  description: { type: String, required: true },
  category_id: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },

  price: { type: Number, required: true },
  image: { type: String, required: true },
  is_active: { type: Boolean, required: true, default: true },
  is_featured: { type: Boolean, required: true },
  // is_free: { type: Boolean, required: true, default: false },
  is_trending: { type: Boolean, required: true },
});

// Export the model
module.exports = mongoose.model("Course", courseSchema);
