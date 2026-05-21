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
      return 'Cannot reach the server. Open a terminal in the server folder and run: npm run dev';
    }
    if (error?.message) return error.message;
    return fallback;
  }

  const data = error.response.data;
  if (data?.errors?.length) {
    return data.errors.map((e) => e.message || e.msg).filter(Boolean).join('. ');
  }
  if (data?.message && data.message !== 'Validation failed') return data.message;
  if (data?.message) return data.message;
  return fallback;
};
