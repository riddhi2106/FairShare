import React, { useState, useEffect } from "react";
import BillUpload from "../components/BillUpload";
import BillsList from "../components/BillsList";
import Visualization from "../components/Visualization";
import "../styles/bills.css";

export default function BillsPage() {
  const [bills, setBills] = useState([]);

  // Fetch all bills
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await fetch("http://localhost:8787/api/bills/all");
        const data = await res.json();
        setBills(data.bills || []);
      } catch (err) {
        console.error("Error fetching bills:", err);
      }
    };
    fetchBills();
  }, []);

  // Generate PDF
  const handleGeneratePDF = async () => {
    try {
      const res = await fetch("http://localhost:8787/api/pdf/generatePDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: bills.map((b) => b.items).flat() }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FairShare_Bill_Summary.pdf";
      a.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <div className="bill-container">
      <h2>Bill Management</h2>
      <p>Upload bills, view spending summaries, and generate reports.</p>

      <section>
        <h3>Upload a Bill</h3>
        <BillUpload setBills={setBills} />
      </section>

      <section>
        <h3>All Uploaded Bills</h3>
        <BillsList bills={bills} />
      </section>

      <section>
        <h3>Spending Visualization</h3>
        <Visualization bills={bills} />
      </section>

      {bills.length > 0 && (
        <button onClick={handleGeneratePDF} className="download-btn">
          Download PDF Summary
        </button>
      )}
    </div>
  );
}
