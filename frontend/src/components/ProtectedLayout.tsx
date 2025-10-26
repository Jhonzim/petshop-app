import { Navigate, useLocation } from 'react-router-dom';
import App from '../App';
import { useAuth } from '../contexts/AuthContext';
import { Roles, type Role } from '../types/auth';

interface ProtectedLayoutProps {
  allowedRoles: Role[];
}

export default function ProtectedLayout({ allowedRoles }: ProtectedLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    const loginRoute = allowedRoles.includes(Roles.ADMIN) ? '/admin' : '/';
    return <Navigate to={loginRoute} state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    const fallback = user.role === Roles.ADMIN ? '/admin/dashboard' : '/catalog';
    return <Navigate to={fallback} replace />;
  }

  return <App />;
}
