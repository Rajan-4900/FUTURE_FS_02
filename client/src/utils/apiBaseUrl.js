/**
 * API base URL for axios.
 * - Production (Vercel): always `/api` — Edge middleware proxies to Render (no CORS issues).
 * - Development: `/api` via Vite proxy, or VITE_API_URL if set.
 */
export function getApiBaseUrl() {
  if (import.meta.env.PROD) {
    return '/api';
  }

  const envUrl = import.meta.env.VITE_API_URL?.trim();
  if (envUrl) {
    return envUrl.replace(/\/$/, '');
  }

  return '/api';
}
