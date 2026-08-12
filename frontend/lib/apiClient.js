import axios from 'axios';

/**
 * Pre-configured Axios instance.
 * All API calls should use this client so that headers and base URL
 * are set consistently in one place.
 */
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000, // 10 seconds
});

// ── Request interceptor ────────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    // Attach auth token here in a future step
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor ───────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data, // unwrap the `data` envelope
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred';

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
