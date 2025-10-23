// frontend/src/pages/ExpensePage.jsx
// Page to add expenses. If splitType is 'custom', pass 'shares' array in body.
import React, { useState } from 'react';
import axios from 'axios';

const ExpensePage = () => {
  const [form, setForm] = useState({
    groupId: '', description: '', totalAmount: '', splitType: 'equal', paidBy: ''
  });
  const [customShares, setCustomShares] = useState(''); // JSON string for quick testing

  const token = localStorage.getItem('token');

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const payload = { ...form };
      if (form.splitType === 'custom') {
        // Expect user to paste JSON like: [{ "userId":"id1","amount":200 }, ...]
        payload.shares = JSON.parse(customShares);
      }
      const res = await axios.post('/api/groups/expenses/add', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding expense');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Add Expense</h2>
      <input name="groupId" placeholder="Group ID" onChange={handle} /><br />
      <input name="description" placeholder="Description" onChange={handle} /><br />
      <input name="totalAmount" placeholder="Total Amount" type="number" onChange={handle} /><br />
      <input name="paidBy" placeholder="Paid By (User ID) - optional" onChange={handle} /><br />
      <select name="splitType" onChange={handle}>
        <option value="equal">Equal</option>
        <option value="custom">Custom</option>
      </select><br />
      {form.splitType === 'custom' && (
        <div>
          <p>Enter shares JSON (example):</p>
          <textarea value={customShares} onChange={e => setCustomShares(e.target.value)} rows={6} cols={60} />
        </div>
      )}
      <button onClick={submit}>Add Expense</button>
    </div>
  );
};

export default ExpensePage;
