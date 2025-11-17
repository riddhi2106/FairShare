const express = require("express");
const router = express.Router();
const { uploadBill, getAllBills } = require("../controllers/billController");

// POST /api/bills/upload
router.post("/upload", uploadBill);

// GET /api/bills/all
router.get("/all", getAllBills);

module.exports = router;
