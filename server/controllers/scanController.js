const Tesseract = require("tesseract.js");
const fs = require("fs");
const path = require("path");

exports.scanBill = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imagePath = req.file.path;

    // Run OCR
    const result = await Tesseract.recognize(imagePath, "eng");

    let text = result.data.text;

    // Convert OCR text → array of item names
    let items = text
      .split("\n")
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    // Delete the uploaded file after scanning (optional)
    fs.unlinkSync(imagePath);

    res.json({ text: items });

  } catch (err) {
    console.error("OCR Error:", err);
    res.status(500).json({ message: "Scan failed", error: err.message });
  }
};
