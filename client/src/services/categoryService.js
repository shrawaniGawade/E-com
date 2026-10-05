import api from './api';

export const categoryService = {
  async getCategories() {
    const response = await api.get('/categories');
    return response.data; // { success: true, count: N, data: [...] }
  },

  async createCategory(categoryData) {
    const response = await api.post('/categories', categoryData);
    return response.data; // { success: true, message: ..., data: {...} }
  },

  async updateCategory(id, categoryData) {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data; // { success: true, message: ..., data: {...} }
  },

  async deleteCategory(id) {
    const response = await api.delete(`/categories/${id}`);
    return response.data; // { success: true, message: ... }
  },
};
