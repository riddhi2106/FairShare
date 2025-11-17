// backend/models/Expense.js
// Expense schema: links an expense to a group, who paid, and how it's split.
const mongoose = require('mongoose');

const shareSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  paid: { type: Boolean, default: false } // Track if this share has been settled
}, { _id: false });

const expenseSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true, min: 0.01 },
  splitType: { type: String, enum: ['equal', 'custom'], default: 'equal' },
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shares: [shareSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Expense', expenseSchema);
