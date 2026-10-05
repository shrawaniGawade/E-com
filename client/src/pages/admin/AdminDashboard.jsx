import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Package,
  FolderTree,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Plus,
  Clock,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import StatusBadge from '../../components/admin/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ordersCount: 0,
    productsCount: 0,
    categoriesCount: 0,
    pendingOrdersCount: 0,
    recentOrders: [],
    lowStockProducts: [],
  });

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const [ordersRes, productsRes, categoriesRes] = await Promise.all([
          orderService.getAdminOrders(),
          productService.getProducts(),
          categoryService.getCategories(),
        ]);

        const orders = ordersRes?.orders || [];
        const products = productsRes?.data || [];
        const categories = categoriesRes?.data || [];

        // Compute metrics
        const totalRevenue = orders
          .filter((o) => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

        const pendingOrders = orders.filter((o) => o.status === 'Pending');
        const lowStock = products.filter((p) => p.stock < 5);

        setStats({
          totalRevenue,
          ordersCount: orders.length,
          productsCount: products.length,
          categoriesCount: categories.length,
          pendingOrdersCount: pendingOrders.length,
          recentOrders: orders.slice(0, 5),
          lowStockProducts: lowStock,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 backdrop-blur-md mb-3 border border-white/10">
            <TrendingUp className="w-3.5 h-3.5" /> Operations Intelligence
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Administrator Command Center
          </h2>
          <p className="mt-2 text-indigo-200 text-sm leading-relaxed">
            Monitor real-time storefront sales, process pending customer orders, and maintain complete catalog inventory.
          </p>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            <Link
              to="/admin/products"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-indigo-900 hover:bg-indigo-50 text-xs font-bold rounded-xl transition-all shadow-sm active:scale-98"
            >
              <Plus className="w-3.5 h-3.5" />
              Manage Inventory
            </Link>
            <Link
              to="/admin/orders"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-700/60 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition-all border border-indigo-500/40"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Process Orders Queue
            </Link>
          </div>
        </div>

        {/* Decorative background blur circle */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Gross Revenue
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : formatCurrency(stats.totalRevenue)}
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Total Orders
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : stats.ordersCount}
            </span>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Live Products
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : stats.productsCount}
            </span>
          </div>
        </div>

        {/* Categories */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center shrink-0">
            <FolderTree className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              Categories
            </span>
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {loading ? '...' : stats.categoriesCount}
            </span>
          </div>
        </div>
      </div>

      {/* Low Stock Warning Banner if any */}
      {stats.lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs text-amber-900">
            <span className="font-bold text-sm block mb-0.5">Low Stock Attention Required</span>
            {stats.lowStockProducts.length} product(s) have available inventory under 5 units:{' '}
            <span className="font-semibold">
              {stats.lowStockProducts.map((p) => `${p.name} (${p.stock} left)`).join(', ')}
            </span>
            . Consider restocking to avoid order fulfillment interruptions.
          </div>
          <Link
            to="/admin/products"
            className="text-xs font-bold text-amber-800 underline hover:text-amber-900 whitespace-nowrap self-center"
          >
            Review Stock
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Customer Orders</h3>
            <p className="text-xs text-slate-500 mt-0.5">Latest transactions submitted via storefront checkout</p>
          </div>
          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
          >
            <span>View All Queue</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">Loading recent orders...</div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No customer orders recorded yet. Place a test order from the storefront!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                  <th className="py-3 px-6">Order ID</th>
                  <th className="py-3 px-6">Customer</th>
                  <th className="py-3 px-6">Total</th>
                  <th className="py-3 px-6">Status</th>
                  <th className="py-3 px-6 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats.recentOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-6 font-mono font-bold text-indigo-700">
                      #{o._id.substring(o._id.length - 8).toUpperCase()}
                    </td>
                    <td className="py-3 px-6 font-medium text-slate-800">
                      {o.user?.name || o.shippingAddress?.name || 'Customer'}
                    </td>
                    <td className="py-3 px-6 font-bold text-slate-900">
                      {formatCurrency(o.totalAmount)}
                    </td>
                    <td className="py-3 px-6">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="py-3 px-6 text-right text-slate-500">
                      {formatDate(o.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
