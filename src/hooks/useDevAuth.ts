import { useContext } from 'react';
import { DevAuthContext } from '../contexts/DevAuthContext.ts';

export const useDevAuth = () => {
  const context = useContext(DevAuthContext);
  if (!context) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
};
