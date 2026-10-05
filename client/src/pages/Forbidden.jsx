import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Forbidden = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleSwitchAccount = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-rose-50 border border-rose-200 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <span className="inline-block px-3 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
          403 Access Denied
        </span>
        <h1 className="text-2xl font-bold text-slate-900 mt-2 mb-3">Admin Privileges Required</h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          You are currently logged in as <span className="font-semibold text-slate-800">{user?.name || 'Customer'}</span> ({user?.email}) with role <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded text-indigo-700 font-semibold">{user?.role}</span>. This operational zone is restricted strictly to administrators.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleSwitchAccount}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
          >
            <LogIn className="w-4 h-4" />
            Sign in with Admin Credentials
          </button>
          <Link
            to="/"
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Forbidden;
