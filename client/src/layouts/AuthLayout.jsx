import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-sidebar p-12 text-white">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold">
            F
          </div>
          <span className="text-lg font-semibold">Future CRM</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight">
            Manage your pipeline with clarity
          </h2>
          <p className="mt-4 text-slate-400 text-base leading-relaxed max-w-md">
            Track contacts, close deals, and keep your team aligned — all in one workspace built
            for growing sales teams.
          </p>
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Future CRM</p>
      </div>

      <div className="flex flex-1 flex-col justify-center px-6 py-12 sm:px-12 lg:px-16 bg-background">
        <div className="lg:hidden mb-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary font-bold text-white">
            F
          </div>
          <span className="text-lg font-semibold text-slate-900">Future CRM</span>
        </div>
        <div className="mx-auto w-full max-w-md">
          <Outlet />
        </div>
        <p className="mt-8 text-center text-sm text-muted lg:hidden">
          <Link to="/login" className="text-primary hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
