import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import AuthCard from '../components/auth/AuthCard';
import AuthAlert from '../components/auth/AuthAlert';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import {
  validateEmail,
  validatePassword,
  validateName,
  getApiError,
} from '../utils/validateForm';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    setupKey: '',
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateConfirmPassword = (password, confirm) => {
    if (!confirm) return 'Please confirm your password';
    if (password !== confirm) return 'Passwords do not match';
    return '';
  };

  const validate = () => {
    const errors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      password: validatePassword(form.password),
      confirmPassword: validateConfirmPassword(form.password, form.confirmPassword),
    };
    setFieldErrors(errors);
    return !Object.values(errors).some(Boolean);
  };

  const handleBlur = (field) => {
    const validators = {
      name: () => validateName(form.name),
      email: () => validateEmail(form.email),
      password: () => validatePassword(form.password),
      confirmPassword: () => validateConfirmPassword(form.password, form.confirmPassword),
    };
    if (validators[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: validators[field]() }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        company: form.company.trim(),
        setupKey: form.setupKey.trim() || undefined,
      });
      navigate('/', { replace: true });
    } catch (err) {
      setError(getApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard
      title="Register admin"
      subtitle="One-time setup. This CRM is for administrators only."
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <AuthAlert message={error} />

        <Input
          label="Full name"
          name="name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          onBlur={() => handleBlur('name')}
          placeholder="Jane Smith"
          error={fieldErrors.name}
          disabled={loading}
        />

        <Input
          label="Work email"
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
          label="Company"
          name="company"
          value={form.company}
          onChange={(e) => setForm({ ...form, company: e.target.value })}
          placeholder="Acme Inc."
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          name="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => handleBlur('password')}
          placeholder="Min. 6 characters"
          error={fieldErrors.password}
          disabled={loading}
        />

        <Input
          label="Confirm password"
          type="password"
          name="confirmPassword"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          onBlur={() => handleBlur('confirmPassword')}
          placeholder="Re-enter password"
          error={fieldErrors.confirmPassword}
          disabled={loading}
        />

        <Input
          label="Setup key (if required)"
          name="setupKey"
          type="password"
          value={form.setupKey}
          onChange={(e) => setForm({ ...form, setupKey: e.target.value })}
          placeholder="Only needed for additional admins"
          disabled={loading}
        />
        <p className="-mt-2 text-xs text-muted">
          The first admin account does not need a setup key.
        </p>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Creating account...
            </>
          ) : (
            'Create admin account'
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already registered?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
