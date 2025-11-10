import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/expenses.css';

const ExpensePage = () => {
  const [searchParams] = useSearchParams();
  const groupIdFromUrl = searchParams.get('groupId');
  
  const [form, setForm] = useState({
    groupId: groupIdFromUrl || '', description: '', totalAmount: '', splitType: 'equal', paidBy: ''
  });
  const [groupMembers, setGroupMembers] = useState([]);
  const [customShares, setCustomShares] = useState([]); // Array of {userId, amount}
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = localStorage.getItem('token');

  // Update form when URL parameter changes
  useEffect(() => {
    if (groupIdFromUrl) {
      setForm(prev => ({ ...prev, groupId: groupIdFromUrl }));
    }
  }, [groupIdFromUrl]);

  // Get current user ID from token
  useEffect(() => {
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
        const decoded = JSON.parse(jsonPayload);
        setCurrentUserId(decoded.id);
      } catch (e) {
        console.error('Error decoding token:', e);
      }
    }
  }, [token]);

  // Fetch group members when group ID changes
  useEffect(() => {
    const fetchGroupMembers = async () => {
      if (form.groupId && form.groupId.length >= 12) {
        try {
          const res = await axios.get(`http://localhost:8787/api/groups/${form.groupId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setGroupMembers(res.data.group?.members || []);
        } catch (err) {
          console.error('Error fetching group:', err);
          setGroupMembers([]);
        }
      } else {
        setGroupMembers([]);
      }
    };

    fetchGroupMembers();
    
    // Auto-refresh every 5 seconds to catch new members
    const interval = setInterval(() => {
      if (form.groupId && form.groupId.length >= 12) {
        fetchGroupMembers();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [form.groupId, token]);

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value });

  const refreshMembers = async () => {
    if (form.groupId && form.groupId.length >= 12) {
      try {
        const res = await axios.get(`http://localhost:8787/api/groups/${form.groupId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroupMembers(res.data.group?.members || []);
        alert(`Refreshed! Group now has ${res.data.group?.members?.length || 0} members.`);
      } catch (err) {
        console.error('Error fetching group:', err);
        alert('Error refreshing group members');
      }
    }
  };

  const handleMemberSelection = (memberId, amount) => {
    const existing = customShares.findIndex(s => s.userId === memberId);
    if (existing >= 0) {
      // Update existing
      const updated = [...customShares];
      updated[existing].amount = amount;
      setCustomShares(updated);
    } else {
      // Add new
      setCustomShares([...customShares, { userId: memberId, amount: amount }]);
    }
  };

  const removeMemberShare = (memberId) => {
    setCustomShares(customShares.filter(s => s.userId !== memberId));
  };

  const splitEquallyAmongSelected = () => {
    if (customShares.length === 0) {
      alert('Please select at least one person first!');
      return;
    }
    if (!form.totalAmount || parseFloat(form.totalAmount) <= 0) {
      alert('Please enter a valid total amount first!');
      return;
    }

    const equalAmount = (parseFloat(form.totalAmount) / customShares.length).toFixed(2);
    const updatedShares = customShares.map(share => ({
      ...share,
      amount: parseFloat(equalAmount)
    }));
    setCustomShares(updatedShares);
  };

  const submit = async () => {
    if (!form.groupId || !form.description || !form.totalAmount) {
      alert('Please fill in all required fields!');
      return;
    }

    try {
      const payload = { ...form };
      if (form.splitType === 'custom') {
        if (customShares.length === 0) {
          alert('Please add at least one person to split the expense!');
          return;
        }
        payload.shares = customShares;
      }
      const res = await axios.post('http://localhost:8787/api/groups/expenses/add', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
      
      // Save the current group ID to keep it for next expense
      const currentGroupId = form.groupId;
      
      // Reset form but keep the group ID
      setForm({ 
        groupId: currentGroupId, 
        description: '', 
        totalAmount: '', 
        splitType: 'equal', 
        paidBy: '' 
      });
      setCustomShares([]);
      // Don't reset groupMembers so they're still visible
    } catch (err) {
      alert(err.response?.data?.message || 'Error adding expense');
    }
  };

  return (
    <>
      <Navbar />
      <div className="expenses-page">
        {/* User ID Display */}
        {currentUserId && (
          <div style={{ maxWidth: '800px', margin: '20px auto', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '2px solid #1a73e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Your User ID (use this as "Paid By" if you paid):</p>
                <p style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1a73e8', wordBreak: 'break-all' }}>
                  {currentUserId}
                </p>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(currentUserId);
                  alert('User ID copied to clipboard!');
                }}
                style={{
                  padding: '10px 20px',
                  borderRadius: '6px',
                  border: '1px solid #1a73e8',
                  background: '#1a73e8',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  whiteSpace: 'nowrap'
                }}
              >
                Copy ID
              </button>
            </div>
          </div>
        )}
        
      <div className="expenses-container">
        <div className="expense-card">
          <h2>Add Expense</h2>
          
          <div className="form-group">
            <label>Group ID *</label>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <input 
                name="groupId" 
                placeholder="Enter group ID" 
                value={form.groupId}
                onChange={handle}
                style={{ flex: 1 }}
              />
              {form.groupId && form.groupId.length >= 12 && (
                <button
                  type="button"
                  onClick={refreshMembers}
                  style={{
                    padding: '10px 15px',
                    borderRadius: '6px',
                    border: '1px solid #18c783',
                    background: 'white',
                    color: '#18c783',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    whiteSpace: 'nowrap'
                  }}
                >
                  🔄 Refresh
                </button>
              )}
            </div>
            {groupMembers.length > 0 && (
              <p style={{ margin: '8px 0 0 0', fontSize: '13px', color: '#666' }}>
                Current members: {groupMembers.length}
              </p>
            )}
          </div>

          <div className="form-group">
            <label>Description *</label>
            <input 
              name="description" 
              placeholder="e.g., Dinner at restaurant" 
              value={form.description}
              onChange={handle} 
            />
          </div>

          <div className="form-group">
            <label>Total Amount *</label>
            <input 
              name="totalAmount" 
              type="number"
              step="0.01"
              placeholder="0.00" 
              value={form.totalAmount}
              onChange={handle} 
            />
          </div>

          <div className="form-group">
            <label>Split Type</label>
            <select name="splitType" value={form.splitType} onChange={handle}>
              <option value="equal">Equal Split</option>
              <option value="custom">Custom Split</option>
            </select>
          </div>

          <div className="form-group">
            <label>Paid By (User ID) - optional</label>
            <input 
              name="paidBy" 
              placeholder="Leave empty to use your ID" 
              value={form.paidBy}
              onChange={handle} 
            />
          </div>

          {form.splitType === 'custom' && form.groupId && (
            <div className="form-group">
              <div className="custom-shares-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <p style={{ margin: 0, fontWeight: '600', color: '#18c783' }}>
                    Select who should pay and how much each person owes:
                  </p>
                  {customShares.length > 0 && (
                    <button
                      type="button"
                      onClick={splitEquallyAmongSelected}
                      style={{
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: '1px solid #18c783',
                        background: '#18c783',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: '600',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      ➗ Split Equally
                    </button>
                  )}
                </div>
                
                {groupMembers.length > 0 ? (
                  <>
                    {groupMembers.map(member => {
                      const share = customShares.find(s => s.userId === member._id);
                      return (
                        <div 
                          key={member._id || member} 
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '10px',
                            padding: '10px',
                            backgroundColor: share ? '#e8f8f0' : '#f8f9fa',
                            borderRadius: '6px',
                            border: share ? '2px solid #18c783' : '1px solid #ddd'
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={!!share}
                            onChange={(e) => {
                              if (e.target.checked) {
                                handleMemberSelection(member._id || member, '');
                              } else {
                                removeMemberShare(member._id || member);
                              }
                            }}
                            style={{ width: '20px', height: '20px' }}
                          />
                          <label style={{ flex: 1, fontWeight: '500' }}>
                            {member.name || `Member ${member._id || member}`}
                          </label>
                          {share && (
                            <input
                              type="number"
                              step="0.01"
                              placeholder="Amount"
                              value={share.amount}
                              onChange={(e) => handleMemberSelection(member._id || member, parseFloat(e.target.value) || 0)}
                              style={{
                                width: '120px',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #18c783'
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                    
                    {customShares.length > 0 && (
                      <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#fff3cd', borderRadius: '6px' }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '500' }}>
                          Total: ${customShares.reduce((sum, s) => sum + (parseFloat(s.amount) || 0), 0).toFixed(2)}
                        </p>
                      </div>
                    )}
                  </>
                ) : (
                  <p style={{ color: '#999', fontStyle: 'italic' }}>Enter a valid Group ID to see members</p>
                  )}
              </div>
            </div>
          )}
          
          {form.splitType === 'equal' && form.groupId && groupMembers.length > 0 && (
            <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#e8f8f0', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '14px' }}>
                This expense will be split equally among {groupMembers.length} people.
                Each person will owe: <strong>${(parseFloat(form.totalAmount) / groupMembers.length || 0).toFixed(2)}</strong>
              </p>
            </div>
          )}

          <button className="form-button" onClick={submit}>
            Add Expense
          </button>
        </div>
      </div>
    </div>
    </>
  );
};

export default ExpensePage;
