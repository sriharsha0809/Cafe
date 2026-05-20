import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const categoriesApi = {
  getAll: () => api.get('/categories'),
};

export const itemsApi = {
  getAll: (params = {}) => api.get('/items', { params }),
  getById: (id) => api.get(`/items/${id}`),
  getFeatured: () => api.get('/items', { params: { featured: true } }),
};

export const cartApi = {
  create: (user_id) => api.post('/cart', { user_id }),
  get: (cart_id) => api.get(`/cart/${cart_id}`),
  addItem: (cart_id, item_id, quantity, price_chosen) =>
    api.post(`/cart/${cart_id}/items`, { item_id, quantity, price_chosen }),
  updateItem: (cart_item_id, quantity) =>
    api.put(`/cart/items/${cart_item_id}`, { quantity }),
  removeItem: (cart_item_id) =>
    api.delete(`/cart/items/${cart_item_id}`),
  clear: (cart_id) => api.delete(`/cart/${cart_id}`),
};

export const ordersApi = {
  create: (orderData) => api.post('/orders', orderData),
  getById: (order_id) => api.get(`/orders/${order_id}`),
};

export default api;
