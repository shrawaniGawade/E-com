import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, ShieldCheck, Zap, Truck, Sparkles } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts(),
        ]);

        if (catRes?.data) setCategories(catRes.data);
        if (prodRes?.data) setFeaturedProducts(prodRes.data.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home page content:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white mt-4 mx-4 sm:mx-6 lg:mx-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-950 via-slate-900 to-indigo-900/60 opacity-90" />
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 sm:py-24 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-6">
            <Sparkles className="w-3.5 h-3.5" /> Premium Curated Collection
          </span>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Curated Essentials, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-300">
              Delivered to Your Doorstep.
            </span>
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal">
            Explore authentic audio devices, smart wearables, and tailored apparel with full stock transparency and Cash on Delivery protection.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/products"
              id="hero-explore-btn"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-indigo-600/30 transition-all hover:scale-102"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white text-sm font-bold rounded-2xl border border-white/20 backdrop-blur-sm transition-all"
            >
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span>Admin Operations</span>
            </Link>
          </div>
        </div>

        {/* Value Props Row */}
        <div className="relative z-10 border-t border-slate-800 bg-slate-950/60 backdrop-blur-md px-6 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
          <div className="flex items-center justify-center gap-3">
            <Truck className="w-5 h-5 text-indigo-400 shrink-0" />
            <span className="font-semibold text-slate-300">Fast Express Delivery & Free Shipping</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold text-slate-300">Guaranteed Cash On Delivery (COD)</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-5 h-5 text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-300">Live Inventory & Real-time Tracking</span>
          </div>
        </div>
      </section>

      {/* Featured Categories Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore collections curated for your daily lifestyle</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/products?category=${cat._id}`}
              className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-indigo-300 hover:shadow-md transition-all text-center"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white flex items-center justify-center mx-auto mb-3 transition-colors">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 mt-1">
                {cat.description || 'Explore products'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Featured Essentials</h2>
            <p className="text-xs text-slate-500 mt-0.5">Top-rated items currently in stock</p>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 text-sm">Loading featured products...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((p) => {
              const isOutOfStock = p.stock <= 0;
              return (
                <div
                  key={p._id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  <Link to={`/products/${p._id}`} className="relative aspect-square overflow-hidden bg-slate-100">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
                      }}
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-indigo-700 text-[10px] font-bold rounded-lg shadow-xs">
                      {p.category?.name || 'Item'}
                    </span>
                  </Link>

                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <Link
                        to={`/products/${p._id}`}
                        className="font-bold text-sm text-slate-900 hover:text-indigo-600 line-clamp-1 transition-colors"
                      >
                        {p.name}
                      </Link>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    </div>

                    <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-slate-900">
                          {formatCurrency(p.price)}
                        </span>
                        <div className="text-[10px] text-slate-500 font-medium">
                          {isOutOfStock ? (
                            <span className="text-rose-600 font-bold">Out of stock</span>
                          ) : (
                            <span className="text-emerald-700 font-semibold">{p.stock} in stock</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(p, 1)}
                        disabled={isOutOfStock}
                        className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-xl transition-all shadow-xs disabled:opacity-40 disabled:cursor-not-allowed group/btn"
                        title="Add to Cart"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
