const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_ids: [{ type: Schema.Types.ObjectId, ref: "Course", required: true }],
  amount: { type: Number, required: true },
  is_paid: { type: Boolean, default: false },
  razorpay_order_id: { type: String, required: false, default: "free_course" },
  razorpay_payment_id: {
    type: String,
    required: false,
    default: "free_course",
  },
  razorpay_signature: {
    type: String,
    required: false,
    default: "free_course",
  },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
