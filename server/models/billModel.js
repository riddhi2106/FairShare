const mongoose = require("mongoose");

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    items: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Bill", billSchema);
