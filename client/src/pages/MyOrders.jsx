import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { orderService } from '../services/orderService';
import StatusBadge from '../components/admin/StatusBadge';
import { formatCurrency, formatDate } from '../utils/formatCurrency';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getMyOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">My Order History</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time status transitions for your placed orders.
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Fetching order history...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8">
          <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Orders Placed Yet</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our catalog essentials and place your first order with COD.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl shadow-xs"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4"
            >
              {/* Order Top Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-extrabold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(order.createdAt)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Status:</span>
                  <StatusBadge status={order.status} />
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {order.products?.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="text-slate-400 ml-2">
                        ({formatCurrency(item.price)} × {item.quantity})
                      </span>
                    </div>
                    <span className="font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Footer: Shipping & Total */}
              <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-start gap-1.5 text-slate-500 max-w-md">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    Delivering to: <span className="font-semibold text-slate-700">{order.shippingAddress?.name}</span>,{' '}
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}{' '}
                    ({order.shippingAddress?.pincode})
                  </span>
                </div>

                <div className="flex items-baseline gap-2 self-end sm:self-auto">
                  <span className="text-slate-500">Total Paid (COD):</span>
                  <span className="text-base font-extrabold text-indigo-600">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
