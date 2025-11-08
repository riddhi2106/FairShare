import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/groups.css';

const GroupPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');
  const [createdGroupId, setCreatedGroupId] = useState(null);
  const [createdGroupName, setCreatedGroupName] = useState('');
  const [joinedGroup, setJoinedGroup] = useState(null);
  const [viewingExpenses, setViewingExpenses] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [groupData, setGroupData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const token = localStorage.getItem('token');

  const createGroup = async () => {
    if (!name.trim()) {
      alert('Group name is required!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:8787/api/groups/create', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Store the created group info
      const newGroupId = res.data.group._id;
      setCreatedGroupId(newGroupId);
      setCreatedGroupName(res.data.group.name);
      
      alert(`Group created successfully! Your Group ID: ${newGroupId}`);
      setName('');
      setDescription('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating group');
    }
  };

  const joinGroup = async () => {
    if (!groupId.trim()) {
      alert('Group ID is required!');
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8787/api/groups/join/${groupId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJoinedGroup(res.data.group);
      alert(`Successfully joined group: ${res.data.group.name}`);
      setGroupId('');
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining group');
    }
  };

  const viewExpenses = async (groupId) => {
    try {
      const res = await axios.get(`http://localhost:8787/api/groups/${groupId}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setViewingExpenses(groupId);
      setExpenses(res.data.expenses || []);
      setGroupData(res.data.group);
    } catch (err) {
      alert(err.response?.data?.message || 'Error fetching expenses');
    }
  };

  const settlePayment = async (expenseId, shareIndex) => {
    try {
      const res = await axios.put(
        `http://localhost:8787/api/groups/expenses/${expenseId}/settle/${shareIndex}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      const updatedExpenses = expenses.map(exp => 
        exp._id === expenseId ? res.data.expense : exp
      );
      setExpenses(updatedExpenses);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating payment status');
    }
  };

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

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  return (
    <div className="groups-page">
      <div className="groups-container">
        {/* Create Group Card */}
        <div className="group-card">
      <h2>Create Group</h2>
          <div className="form-group">
            <input 
              type="text"
              placeholder="Group name *" 
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyPress={e => handleKeyPress(e, createGroup)}
            />
          </div>
          <div className="form-group">
            <input 
              type="text"
              placeholder="Description (optional)" 
              value={description}
              onChange={e => setDescription(e.target.value)}
              onKeyPress={e => handleKeyPress(e, createGroup)}
            />
          </div>
          <button className="form-button" onClick={createGroup}>
            Create Group
          </button>
          
          {/* Show created group ID */}
          {createdGroupId && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f8f0', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#18c783' }}>
                ✓ Group Created Successfully!
              </p>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>Group: <strong>{createdGroupName}</strong></p>
              <p style={{ margin: 0, fontSize: '14px', wordBreak: 'break-all' }}>
                <strong>Group ID:</strong> {createdGroupId}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => viewExpenses(createdGroupId)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    border: '1px solid #18c783',
                    background: '#18c783',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  View Expenses
                </button>
                <button 
                  onClick={() => navigator.clipboard.writeText(createdGroupId)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    border: '1px solid #18c783',
                    background: 'white',
                    color: '#18c783',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Copy ID
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Join Group Card */}
        <div className="group-card">
          <h2>Join Group</h2>
          <div className="form-group">
            <input 
              type="text"
              placeholder="Group ID *" 
              value={groupId}
              onChange={e => setGroupId(e.target.value)}
              onKeyPress={e => handleKeyPress(e, joinGroup)}
            />
          </div>
          <button className="form-button" onClick={joinGroup}>
            Join Group
          </button>

          {/* Show joined group info */}
          {joinedGroup && (
            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f8f0', borderRadius: '8px' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#18c783' }}>
                ✓ Joined Group Successfully!
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Group:</strong> {joinedGroup.name}
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px', wordBreak: 'break-all' }}>
                <strong>Group ID:</strong> {joinedGroup._id}
              </p>
              {joinedGroup.description && (
                <p style={{ margin: '5px 0', fontSize: '14px' }}>
                  <strong>Description:</strong> {joinedGroup.description}
                </p>
              )}
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                <strong>Members:</strong> {joinedGroup.members?.length || 0}
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button 
                  onClick={() => viewExpenses(joinedGroup._id)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    border: '1px solid #18c783',
                    background: '#18c783',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                >
                  View Expenses
                </button>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(joinedGroup._id);
                    alert('Group ID copied!');
                  }}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    border: '1px solid #18c783',
                    background: 'white',
                    color: '#18c783',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Copy ID
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Expenses Display */}
      {viewingExpenses && (
        <div style={{ marginTop: '30px', maxWidth: '1200px', margin: '30px auto 0' }}>
          <div className="group-card">
            <h2 style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Group Expenses</span>
              <button 
                onClick={() => setViewingExpenses(null)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '5px',
                  border: '1px solid #999',
                  background: 'white',
                  color: '#666',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Close
              </button>
            </h2>
            
            {expenses.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>No expenses yet. Add some expenses to this group!</p>
            ) : (
              <div style={{ marginTop: '20px' }}>
                {expenses.map((expense, idx) => {
                  const isCreator = groupData?.createdBy?.toString() === currentUserId;
                  return (
                    <div 
                      key={idx} 
                      style={{
                        padding: '20px',
                        marginBottom: '20px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '8px',
                        border: '2px solid #e0e0e0'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px', paddingBottom: '10px', borderBottom: '2px solid #ddd' }}>
                        <div>
                          <strong style={{ color: '#18c783', fontSize: '18px' }}>{expense.description}</strong>
                          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
                            Paid by: <strong>{expense.paidBy?.name || 'Unknown'}</strong>
                          </p>
                        </div>
                        <span style={{ color: '#18c783', fontWeight: '600', fontSize: '20px' }}>${expense.totalAmount}</span>
                      </div>
                      
                      <div style={{ marginTop: '15px' }}>
                        <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#666', fontWeight: '500' }}>
                          Split among {expense.shares?.length || 0} people ({expense.splitType} split):
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {expense.shares?.map((share, shareIdx) => (
                            <div 
                              key={shareIdx}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '10px',
                                backgroundColor: share.paid ? '#d4edda' : 'white',
                                borderRadius: '6px',
                                border: share.paid ? '2px solid #28a745' : '1px solid #ddd'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                {isCreator && (
                                  <input
                                    type="checkbox"
                                    checked={share.paid}
                                    onChange={() => settlePayment(expense._id, shareIdx)}
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      cursor: 'pointer'
                                    }}
                                  />
                                )}
                                <span style={{ fontSize: '14px', fontWeight: share.paid ? '600' : 'normal', textDecoration: share.paid ? 'line-through' : 'none' }}>
                                  {share.userId?.name || 'Unknown'} owes ${share.amount}
                                </span>
                              </div>
                              {share.paid && (
                                <span style={{ color: '#28a745', fontWeight: '600', fontSize: '12px' }}>
                                  ✓ Settled
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupPage;
