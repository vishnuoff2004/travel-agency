import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function UserManagementPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    api.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const handleToggle = async (id) => {
    try {
      await api.put(`/admin/users/${id}/deactivate`);
      setUsers(prev => prev.map(u => u.id === id ? { ...u, active: !u.active } : u));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1>User Management</h1>
      {users.map(u => (
        <div key={u.id}>
          {u.name} ({u.email}) - {u.active ? 'Active' : 'Inactive'}
          <button onClick={() => handleToggle(u.id)}>{u.active ? 'Deactivate' : 'Activate'}</button>
        </div>
      ))}
    </div>
  );
}

export default UserManagementPage;
