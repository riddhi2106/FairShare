import { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";

export default function BillUpload({ setBills }) {
  const [itemsText, setItemsText] = useState("");
  const [status, setStatus] = useState("");

  // ✅ Manual bill upload
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");

    const items = itemsText.split(",").map((s) => s.trim()).filter(Boolean);

    try {
      const res = await axios.post("http://localhost:8787/api/bills/upload", {
        items,
      });
      setStatus("✅ Uploaded successfully!");
      setBills((prev) => [res.data.bill, ...prev]);
      setItemsText("");
    } catch (err) {
      console.error("Upload error:", err);
      setStatus("❌ Upload failed. Try again.");
    }
  };

  // ✅ Handle image scan via Tesseract.js
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStatus("🔍 Scanning...");

    try {
      const result = await Tesseract.recognize(file, "eng", {
        logger: (m) => console.log(m),
      });
      setItemsText(result.data.text);
      setStatus("✅ Scan complete. Review before uploading!");
    } catch (error) {
      console.error(error);
      setStatus("❌ Scan failed. Try again.");
    }
  };

  return (
    <div className="bill-container">
      <form onSubmit={handleSubmit} className="bill-upload-form">
        <input
          type="text"
          placeholder="Enter items separated by commas"
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
        />
        <button type="submit">Upload</button>
      </form>

      {/* ✅ Clean scan section */}
      <h3 className="scan-heading">Scan</h3>
      <input type="file" accept="image/*" onChange={handleImageUpload} />

      <div
        className={`status-message ${
          status.includes("✅") ? "success" : status.includes("❌") ? "error" : ""
        }`}
      >
        {status}
      </div>
    </div>
  );
}
