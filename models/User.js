const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  is_active: { type: Boolean, required: false, default: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  role_id: { type: Number, required: true },
});

// Export the model
module.exports = mongoose.model("User", userSchema);
