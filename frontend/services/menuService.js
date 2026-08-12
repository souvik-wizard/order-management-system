import apiClient from '@/lib/apiClient';

/**
 * Menu API service — wraps the /api/menu endpoint.
 */
export const menuAPI = {
  /** GET /api/menu */
  getAll: () => apiClient.get('/api/menu'),
};
