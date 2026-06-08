import React, { useState, useEffect } from 'react';
import api from '../../services/api';

function DriverManagementPage() {
  const [drivers, setDrivers] = useState([]);
  const [driverId, setDriverId] = useState('');

  useEffect(() => {
    api.get('/agency/drivers').then(res => setDrivers(res.data.data || [])).catch(() => {});
  }, []);

  const handleAdd = async () => {
    try {
      await api.post('/agency/drivers', { driverId: Number(driverId) });
      setDriverId('');
      const res = await api.get('/agency/drivers');
      setDrivers(res.data.data || []);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add driver');
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/agency/drivers/${id}`);
      setDrivers(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove driver');
    }
  };

  return (
    <div>
      <h1>Manage Drivers</h1>
      <div>
        <input placeholder="Driver ID" value={driverId} onChange={e => setDriverId(e.target.value)} />
        <button onClick={handleAdd}>Add Driver</button>
      </div>
      {drivers.map(d => (
        <div key={d.id}>
          {d.name} - {d.vehicleReg} <button onClick={() => handleRemove(d.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
}

export default DriverManagementPage;
