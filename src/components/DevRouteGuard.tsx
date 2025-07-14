import { type ReactNode } from 'react';
import { useDevAuth } from '../hooks/useDevAuth';
import DevLoginPage from '../pages/DevLoginPage';

interface DevRouteGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function DevRouteGuard({ children, fallback }: DevRouteGuardProps) {
  const { isDevMode, isAuthenticated } = useDevAuth();

  // Si on n'est pas en mode dev, on affiche le contenu normal
  if (!isDevMode) {
    return <>{children}</>;
  }

  // Si on est en mode dev mais pas authentifié, on affiche la page de login
  if (isDevMode && !isAuthenticated) {
    return fallback || <DevLoginPage />;
  }

  // Si on est en mode dev et authentifié, on affiche le contenu
  return <>{children}</>;
}
