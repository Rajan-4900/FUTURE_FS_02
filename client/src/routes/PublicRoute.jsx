import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function PublicRoute() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Spinner />
      </div>
    );
  }

  if (isAuthenticated && isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (isAuthenticated && !isAdmin) {
    return <Navigate to="/login" state={{ message: 'Administrator access only' }} replace />;
  }

  return <Outlet />;
}
