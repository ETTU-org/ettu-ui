/**
 * Hook personnalisé pour le stockage sécurisé
 * Fournit une interface simple pour utiliser secureStorage avec React
 * 
 * @file useSecureStorage.ts
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 */

import { useState, useEffect, useCallback } from 'react';
import secureStorage from '../utils/secureStorage';
import type { StorageOptions } from '../utils/secureStorage';

/**
 * Hook pour gérer le stockage sécurisé avec React
 * 
 * @param key - Clé de stockage
 * @param initialValue - Valeur initiale par défaut
 * @param options - Options de stockage sécurisé
 * @returns [value, setValue, removeValue, isLoading, error]
 */
export function useSecureStorage<T = string>(
  key: string,
  initialValue?: T,
  options?: StorageOptions
): [T | null, (value: T | null) => void, () => void, boolean, string | null] {
  const [storedValue, setStoredValue] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour récupérer la valeur
  const getValue = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);
      
      const item = secureStorage.getItem(key, options);
      if (item !== null) {
        // Essayer de parser JSON si la valeur initiale est un objet
        if (typeof initialValue === 'object' && initialValue !== null) {
          try {
            return JSON.parse(item);
          } catch {
            return item;
          }
        }
        return item as T;
      }
      return initialValue || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de lecture');
      return initialValue || null;
    } finally {
      setIsLoading(false);
    }
  }, [key, initialValue, options]);

  // Fonction pour définir la valeur
  const setValue = useCallback((value: T | null) => {
    try {
      setError(null);
      
      if (value === null) {
        secureStorage.removeItem(key);
        setStoredValue(null);
      } else {
        const stringValue = typeof value === 'object' 
          ? JSON.stringify(value) 
          : String(value);
        
        const success = secureStorage.setItem(key, stringValue, options);
        if (success) {
          setStoredValue(value);
        } else {
          throw new Error('Échec du stockage');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de stockage');
    }
  }, [key, options]);

  // Fonction pour supprimer la valeur
  const removeValue = useCallback(() => {
    try {
      setError(null);
      const success = secureStorage.removeItem(key);
      if (success) {
        setStoredValue(null);
      } else {
        throw new Error('Échec de la suppression');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de suppression');
    }
  }, [key]);

  // Charger la valeur initiale
  useEffect(() => {
    const value = getValue();
    setStoredValue(value);
  }, [getValue]);

  return [storedValue, setValue, removeValue, isLoading, error];
}

/**
 * Hook pour migrer des données du localStorage vers secureStorage
 * 
 * @param migrations - Tableau des migrations à effectuer
 */
export function useStorageMigration(migrations: Array<{
  oldKey: string;
  newKey: string;
  transform?: (value: string) => string;
}>) {
  const [migrationStatus, setMigrationStatus] = useState<{
    completed: boolean;
    errors: string[];
  }>({ completed: false, errors: [] });

  useEffect(() => {
    const performMigration = async () => {
      const errors: string[] = [];
      
      for (const migration of migrations) {
        try {
          const oldValue = localStorage.getItem(migration.oldKey);
          
          if (oldValue && !secureStorage.hasItem(migration.newKey)) {
            const transformedValue = migration.transform 
              ? migration.transform(oldValue)
              : oldValue;
            
            const success = secureStorage.setItem(migration.newKey, transformedValue);
            
            if (success) {
              localStorage.removeItem(migration.oldKey);
              console.log(`Migration réussie: ${migration.oldKey} → ${migration.newKey}`);
            } else {
              errors.push(`Échec de la migration: ${migration.oldKey}`);
            }
          }
        } catch (err) {
          errors.push(`Erreur lors de la migration ${migration.oldKey}: ${err}`);
        }
      }
      
      setMigrationStatus({ completed: true, errors });
    };

    performMigration();
  }, [migrations]);

  return migrationStatus;
}

/**
 * Hook pour nettoyer automatiquement les données expirées
 * 
 * @param intervalMinutes - Intervalle en minutes pour le nettoyage
 */
export function useStorageCleanup(intervalMinutes: number = 60) {
  const [cleanupStats, setCleanupStats] = useState<{
    lastCleanup: Date | null;
    itemsRemoved: number;
  }>({ lastCleanup: null, itemsRemoved: 0 });

  useEffect(() => {
    const cleanup = () => {
      const removed = secureStorage.cleanup();
      setCleanupStats({
        lastCleanup: new Date(),
        itemsRemoved: removed
      });
      
      if (removed > 0) {
        console.log(`Nettoyage terminé: ${removed} éléments expirés supprimés`);
      }
    };

    // Nettoyage initial
    cleanup();

    // Nettoyage périodique
    const interval = setInterval(cleanup, intervalMinutes * 60 * 1000);

    return () => clearInterval(interval);
  }, [intervalMinutes]);

  return cleanupStats;
}

export default useSecureStorage;
