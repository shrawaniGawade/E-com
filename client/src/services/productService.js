import api from './api';

export const productService = {
  async getProducts(params = {}) {
    const { category, search } = params;
    const query = new URLSearchParams();
    if (category && category !== 'All') query.append('category', category);
    if (search) query.append('search', search);

    const queryString = query.toString();
    const url = queryString ? `/products?${queryString}` : '/products';
    const response = await api.get(url);
    return response.data; // { success: true, count: N, data: [...] }
  },

  async getProductById(id) {
    const response = await api.get(`/products/${id}`);
    return response.data; // { success: true, data: {...} }
  },

  async createProduct(productData) {
    const response = await api.post('/products', productData);
    return response.data; // { success: true, message: ..., data: {...} }
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/products/${id}`, productData);
    return response.data; // { success: true, message: ..., data: {...} }
  },

  async deleteProduct(id) {
    const response = await api.delete(`/products/${id}`);
    return response.data; // { success: true, message: ... }
  },
};
