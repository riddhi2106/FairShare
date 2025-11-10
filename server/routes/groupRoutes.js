// backend/routes/groupRoutes.js
// Routes for creating/joining groups and adding/viewing expenses
const express = require('express');
const router = express.Router();
const Group = require('../models/Group');
const Expense = require('../models/Expense');
const auth = require('../middleware/authmiddleware');

// Helper: basic validation for ObjectId-like strings (not strict)
function isValidId(id) {
  return typeof id === 'string' && id.length >= 12;
}

// Create a new group. The creating user is automatically added as a member.
router.post('/create', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Group name is required.' });

    const group = new Group({ 
      name, 
      description, 
      members: [req.user.id],
      createdBy: req.user.id 
    });
    await group.save();
    res.status(201).json({ message: 'Group created successfully.', group });
  } catch (err) {
    res.status(500).json({ message: 'Server error creating group.', error: err.message });
  }
});

// Join an existing group by ID. If already a member, return the group.
router.post('/join/:id', auth, async (req, res) => {
  try {
    const gid = req.params.id;
    if (!isValidId(gid)) return res.status(400).json({ message: 'Invalid group id.' });

    const group = await Group.findById(gid);
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    if (!group.members.map(String).includes(String(req.user.id))) {
      group.members.push(req.user.id);
      await group.save();
    }

    res.json({ message: 'Joined group successfully.', group });
  } catch (err) {
    res.status(500).json({ message: 'Server error joining group.', error: err.message });
  }
});

// Add an expense to a group. Accepts either equal split or custom shares.
router.post('/expenses/add', auth, async (req, res) => {
  try {
    const { groupId, description, totalAmount, splitType, paidBy, shares } = req.body;
    if (!groupId || !description || !totalAmount) {
      return res.status(400).json({ message: 'groupId, description and totalAmount are required.' });
    }

    // Basic sanity checks
    if (!isValidId(groupId)) return res.status(400).json({ message: 'Invalid groupId.' });
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    // Ensure payer is a member
    const payer = paidBy || req.user.id;
    if (!group.members.map(String).includes(String(payer))) {
      return res.status(403).json({ message: 'Payer must be a member of the group.' });
    }

    // Prepare shares: if splitType is 'equal', create equal shares for all members. If 'custom', expect shares array.
    let finalShares = [];
    if (splitType === 'equal') {
      const perPerson = Number(totalAmount) / group.members.length;
      finalShares = group.members.map(m => ({ userId: m, amount: Math.round(perPerson * 100) / 100 }));
    } else {
      // custom split; validate shares provided
      if (!Array.isArray(shares) || shares.length === 0) {
        return res.status(400).json({ message: 'Custom split requires a shares array.' });
      }
      // simple validation for shares
      finalShares = shares.map(s => ({ userId: s.userId, amount: Number(s.amount) }));
    }

    const expense = new Expense({
      groupId, description, totalAmount: Number(totalAmount), splitType, paidBy: payer, shares: finalShares
    });
    await expense.save();

    res.status(201).json({ message: 'Expense added.', expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error adding expense.', error: err.message });
  }
});

// Mark a share as paid/settled
// NOTE: This must come BEFORE the /:id routes to avoid conflicts
router.put('/expenses/:expenseId/settle/:shareIndex', auth, async (req, res) => {
  try {
    const { expenseId, shareIndex } = req.params;
    if (!isValidId(expenseId)) return res.status(400).json({ message: 'Invalid expense id.' });

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });

    const idx = parseInt(shareIndex);
    if (idx < 0 || idx >= expense.shares.length) {
      return res.status(400).json({ message: 'Invalid share index.' });
    }

    // Toggle the paid status
    expense.shares[idx].paid = !expense.shares[idx].paid;
    await expense.save();

    // Re-populate the user data after saving
    await expense.populate('paidBy', 'name');
    await expense.populate('shares.userId', 'name');

    res.json({ message: 'Payment status updated.', expense });
  } catch (err) {
    res.status(500).json({ message: 'Server error updating payment.', error: err.message });
  }
});

// Delete an expense
// NOTE: This must come BEFORE the /:id routes to avoid conflicts
router.delete('/expenses/:expenseId', auth, async (req, res) => {
  try {
    const { expenseId } = req.params;
    if (!isValidId(expenseId)) return res.status(400).json({ message: 'Invalid expense id.' });

    const expense = await Expense.findById(expenseId);
    if (!expense) return res.status(404).json({ message: 'Expense not found.' });

    // Check if user is the group creator or the person who paid
    const group = await Group.findById(expense.groupId);
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    const isCreator = group.createdBy.toString() === req.user.id;
    const isPayer = expense.paidBy.toString() === req.user.id;

    if (!isCreator && !isPayer) {
      return res.status(403).json({ message: 'Only group creator or expense payer can delete this expense.' });
    }

    await Expense.findByIdAndDelete(expenseId);
    res.json({ message: 'Expense deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Server error deleting expense.', error: err.message });
  }
});

// Get all expenses for a group (populates payer name and share user data)
// NOTE: This must come BEFORE /:id route to avoid route conflicts
router.get('/:id/expenses', auth, async (req, res) => {
  try {
    const gid = req.params.id;
    if (!isValidId(gid)) return res.status(400).json({ message: 'Invalid group id.' });

    const expenses = await Expense.find({ groupId: gid })
      .populate('paidBy', 'name')
      .populate('shares.userId', 'name');
    
    const group = await Group.findById(gid).populate('members', 'name email');
    
    res.json({ expenses, group });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching expenses.', error: err.message });
  }
});

// Get a single group by ID
// NOTE: This must come AFTER /:id/expenses to avoid route conflicts
router.get('/:id', auth, async (req, res) => {
  try {
    const gid = req.params.id;
    if (!isValidId(gid)) return res.status(400).json({ message: 'Invalid group id.' });

    const group = await Group.findById(gid).populate('members', 'name email');
    if (!group) return res.status(404).json({ message: 'Group not found.' });

    res.json({ group });
  } catch (err) {
    res.status(500).json({ message: 'Server error fetching group.', error: err.message });
  }
});

module.exports = router;
