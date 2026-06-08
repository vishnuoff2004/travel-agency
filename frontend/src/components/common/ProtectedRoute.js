import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function ProtectedRoute() {
  const { token, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!token) return <Navigate to="/login" state={{ from: location }} replace />;

  return <Outlet />;
}

export default ProtectedRoute;
