// backend/models/Group.js
// Group schema: stores basic group info and references to members (User collection)
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, default: 'No description provided.' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Track who created the group
  createdAt: { type: Date, default: Date.now }
});

// Export Group model
module.exports = mongoose.model('Group', groupSchema);
