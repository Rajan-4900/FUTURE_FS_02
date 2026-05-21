import { useState, useEffect } from 'react';
import { getSetupStatus } from '../api/auth';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthCard from '../components/auth/AuthCard';
import AuthAlert from '../components/auth/AuthAlert';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { validateEmail, validatePassword, getApiError } from '../utils/validateForm';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState(location.state?.message || '');
  const [loading, setLoading] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  useEffect(() => {
    getSetupStatus()
      .then(({ data }) => setNeedsSetup(data.needsSetup))
      .catch(() => setNeedsSetup(false));
  }, []);

  const validate = () => {
    const errors = {
      email: validateEmail(form.email),
      password: validatePassword(form.password),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleBlur = (field) => {
    const validators = {
      email: () => validateEmail(form.email),
      password: () => validatePassword(form.password),
    };
    setFieldErrors((prev) => ({ ...prev, [field]: validators[field]() }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(getApiError(err, 'Sign in failed. Check your credentials and try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Admin sign in"
      subtitle="Administrator access only. Sign in to manage leads and deals."
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <AuthAlert message={error} />

        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          onBlur={() => handleBlur('email')}
          placeholder="admin@company.com"
          error={fieldErrors.email}
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => handleBlur('password')}
          placeholder="••••••••"
          error={fieldErrors.password}
          disabled={loading}
        />

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Signing in...
            </>
          ) : (
            'Sign in'
          )}
        </Button>
      </form>

      {needsSetup ? (
        <p className="mt-6 text-center text-sm text-muted">
          First-time setup?{' '}
          <Link to="/register" className="font-medium text-primary hover:underline">
            Create admin account
          </Link>
        </p>
      ) : (
        <p className="mt-6 text-center text-xs text-muted">
          This application is restricted to administrators.
        </p>
      )}
    </AuthCard>
  );
}
