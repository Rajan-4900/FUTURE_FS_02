/**
 * Vercel Edge: proxy /api/* to the Render backend (API_URL or VITE_API_URL).
 * Lets the browser use same-origin /api without CORS issues.
 */
export const config = {
  matcher: '/api/:path*',
};

function resolveApiRoot() {
  const raw = process.env.API_URL || process.env.VITE_API_URL;
  if (!raw?.trim()) return null;
  return raw.trim().replace(/\/$/, '');
}

export default async function middleware(request) {
  const apiRoot = resolveApiRoot();

  if (!apiRoot) {
    return Response.json(
      {
        success: false,
        message:
          'API is not configured. In Vercel → Settings → Environment Variables, set API_URL to your Render URL (e.g. https://your-app.onrender.com/api), then redeploy.',
      },
      { status: 503 }
    );
  }

  const incoming = new URL(request.url);
  const host = apiRoot.replace(/\/api$/, '');
  const target = `${host}${incoming.pathname}${incoming.search}`;

  const headers = new Headers(request.headers);
  headers.delete('host');

  return fetch(target, {
    method: request.method,
    headers,
    body:
      request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
  });
}
