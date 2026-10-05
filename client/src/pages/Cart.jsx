import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } =
    useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-white rounded-3xl border border-slate-200 text-center shadow-xs">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Looks like you haven't added any essentials to your shopping bag yet.
        </p>
        <Link
          to="/products"
          id="cart-start-shopping-btn"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/20 transition-all"
        >
          <span>Start Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Shopping Cart</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review line items, adjust quantities, and proceed to shipping checkout.
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map(({ product, quantity }) => {
            const itemSubtotal = product.price * quantity;
            const isMaxStock = quantity >= product.stock;

            return (
              <div
                key={product._id}
                className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4"
              >
                {/* Product Info */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-18 h-18 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&q=80';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/products/${product._id}`}
                      className="font-bold text-sm text-slate-900 hover:text-indigo-600 truncate block transition-colors"
                    >
                      {product.name}
                    </Link>
                    <span className="text-xs text-slate-400 block mt-0.5">
                      Unit: {formatCurrency(product.price)}
                    </span>
                    <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
                      {product.stock} available in stock
                    </span>
                  </div>
                </div>

                {/* Quantity Controls & Line Subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Stepper */}
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => updateQuantity(product._id, quantity - 1)}
                      className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
                      title="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(product._id, quantity + 1)}
                      disabled={isMaxStock}
                      className="p-1.5 sm:p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors disabled:opacity-40"
                      title={isMaxStock ? 'Maximum stock reached' : 'Increase'}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-[80px]">
                    <span className="text-sm font-extrabold text-slate-900 block">
                      {formatCurrency(itemSubtotal)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(product._id)}
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Sidebar */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
            Order Summary
          </h2>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Items Total ({cartCount})</span>
              <span className="font-semibold text-slate-900">{formatCurrency(cartTotal)}</span>
            </div>

            <div className="flex items-center justify-between text-slate-600">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-emerald-600 uppercase text-[11px] font-bold">
                Free Express (COD)
              </span>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="font-bold text-slate-900">Grand Total</span>
              <span className="font-black text-xl text-indigo-600">
                {formatCurrency(cartTotal)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            id="proceed-to-checkout-btn"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/25 transition-all active:scale-98"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center justify-center gap-1.5 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Server-side price verification on checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
