import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useDevAuth } from "../hooks/useDevAuth";

interface DevLoginRouteProps {
  children: ReactNode;
}

export default function DevLoginRoute({ children }: DevLoginRouteProps) {
  const { isDevMode, isAuthenticated } = useDevAuth();

  // Si on n'est pas en mode dev, rediriger vers 404
  if (!isDevMode) {
    return <Navigate to="/404" replace />;
  }

  // Si on est en mode dev et déjà authentifié, rediriger vers le panel admin
  if (isDevMode && isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  // Si on est en mode dev mais pas authentifié, afficher la page de login
  return <>{children}</>;
}
