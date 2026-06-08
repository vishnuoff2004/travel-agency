import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function AgencyManagementPage() {
  const [agencies, setAgencies] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', phone: '' });

  useEffect(() => {
    api.get('/admin/users').then(() => {}).catch(() => {});
    api.get('/dashboard/admin').then(res => {
      setAgencies(prev => prev);
    }).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/agencies', form);
      setForm({ name: '', email: '', phone: '' });
      alert('Agency created');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await api.put(`/admin/agencies/${id}/deactivate`);
      setAgencies(prev => prev.map(a => a.id === id ? { ...a, active: false } : a));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed');
    }
  };

  return (
    <div>
      <h1>Agency Management</h1>
      <form onSubmit={handleCreate}>
        <input placeholder="Name" value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} required />
        <input placeholder="Email" value={form.email} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} required />
        <input placeholder="Phone" value={form.phone} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} required />
        <button type="submit">Create Agency</button>
      </form>
    </div>
  );
}

export default AgencyManagementPage;
