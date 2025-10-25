const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String },
  googleId: { type: String }, // optional for Google users
});

// 🚫 No hashing middleware
// 🚫 No bcrypt compare method

module.exports = mongoose.model("User", userSchema);
