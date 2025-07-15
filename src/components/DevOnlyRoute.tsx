import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDevAuth } from "../hooks/useDevAuth";

interface DevOnlyRouteProps {
  children: ReactNode;
}

export default function DevOnlyRoute({ children }: DevOnlyRouteProps) {
  const { isDevMode, isAuthenticated } = useDevAuth();

  // Si on n'est pas en mode dev, rediriger vers 404
  if (!isDevMode) {
    return <Navigate to="/404" replace />;
  }

  // Si on est en mode dev et authentifié, afficher le contenu
  if (isDevMode && isAuthenticated) {
    return <>{children}</>;
  }

  // Si on est en mode dev mais pas authentifié, rediriger vers login
  return <Navigate to="/dev/login" replace />;
}

// Composant pour les liens de navigation conditionnels
interface DevNavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

export function DevNavLink({ to, children, className = "" }: DevNavLinkProps) {
  const { isDevMode } = useDevAuth();

  if (!isDevMode) {
    return null;
  }

  return (
    <a href={to} className={className}>
      {children}
    </a>
  );
}
