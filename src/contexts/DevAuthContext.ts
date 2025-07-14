import { createContext } from 'react';

interface DevAuthContextType {
  isDevMode: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  devPort: number;
}

export const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined);
export type { DevAuthContextType };
