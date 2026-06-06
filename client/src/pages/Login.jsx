import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Eye, EyeOff, LogIn, UserPlus } from 'lucide-react';
import AuthCard from '../components/auth/AuthCard';
import AuthAlert from '../components/auth/AuthAlert';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { getSetupStatus } from '../api/auth';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();

  const [isRegistering, setIsRegistering] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  // Check if this is the first admin setup
  useEffect(() => {
    getSetupStatus()
      .then(({ data }) => {
        if (!data.adminExists) {
          setNeedsSetup(true);
          setIsRegistering(true);
        }
      })
      .catch(() => {
        // Server may not be running; just show login
      })
      .finally(() => setChecking(false));
  }, []);

  // Show message from location state (e.g. "Admin access required")
  useEffect(() => {
    if (location.state?.message) {
      setError(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegistering) {
        await register(form);
      } else {
        await login({ email: form.email, password: form.password });
      }
      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        (isRegistering ? 'Registration failed.' : 'Invalid credentials.');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const update = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-background)]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-background)] px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mb-3 flex justify-center">
          <img src="/logo.svg" alt="Future CRM logo" className="h-10 w-10 rounded-xl" />
        </div>
        <p className="text-sm font-medium text-slate-500">Future CRM</p>
        <p className="mt-1 text-xs text-muted">Admin workspace</p>
      </div>

      <AuthCard
        title={needsSetup ? 'Create admin account' : isRegistering ? 'Register' : 'Welcome back'}
        subtitle={
          needsSetup
            ? 'Set up your admin account to get started.'
            : isRegistering
            ? 'Create a new admin account.'
            : 'Sign in to your admin dashboard.'
        }
      >
        <AuthAlert message={error} />

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isRegistering && (
            <Input
              label="Full name"
              name="name"
              value={form.name}
              onChange={update('name')}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          )}

          <Input
            label="Email"
            type="email"
            name="email"
            value={form.email}
            onChange={update('email')}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={update('password')}
              placeholder="••••••••"
              required
              autoComplete={isRegistering ? 'new-password' : 'current-password'}
              minLength={isRegistering ? 6 : undefined}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-muted hover:text-slate-600 transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  {isRegistering ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {isRegistering ? <UserPlus size={16} /> : <LogIn size={16} />}
                  {isRegistering ? 'Create account' : 'Sign in'}
                </span>
              )}
            </Button>
          </div>
        </form>

        {!needsSetup && (
          <p className="mt-6 text-center text-sm text-muted">
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(false); setError(''); }}
                  className="font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Sign in
                </button>
              </>
            ) : (
              <>
                No account yet?{' '}
                <button
                  type="button"
                  onClick={() => { setIsRegistering(true); setError(''); }}
                  className="font-medium text-primary hover:text-primary-hover transition-colors"
                >
                  Register
                </button>
              </>
            )}
          </p>
        )}
      </AuthCard>

      <p className="mt-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Future CRM. All rights reserved.
      </p>
    </div>
  );
}
