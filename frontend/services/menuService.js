import apiClient from '@/lib/apiClient';

export const menuAPI = {
  getAll: () => apiClient.get('/api/menu'),
};
