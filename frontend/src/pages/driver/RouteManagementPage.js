import React, { useState } from 'react';
import api from '../../services/api';

function RouteManagementPage() {
  const [form, setForm] = useState({ source: '', destination: '', departureTime: '', arrivalTime: '', fare: '', capacity: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/drivers/routes', form);
      alert('Route created!');
      setForm({ source: '', destination: '', departureTime: '', arrivalTime: '', fare: '', capacity: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create route');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Manage Routes</h1>
      <form onSubmit={handleSubmit}>
        <input name="source" placeholder="Source" value={form.source} onChange={handleChange} required />
        <input name="destination" placeholder="Destination" value={form.destination} onChange={handleChange} required />
        <input name="departureTime" type="datetime-local" value={form.departureTime} onChange={handleChange} required />
        <input name="arrivalTime" type="datetime-local" value={form.arrivalTime} onChange={handleChange} required />
        <input name="fare" type="number" placeholder="Fare" value={form.fare} onChange={handleChange} required />
        <input name="capacity" type="number" placeholder="Capacity" value={form.capacity} onChange={handleChange} required />
        <button type="submit" disabled={loading}>Create Route</button>
      </form>
    </div>
  );
}

export default RouteManagementPage;
