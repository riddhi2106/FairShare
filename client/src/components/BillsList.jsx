import React from "react";
import "../styles/bills.css";

export default function BillsList({ bills }) {
  if (!bills || bills.length === 0) return <p>No bills found.</p>;

  return (
    <div className="bills-list">
      
      {bills.map((bill, index) => (
        <div key={index} className="bill-card">
          <span className="bill-timestamp">
            {new Date(bill.createdAt).toLocaleString()}
          </span>
          <div className="bill-items">
            {bill.items.map((item, idx) => (
              <p key={idx} className="bill-item">
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
