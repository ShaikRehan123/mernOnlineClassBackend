const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  name: { type: String, required: true },
  role_id: {
    type: String,
    required: true,
    unique: true,
  },
  is_active: { type: Boolean, required: false, default: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("Role", rolesSchema);
