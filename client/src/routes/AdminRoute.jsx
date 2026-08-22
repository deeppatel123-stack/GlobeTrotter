import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '80vh' }}>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>Checking admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    toast.error('Admin privileges required to access this resource.');
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
