/**
 * API base URL for axios. Production on Vercel uses /api (proxied via middleware).
 * Set VITE_API_URL only if you call Render directly (requires CORS on the API).
 */
export function getApiBaseUrl() {
  const envUrl = import.meta.env.VITE_API_URL?.trim();

  if (envUrl) {
    if (import.meta.env.PROD && /localhost|127\.0\.0\.1/i.test(envUrl)) {
      return '/api';
    }
    return envUrl.replace(/\/$/, '');
  }

  return '/api';
}
