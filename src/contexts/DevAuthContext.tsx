import { useState, useEffect, type ReactNode } from "react";
import { DevAuthContext } from "./DevAuthContext";

interface DevAuthProviderProps {
  children: ReactNode;
}

export const DevAuthProvider: React.FC<DevAuthProviderProps> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [devPort] = useState(5199);

  // Déterminer si on est en mode dev basé sur le port
  const isDevMode = window.location.port === devPort.toString();

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté (dev mode uniquement)
    if (isDevMode) {
      const authStatus = localStorage.getItem("dev-auth-status");
      if (authStatus === "authenticated") {
        setIsAuthenticated(true);
      }
    } else {
      // En mode production, pas d'auth nécessaire
      setIsAuthenticated(true);
    }
  }, [isDevMode]);

  const login = (username: string, password: string): boolean => {
    // Credentials de développement simples
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      localStorage.setItem("dev-auth-status", "authenticated");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("dev-auth-status");
  };

  return (
    <DevAuthContext.Provider
      value={{
        isDevMode,
        isAuthenticated,
        login,
        logout,
        devPort,
      }}
    >
      {children}
    </DevAuthContext.Provider>
  );
};
