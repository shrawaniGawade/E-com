import React, { useState, useEffect, useCallback } from 'react';
import {
  ShoppingBag,
  Search,
  RefreshCw,
  Eye,
  MapPin,
  Clock,
  User,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Truck,
} from 'lucide-react';
import { orderService } from '../../services/orderService';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../../components/admin/StatusBadge';
import Modal from '../../components/common/Modal';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Updating status ID
  const [updatingId, setUpdatingId] = useState(null);

  // Selected Order for Modal View
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { success, error: showError } = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await orderService.getAdminOrders();
      if (res && res.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      showError(`Failed to fetch orders queue: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Real-time Status Change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await orderService.updateOrderStatus(orderId, newStatus);
      success(res.message || `Order status updated to ${newStatus}`);

      // Optimistically update order in state
      setOrders((prev) =>
        prev.map((ord) => (ord._id === orderId ? { ...ord, status: newStatus } : ord))
      );

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showError(`Status update failed: ${err.message}`);
    } finally {
      setUpdatingId(null);
    }
  };

  // Open Details Modal
  const handleOpenDetails = (order) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Filtered orders
  const filteredOrders = orders.filter((order) => {
    const q = searchQuery.toLowerCase();
    const customerName = order.user?.name || order.shippingAddress?.name || '';
    const customerEmail = order.user?.email || '';
    const orderId = order._id || '';

    const matchesSearch =
      customerName.toLowerCase().includes(q) ||
      customerEmail.toLowerCase().includes(q) ||
      orderId.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner / Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-900">Customer Orders Queue</h2>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Track customer checkout orders, review shipping addresses, and transition lifecycle statuses in real-time.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchOrders}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-semibold rounded-xl transition-colors"
            title="Refresh order queue"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Queue</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs by Status */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {['All', ...ORDER_STATUSES].map((status) => {
          const count =
            status === 'All'
              ? orders.length
              : orders.filter((o) => o.status === status).length;

          const isActive = statusFilter === status;

          return (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap flex items-center gap-1.5 ${
                isActive
                  ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <span>{status}</span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, email, or order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing: <span className="text-indigo-600 font-bold">{filteredOrders.length}</span> of {orders.length} Orders
        </div>
      </div>

      {/* Order Listing Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-500">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-sm font-medium">Loading customer orders queue...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No orders found</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              {searchQuery || statusFilter !== 'All'
                ? 'Try adjusting your search criteria or status filter tab.'
                : 'No customer orders have been placed yet.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-6">Order ID & Date</th>
                  <th className="py-3.5 px-6">Customer</th>
                  <th className="py-3.5 px-6">Items Summary</th>
                  <th className="py-3.5 px-6">Total Amount</th>
                  <th className="py-3.5 px-6">Status & Updater</th>
                  <th className="py-3.5 px-6 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredOrders.map((order) => {
                  const customerName =
                    order.user?.name || order.shippingAddress?.name || 'Customer';
                  const customerEmail =
                    order.user?.email || 'N/A';
                  const itemsCount =
                    order.products?.reduce((acc, p) => acc + (p.quantity || 1), 0) || 0;
                  const isUpdating = updatingId === order._id;

                  return (
                    <tr
                      key={order._id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50/80 px-2 py-1 rounded-md inline-block">
                          #{order._id.substring(order._id.length - 8).toUpperCase()}
                        </div>
                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      {/* Customer Name & Email */}
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-900 leading-snug">
                          {customerName}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Mail className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[180px]">{customerEmail}</span>
                        </div>
                      </td>

                      {/* Ordered Items Summary */}
                      <td className="py-4 px-6">
                        <div className="text-xs font-semibold text-slate-800">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'items'}
                        </div>
                        <div className="text-xs text-slate-500 line-clamp-1 max-w-[220px]">
                          {order.products?.map((p) => `${p.name} (x${p.quantity})`).join(', ')}
                        </div>
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-6 font-bold text-slate-900 whitespace-nowrap">
                        {formatCurrency(order.totalAmount)}
                        <span className="block text-[11px] font-normal text-emerald-600">
                          {order.paymentMethod || 'COD'}
                        </span>
                      </td>

                      {/* Real-time Order Status Updater */}
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <StatusBadge status={order.status} />

                          <div className="relative">
                            <select
                              value={order.status}
                              disabled={isUpdating}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                              className="text-xs font-medium bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer disabled:opacity-50"
                            >
                              {ORDER_STATUSES.map((st) => (
                                <option key={st} value={st}>
                                  Set: {st}
                                </option>
                              ))}
                            </select>
                            {isUpdating && (
                              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleOpenDetails(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Order #${selectedOrder._id.substring(selectedOrder._id.length - 8).toUpperCase()}`}
          maxWidth="max-w-2xl"
        >
          <div className="space-y-6">
            {/* Header Status & Placed Time */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs text-slate-500 block">Current Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge status={selectedOrder.status} />
                  <select
                    value={selectedOrder.status}
                    onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                    className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
                  >
                    {ORDER_STATUSES.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">Placed On</span>
                <span className="text-xs font-semibold text-slate-800">
                  {formatDate(selectedOrder.createdAt)}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block">Payment</span>
                <span className="text-xs font-semibold text-emerald-700">
                  {selectedOrder.paymentMethod || 'Cash on Delivery'}
                </span>
              </div>
            </div>

            {/* Customer & Shipping Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-600" />
                  Customer Information
                </h4>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <div className="font-semibold text-slate-900 text-sm">
                    {selectedOrder.user?.name || selectedOrder.shippingAddress?.name || 'Customer'}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Mail className="w-3.5 h-3.5" />
                    {selectedOrder.user?.email || 'N/A'}
                  </div>
                  <div className="flex items-center gap-1 text-slate-500">
                    <Phone className="w-3.5 h-3.5" />
                    {selectedOrder.shippingAddress?.phone || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                  Shipping Address
                </h4>
                <div className="text-xs text-slate-600 space-y-1">
                  <div className="font-medium text-slate-800">
                    {selectedOrder.shippingAddress?.address || '—'}
                  </div>
                  <div>
                    {selectedOrder.shippingAddress?.city},{' '}
                    {selectedOrder.shippingAddress?.pincode}
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1">
                    Recipient: {selectedOrder.shippingAddress?.name}
                  </div>
                </div>
              </div>
            </div>

            {/* Line Items List */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                Ordered Items ({selectedOrder.products?.length || 0})
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {selectedOrder.products?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs bg-white">
                    <div className="flex-1 pr-4">
                      <div className="font-semibold text-slate-900 text-sm">{item.name}</div>
                      <div className="text-slate-500 mt-0.5">
                        Unit Price: {formatCurrency(item.price)} × {item.quantity}
                      </div>
                    </div>
                    <div className="text-right font-bold text-slate-900 text-sm">
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
                <div className="p-4 bg-slate-50/75 flex items-center justify-between border-t border-slate-200">
                  <span className="text-xs font-bold text-slate-700">Order Grand Total:</span>
                  <span className="text-base font-extrabold text-indigo-600">
                    {formatCurrency(selectedOrder.totalAmount)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default AdminOrders;
