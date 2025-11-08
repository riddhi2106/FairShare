const PDFDocument = require("pdfkit");
const path = require("path");

exports.generatePDF = async (req, res) => {
  try {
    const { items } = req.body;

    const doc = new PDFDocument();
    const filename = `summary_${Date.now()}.pdf`;
    const filePath = path.join(__dirname, "../uploads", filename);

    res.setHeader("Content-Disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);
    doc.fontSize(20).text("FairShare Bill Summary", { align: "center" });
    doc.moveDown();

    items.forEach((item, index) => {
      doc.fontSize(14).text(`${index + 1}. ${item}`);
    });

    doc.end();
  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).json({ message: "Failed to generate PDF" });
  }
};
