import apiClient from '@/lib/apiClient';

const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export const orderAPI = {
  create: (data) => apiClient.post('/api/orders', data),

  getAll: () => apiClient.get('/api/orders'),

  getById: (id) => apiClient.get(`/api/orders/${id}`),

  updateStatus: (id, status) => apiClient.patch(`/api/orders/${id}/status`, { status }),

  remove: (id) => apiClient.delete(`/api/orders/${id}`),
  
  getStatusStreamUrl: (id) => `${API_BASE}/api/orders/${id}/status/stream`,
};
