import api from './api';

export const orderService = {
  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data; // { success: true, message: ..., order: {...} }
  },

  async getMyOrders() {
    const response = await api.get('/orders/my-orders');
    return response.data; // { success: true, count: N, orders: [...] }
  },

  async getAdminOrders() {
    const response = await api.get('/admin/orders');
    return response.data; // { success: true, count: N, orders: [...] }
  },

  async updateOrderStatus(id, status) {
    const response = await api.patch(`/admin/orders/${id}/status`, { status });
    return response.data; // { success: true, message: ..., order: {...} }
  },
};
