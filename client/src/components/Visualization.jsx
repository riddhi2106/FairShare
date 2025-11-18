import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function Visualization({ bills }) {
  const [data, setData] = useState([]);
  const [itemsFlat, setItemsFlat] = useState([]);

  useEffect(() => {
    if (!bills || bills.length === 0) {
      setData([]);
      setItemsFlat([]);
      return;
    }

    const items = bills.flatMap((b) => b.items || []);
    setItemsFlat(items);

    const freq = items.reduce((acc, it) => {
      acc[it] = (acc[it] || 0) + 1;
      return acc;
    }, {});
    setData(Object.entries(freq).map(([name, count]) => ({ name, count })));
  }, [bills]);

  const handlePDF = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8787/api/pdf/generatePDF",
        { items: itemsFlat },
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "summary.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("PDF error:", err);
      alert("Error generating PDF");
    }
  };

  return (
    <div style={{ marginTop: 20 }}>
      {data.length ? (
        <>
          <BarChart width={600} height={300} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
          
        </>
      ) : (
        <p>No data to visualize.</p>
      )}
    </div>
  );
}
