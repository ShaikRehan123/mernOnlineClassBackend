const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const rolesSchema = new Schema({
  name: { type: String, required: true, max: 100 },
  role_id: { type: String, required: true, max: 100 },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
});

// Export the model
module.exports = mongoose.model("Role", rolesSchema);
