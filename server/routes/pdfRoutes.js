const express = require("express");
const router = express.Router();
const { generatePDF } = require("../controllers/pdfController");

router.post("/generatePDF", generatePDF);

module.exports = router;
