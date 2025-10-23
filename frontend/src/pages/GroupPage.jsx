// frontend/src/pages/GroupPage.jsx
// Page to create and join groups. Expects a JWT stored in localStorage under 'token'.
import React, { useState } from 'react';
import axios from 'axios';

const GroupPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [groupId, setGroupId] = useState('');

  const token = localStorage.getItem('token');

  const createGroup = async () => {
    try {
      const res = await axios.post('/api/groups/create', { name, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating group');
    }
  };

  const joinGroup = async () => {
    try {
      const res = await axios.post(`/api/groups/join/${groupId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Error joining group');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Create Group</h2>
      <input placeholder="Group name" onChange={e => setName(e.target.value)} />
      <br />
      <input placeholder="Description (optional)" onChange={e => setDescription(e.target.value)} />
      <br />
      <button onClick={createGroup}>Create</button>
      <hr />
      <h3>Join Group</h3>
      <input placeholder="Group ID" onChange={e => setGroupId(e.target.value)} />
      <button onClick={joinGroup}>Join</button>
    </div>
  );
};

export default GroupPage;
