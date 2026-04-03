import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/features/auth/AuthContext';

interface PrivateRouteProps {
  redirectTo?: string;
}

export function PrivateRoute({ redirectTo = '/login' }: PrivateRouteProps) {
  const { isAuthenticated, isAuthInProgress } = useAuth();

  if (isAuthInProgress) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
}
