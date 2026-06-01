export const validateEmail = (email) => {
  if (!email?.trim()) return 'Email is required';
  if (!/^\S+@\S+\.\S+$/.test(email.trim())) return 'Enter a valid email address';
  return '';
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) return 'Password is required';
  if (password.length < minLength) return `Password must be at least ${minLength} characters`;
  return '';
};

export const validateName = (name) => {
  if (!name?.trim()) return 'Name is required';
  if (name.trim().length < 2) return 'Name must be at least 2 characters';
  return '';
};

export const getApiError = (error, fallback = 'Something went wrong') => {
  if (!error?.response) {
    if (error?.code === 'ERR_NETWORK' || error?.message === 'Network Error') {
      if (import.meta.env.PROD) {
        return `Cannot reach the API. On Vercel set API_URL to your Render URL (…/api), delete VITE_API_URL, redeploy, then open ${window.location.origin}/api/health — it must return JSON.`;
      }
      return 'Cannot reach the server. Open a terminal in the server folder and run: npm run dev';
    }
    if (error?.message) return error.message;
    return fallback;
  }

  const data = error.response.data;
  if (data?.message) return data.message;
  if (data?.errors?.[0]?.message) return data.errors[0].message;
  if (data?.errors?.[0]?.msg) return data.errors[0].msg;
  return fallback;
};
