import React from 'react';
import { ShoppingBag, ShieldCheck, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="text-lg font-bold text-slate-900 tracking-tight">
              Shop<span className="text-indigo-600">Mini</span>
            </span>
            <span className="text-xs text-slate-400 pl-2 border-l border-slate-200">
              Modern MERN Mini E-Commerce
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
            <Link to="/" className="hover:text-indigo-600 transition-colors">
              Storefront
            </Link>
            <Link to="/products" className="hover:text-indigo-600 transition-colors">
              Products
            </Link>
            <Link to="/admin" className="hover:text-indigo-600 transition-colors flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />
              Admin Portal
            </Link>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-1">
            Built with React.js & Tailwind CSS for Admin Operations
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
