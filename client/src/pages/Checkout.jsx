import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatCurrency';

const Checkout = () => {
  const { user } = useAuth();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { success, error: showError } = useToast();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: user?.name || '',
    phone: '+1-555-0199',
    address: '452 Elm Street, Apt 3B',
    city: 'Metropolis',
    pincode: '10001',
  });

  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
        <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-1 mb-5">
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          Browse Products
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errors = {};
    if (!shippingAddress.name.trim()) errors.name = 'Full name is required';
    if (!shippingAddress.phone.trim()) errors.phone = 'Phone number is required';
    if (!shippingAddress.address.trim()) errors.address = 'Street address is required';
    if (!shippingAddress.city.trim()) errors.city = 'City is required';
    if (!shippingAddress.pincode.trim()) errors.pincode = 'Pincode is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);

      const items = cartItems.map((item) => ({
        productId: item.product._id,
        quantity: item.quantity,
      }));

      const payload = {
        items,
        shippingAddress,
      };

      const res = await orderService.createOrder(payload);

      if (res && res.order) {
        success(res.message || 'Order placed successfully with Cash on Delivery!');
        clearCart();
        navigate('/my-orders');
      }
    } catch (err) {
      showError(err.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Checkout & Shipping</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Confirm your delivery address and finalize order with Cash on Delivery.
          </p>
        </div>
        <Link
          to="/cart"
          className="text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Shipping Information Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-slate-100">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
              1
            </div>
            <h2 className="text-base font-bold text-slate-900">Delivery Address Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Recipient Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="shipping-name"
                required
                placeholder="Jane Doe"
                value={shippingAddress.name}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, name: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
              />
              {formErrors.name && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Contact Phone <span className="text-rose-500">*</span>
              </label>
              <input
                type="tel"
                id="shipping-phone"
                required
                placeholder="+1-555-0199"
                value={shippingAddress.phone}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, phone: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
              />
              {formErrors.phone && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Street Address <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              id="shipping-address"
              required
              placeholder="452 Elm Street, Suite 3B"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
              className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
            />
            {formErrors.address && (
              <p className="text-xs text-rose-600 mt-1">{formErrors.address}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                City <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="shipping-city"
                required
                placeholder="Metropolis"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
              />
              {formErrors.city && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Pincode / Postal Code <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="shipping-pincode"
                required
                placeholder="10001"
                value={shippingAddress.pincode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, pincode: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-900"
              />
              {formErrors.pincode && (
                <p className="text-xs text-rose-600 mt-1">{formErrors.pincode}</p>
              )}
            </div>
          </div>

          {/* Payment Method Details */}
          <div className="pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-bold text-slate-900">Payment Method</h2>
            </div>

            <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="text-xs font-extrabold text-emerald-900 block">
                  Cash on Delivery (COD)
                </span>
                <span className="text-[11px] text-emerald-700 block mt-0.5">
                  Pay with physical cash upon receiving your parcel. No advance card payment required.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Order Review & Placement */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Review Items ({cartItems.length})
          </h2>

          <div className="divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
            {cartItems.map(({ product, quantity }) => (
              <div key={product._id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="pr-3 flex-1 min-w-0">
                  <div className="font-semibold text-slate-900 truncate">{product.name}</div>
                  <div className="text-[11px] text-slate-400">Qty: {quantity}</div>
                </div>
                <div className="font-bold text-slate-900 whitespace-nowrap">
                  {formatCurrency(product.price * quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Shipping Fee</span>
              <span className="font-bold text-emerald-600">FREE</span>
            </div>
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Total Due</span>
              <span className="font-black text-xl text-indigo-600">
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>

          <button
            type="submit"
            id="place-order-submit-btn"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all disabled:opacity-50 active:scale-98"
          >
            {loading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {loading ? 'Processing Order...' : 'Place Order (Cash on Delivery)'}
          </button>

          <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Atomic Stock Decrement & Secure COD</span>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
