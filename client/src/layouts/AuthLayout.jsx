import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div className="mb-8 text-center">
        <p className="text-sm font-medium text-slate-500">Future CRM</p>
        <p className="mt-1 text-xs text-muted">Admin workspace</p>
      </div>
      <Outlet />
      <p className="mt-10 text-center text-xs text-muted">
        © {new Date().getFullYear()} Future CRM. All rights reserved.
      </p>
    </div>
  );
}
