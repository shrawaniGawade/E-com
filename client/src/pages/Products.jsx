import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, ShoppingBag, Layers, RefreshCw } from 'lucide-react';
import { productService } from '../services/productService';
import { categoryService } from '../services/categoryService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatCurrency';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchKeyword, setSearchKeyword] = useState(initialSearch);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productService.getProducts({
          category: selectedCategory === 'All' ? undefined : selectedCategory,
          search: searchKeyword.trim() || undefined,
        }),
        categoryService.getCategories(),
      ]);

      if (prodRes?.data) setProducts(prodRes.data);
      if (catRes?.data) setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching catalog:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchKeyword]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleCategorySelect = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'All') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchKeyword(val);
    if (val.trim()) {
      searchParams.set('search', val.trim());
    } else {
      searchParams.delete('search');
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Our Catalog</h1>
        <p className="text-sm text-slate-500 mt-2">
          Browse verified electronics, fashion, and footwear with instant stock status and secure checkout.
        </p>
      </div>

      {/* Filter & Search Header */}
      <div className="flex flex-col gap-5">
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            id="product-search-input"
            placeholder="Search by product name, features, or keywords..."
            value={searchKeyword}
            onChange={handleSearchChange}
            className="w-full pl-12 pr-4 py-3 text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 shadow-xs transition-all font-medium"
          />
        </div>

        {/* Category Pills Strip */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-2">
          <button
            onClick={() => handleCategorySelect('All')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'All'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102'
                : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
            }`}
          >
            All Products
          </button>

          {categories.map((c) => {
            const isActive = selectedCategory === c._id;
            return (
              <button
                key={c._id}
                onClick={() => handleCategorySelect(c._id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-102'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                }`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 pb-3">
        <span>
          Showing <span className="font-bold text-slate-800">{products.length}</span> items
        </span>
        <button
          onClick={fetchCatalog}
          className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-24 text-center">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Loading catalog items...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 max-w-md mx-auto">
          <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching products</h3>
          <p className="text-xs text-slate-500 mt-1 mb-5">
            We couldn't find any products matching your current filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchKeyword('');
              setSearchParams({});
            }}
            className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => {
            const isOutOfStock = p.stock <= 0;
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Thumbnail Image */}
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
                  <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-indigo-700 text-[10px] font-bold rounded-lg shadow-xs">
                    {p.category?.name || 'Item'}
                  </span>
                </Link>

                {/* Details */}
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
                          <span className="text-emerald-700 font-semibold">{p.stock} available</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(p, 1)}
                      disabled={isOutOfStock}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors disabled:opacity-40 disabled:cursor-not-allowed active:scale-98"
                      title="Add to Cart"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
