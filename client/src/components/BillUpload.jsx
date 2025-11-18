import { useState } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";

export default function BillUpload({ setBills }) {
  const [itemsText, setItemsText] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState("");

  // ======================
  // 📌 MANUAL TEXT SUBMIT
  // ======================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");

    const items = itemsText.split(",").map(i => i.trim()).filter(Boolean);

    try {
      const res = await axios.post("http://localhost:8787/api/bills/upload", { items });

      setBills((prev) => [...prev, res.data.bill]);
      setItemsText("");
      setStatus("✅ Uploaded successfully!");
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    }
  };

  // ======================
  // 📌 SCAN IMAGE USING tesseract.js (frontend)
  // ======================
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setStatus("🔍 Scanning image... please wait...");

    Tesseract.recognize(file, "eng", {
      logger: m => console.log(m)
    })
    .then(({ data: { text } }) => {
      const items = text
        .split("\n")
        .map(i => i.trim())
        .filter(Boolean);

      setItemsText(items.join(", "));
      setStatus("✅ Scan complete! Review and upload.");
    })
    .catch(() => {
      setStatus("❌ Scan failed. Try another image.");
    });
  };

  return (
    <div className="bill-upload-form">

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <input
          type="text"
          placeholder="Enter items separated by commas"
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          style={{ width: "100%" }}
        />

        <button type="submit" style={{ marginTop: "10px", width: "100%" }}>
          Upload
        </button>
      </form>

      <h3>Scan a Bill</h3>

      <div className="file-upload-wrapper">
        <label className="file-btn" htmlFor="scan-file">
          Upload Image to Scan
        </label>

        <input
          id="scan-file"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
        />

        {selectedFile && (
          <p className="file-chosen">📄 {selectedFile.name}</p>
        )}

        <div className="status-message">{status}</div>
      </div>
    </div>
  );
}
