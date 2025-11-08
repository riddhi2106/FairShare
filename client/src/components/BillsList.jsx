import { useEffect, useState } from "react";
import axios from "axios";

export default function BillsList() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get("http://localhost:8787/api/bills/all");
        setBills(res.data.bills || []);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchBills();
  }, []);

  if (!bills.length) return <p>No bills found.</p>;

  return (
    <div>
      {bills.map((b) => (
        <div key={b._id} style={{ marginBottom: 10 }}>
          <strong>{new Date(b.createdAt).toLocaleString()}</strong>
          <ul>
            {b.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
