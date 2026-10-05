import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Forbidden from '../../pages/Forbidden';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const { error } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        error('Authentication required. Please log in with admin credentials.');
      } else if (user?.role !== 'admin') {
        error('403 Forbidden: You do not have permission to access the Admin Panel.');
      }
    }
  }, [loading, isAuthenticated, user, error]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-slate-600">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  if (user?.role !== 'admin') {
    return <Forbidden />;
  }

  return children;
};

export default AdminRoute;
