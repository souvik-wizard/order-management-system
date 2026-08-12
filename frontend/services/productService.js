import apiClient from '@/lib/apiClient';

/**
 * Product API service.
 * All product-related HTTP calls go through this module.
 * Full implementation in step 2 — these are lightweight wrappers.
 */
export const productAPI = {
  /** GET /api/products */
  getAll: (params = {}) => apiClient.get('/api/products', { params }),

  /** GET /api/products/:id */
  getById: (id) => apiClient.get(`/api/products/${id}`),

  /** POST /api/products */
  create: (data) => apiClient.post('/api/products', data),

  /** PUT /api/products/:id */
  update: (id, data) => apiClient.put(`/api/products/${id}`, data),

  /** DELETE /api/products/:id */
  remove: (id) => apiClient.delete(`/api/products/${id}`),
};
