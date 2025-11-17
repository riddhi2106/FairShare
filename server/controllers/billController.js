const Bill = require("../models/billModel");

// ✅ POST /api/bills/upload
exports.uploadBill = async (req, res) => {
  try {
    const { userId, groupId, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Bill items are required" });
    }

    const bill = await Bill.create({ userId, groupId, items });
    res.status(201).json({
      message: "Bill uploaded successfully",
      bill,
    });
  } catch (err) {
    console.error("Error uploading bill:", err);
    res.status(500).json({
      message: "Error uploading bill",
      error: err.message,
    });
  }
};

// ✅ GET /api/bills/all
exports.getAllBills = async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.status(200).json({ bills });
  } catch (err) {
    console.error("Error fetching bills:", err);
    res.status(500).json({
      message: "Error fetching bills",
      error: err.message,
    });
  }
};
