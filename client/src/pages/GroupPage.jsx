import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import '../styles/groups.css';

const GroupPage = () => {
  const navigate = useNavigate();
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
  const [myGroups, setMyGroups] = useState([]);

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
      
      // Save to localStorage with user-specific key
      if (currentUserId) {
        const userGroupsKey = `myGroups_${currentUserId}`;
        const savedGroups = JSON.parse(localStorage.getItem(userGroupsKey) || '[]');
        const newGroup = { id: newGroupId, name: res.data.group.name, description };
        savedGroups.push(newGroup);
        localStorage.setItem(userGroupsKey, JSON.stringify(savedGroups));
        setMyGroups(savedGroups);
      }
      
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
      
      // Save to localStorage with user-specific key
      if (currentUserId) {
        const userGroupsKey = `myGroups_${currentUserId}`;
        const savedGroups = JSON.parse(localStorage.getItem(userGroupsKey) || '[]');
        const groupExists = savedGroups.find(g => g.id === res.data.group._id);
        if (!groupExists) {
          const newGroup = { id: res.data.group._id, name: res.data.group.name, description: res.data.group.description };
          savedGroups.push(newGroup);
          localStorage.setItem(userGroupsKey, JSON.stringify(savedGroups));
          setMyGroups(savedGroups);
        }
      }
      
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
      
      // Also fetch the group separately to ensure members are populated
      const groupRes = await axios.get(`http://localhost:8787/api/groups/${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setViewingExpenses(groupId);
      setExpenses(res.data.expenses || []);
      setGroupData(groupRes.data.group); // Use the separately fetched group with populated members
      console.log('Group data with members:', groupRes.data.group); // Debug log
    } catch (err) {
      alert(err.response?.data?.message || 'Error fetching expenses');
    }
  };

  const settlePayment = async (expenseId, shareIndex) => {
    try {
      await axios.put(
        `http://localhost:8787/api/groups/expenses/${expenseId}/settle/${shareIndex}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refetch expenses
      const expensesRes = await axios.get(`http://localhost:8787/api/groups/${viewingExpenses}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refetch group separately to ensure members are populated
      const groupRes = await axios.get(`http://localhost:8787/api/groups/${viewingExpenses}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setExpenses(expensesRes.data.expenses || []);
      setGroupData(groupRes.data.group);
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating payment status');
    }
  };

  const deleteExpense = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8787/api/groups/expenses/${expenseId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Refetch expenses
      const expensesRes = await axios.get(`http://localhost:8787/api/groups/${viewingExpenses}/expenses`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Refetch group separately to ensure members are populated
      const groupRes = await axios.get(`http://localhost:8787/api/groups/${viewingExpenses}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setExpenses(expensesRes.data.expenses || []);
      setGroupData(groupRes.data.group);
      alert('Expense deleted successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting expense');
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
        
        // Load saved groups from localStorage for THIS USER only
        const userGroupsKey = `myGroups_${decoded.id}`;
        const savedGroups = JSON.parse(localStorage.getItem(userGroupsKey) || '[]');
        setMyGroups(savedGroups);
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

  const goToExpenses = (gId) => {
    navigate(`/expenses?groupId=${gId}`);
  };

  return (
    <>
      <Navbar />
      <div className="groups-page">
        {/* User ID Display */}
        {currentUserId && (
          <div style={{ maxWidth: '1200px', margin: '20px auto', padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '8px', border: '2px solid #1a73e8' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#666' }}>Your User ID (for adding expenses):</p>
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
                  fontWeight: '600'
                }}
              >
                Copy User ID
              </button>
            </div>
          </div>
        )}

        {/* My Groups Section */}
        {myGroups.length > 0 && (
          <div style={{ maxWidth: '1200px', margin: '20px auto' }}>
            <div className="group-card">
              <h2>My Groups</h2>
              <p style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>Quick access to your groups</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '15px' }}>
                {myGroups.map((group, idx) => (
                  <div 
                    key={idx}
                    style={{
                      padding: '15px',
                      backgroundColor: '#f8f9fa',
                      borderRadius: '8px',
                      border: '2px solid #e0e0e0'
                    }}
                  >
                    <h3 style={{ margin: '0 0 8px 0', color: '#18c783', fontSize: '16px' }}>{group.name}</h3>
                    {group.description && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>{group.description}</p>
                    )}
                    <p style={{ margin: '0 0 12px 0', fontSize: '11px', color: '#999', wordBreak: 'break-all' }}>
                      ID: {group.id}
                    </p>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => goToExpenses(group.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '5px',
                          border: 'none',
                          background: '#18c783',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        Add Expense
                      </button>
                      <button 
                        onClick={() => viewExpenses(group.id)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '5px',
                          border: '1px solid #18c783',
                          background: 'white',
                          color: '#18c783',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: '600'
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

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
                  onClick={() => goToExpenses(createdGroupId)}
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
                  Add Expense
                </button>
                <button 
                  onClick={() => viewExpenses(createdGroupId)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    border: '1px solid #18c783',
                    background: 'white',
                    color: '#18c783',
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
                  onClick={() => goToExpenses(joinedGroup._id)}
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
                  Add Expense
                </button>
                <button 
                  onClick={() => viewExpenses(joinedGroup._id)}
                  style={{
                    padding: '8px 15px',
                    borderRadius: '5px',
                    border: '1px solid #18c783',
                    background: 'white',
                    color: '#18c783',
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
            
            {/* Group Members Section */}
            {groupData && groupData.members && (
              <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #b3d9ff' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', color: '#1a73e8' }}>
                  👥 Group Members ({groupData.members.length})
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {groupData.members.map((member, idx) => {
                    // Debug: log the member object structure
                    console.log('Member object:', member);
                    
                    // Handle both populated and non-populated members
                    let displayName;
                    if (typeof member === 'string') {
                      // Just an ID
                      displayName = `Member ${idx + 1}`;
                    } else if (member && typeof member === 'object') {
                      // Object - check for _id (populated) vs direct properties
                      displayName = member.name || member.email || (member._id ? `User ${member._id.slice(-4)}` : `Member ${idx + 1}`);
                    } else {
                      displayName = `Member ${idx + 1}`;
                    }
                    
                    return (
                      <div 
                        key={member._id || member || idx}
                        style={{
                          padding: '8px 15px',
                          backgroundColor: 'white',
                          borderRadius: '20px',
                          border: '1px solid #1a73e8',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#333'
                        }}
                      >
                        {displayName}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                          <span style={{ color: '#18c783', fontWeight: '600', fontSize: '20px' }}>${expense.totalAmount}</span>
                          {(isCreator || expense.paidBy?._id === currentUserId) && (
                            <button
                              onClick={() => deleteExpense(expense._id)}
                              style={{
                                padding: '6px 12px',
                                borderRadius: '5px',
                                border: 'none',
                                background: '#dc3545',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '600'
                              }}
                            >
                              🗑️ Delete
                            </button>
                          )}
                        </div>
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
    </>
  );
};

export default GroupPage;
