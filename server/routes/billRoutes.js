const express = require("express");
const router = express.Router();

const {
  uploadBill,
  getAllBills
} = require("../controllers/billController");

// ==========================
// 📌 Upload Bill (manual text)
// ==========================
router.post("/upload", uploadBill);

// ==========================
// 📌 Get All Bills
// ==========================
router.get("/all", getAllBills);

module.exports = router;

