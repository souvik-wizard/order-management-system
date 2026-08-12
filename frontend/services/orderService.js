import apiClient from '@/lib/apiClient';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Order API service — wraps all /api/orders endpoints.
 */
export const orderAPI = {
  /** POST /api/orders */
  create: (data) => apiClient.post('/api/orders', data),

  /** GET /api/orders */
  getAll: () => apiClient.get('/api/orders'),

  /** GET /api/orders/:id */
  getById: (id) => apiClient.get(`/api/orders/${id}`),

  /** PATCH /api/orders/:id/status */
  updateStatus: (id, status) => apiClient.patch(`/api/orders/${id}/status`, { status }),

  /** DELETE /api/orders/:id */
  remove: (id) => apiClient.delete(`/api/orders/${id}`),

  /**
   * Returns the raw SSE URL (not an axios call — uses native EventSource).
   * @param {string} id
   * @returns {string}
   */
  getStatusStreamUrl: (id) => `${API_BASE}/api/orders/${id}/status/stream`,
};
