import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import BillUpload from "../components/BillUpload";
import BillsList from "../components/BillsList";
import Visualization from "../components/Visualization";
import "../styles/bills.css";

export default function BillsPage() {
  const [bills, setBills] = useState([]);

  // Fetch all bills on page load
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

  // Generate PDF for latest bill ONLY
  const handleGeneratePDF = async () => {
    try {
      if (bills.length === 0) return alert("No bills found!");

      const latestBill = bills[bills.length - 1]; // Latest bill

      const res = await fetch("http://localhost:8787/api/pdf/generatePDF", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: latestBill.items }),
      });

      if (!res.ok) throw new Error("Failed to generate PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "FairShare_Latest_Bill.pdf";
      a.click();
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Error generating PDF. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="bill-container">
        <h2>Bill Management</h2>
        <p>Upload bills, view spending summaries, and generate reports.</p>

        {/* Upload Section */}
        <section>
          <BillUpload setBills={setBills} />
        </section>

        {/* Latest Bill Only */}
        <section>
          <h3>Uploaded Bill</h3>
          <BillsList bills={bills.slice(-1)} />
        </section>

        {/* Visualization for latest bill */}
        <section>
          <h3>Spending Visualization</h3>
          <Visualization bills={bills.slice(-1)} />
        </section>

        {/* PDF Button */}
        {bills.length > 0 && (
          <button onClick={handleGeneratePDF} className="download-btn">
            Download Latest Bill PDF
          </button>
        )}
      </div>
    </>
  );
}

