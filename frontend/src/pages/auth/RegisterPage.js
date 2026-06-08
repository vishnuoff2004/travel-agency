import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';

function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <h1>Register</h1>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div><label>Name</label><input name="name" value={form.name} onChange={handleChange} required /></div>
        <div><label>Email</label><input name="email" type="email" value={form.email} onChange={handleChange} required /></div>
        <div><label>Password</label><input name="password" type="password" value={form.password} onChange={handleChange} required /></div>
        <div><label>Phone</label><input name="phone" value={form.phone} onChange={handleChange} required /></div>
        <button type="submit" disabled={loading}>{loading ? 'Loading...' : 'Register'}</button>
      </form>
      <p>Already have an account? <Link to="/login">Login</Link></p>
    </div>
  );
}

export default RegisterPage;
