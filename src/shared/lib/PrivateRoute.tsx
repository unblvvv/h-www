import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/features/auth/AuthContext';

interface PrivateRouteProps {
  redirectTo?: string;
  allowRoles?: string[];
}

export function PrivateRoute({ redirectTo = '/login', allowRoles }: PrivateRouteProps) {
  const { isAuthenticated, isAuthInProgress, user } = useAuth();

  if (isAuthInProgress) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowRoles && allowRoles.length > 0) {
    const role = user?.role?.toLowerCase();
    if (!role || !allowRoles.map((value) => value.toLowerCase()).includes(role)) {
      return <Navigate to="/" replace />;
    }
  }

  return <Outlet />;
}
