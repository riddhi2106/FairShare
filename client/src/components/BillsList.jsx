export default function BillsList({ bills }) {
  if (!bills || bills.length === 0) return <p>No bills found.</p>;

  return (
    <div>
      {bills.map((b) => (
        <div key={b._id} style={{ marginBottom: 10, padding: '10px', border: '1px solid #ddd', borderRadius: '5px' }}>
          <strong>{new Date(b.createdAt).toLocaleString()}</strong>
          <ul>
            {b.items && b.items.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
