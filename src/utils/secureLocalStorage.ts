/**
 * Wrapper pour localStorage avec migration automatique vers secureStorage
 * 
 * @file secureLocalStorage.ts
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 */

import secureStorage from './secureStorage';

/**
 * Wrapper qui remplace l'API localStorage standard par secureStorage
 * avec migration automatique des données existantes
 */
export class SecureLocalStorage {
  /**
   * Stocke un élément de manière sécurisée
   * 
   * @param key - Clé de stockage
   * @param value - Valeur à stocker
   * @returns true si le stockage a réussi, false sinon
   */
  static setItem(key: string, value: string): boolean {
    try {
      return secureStorage.setItem(key, value);
    } catch (error) {
      console.error('Erreur lors du stockage sécurisé:', error);
      return false;
    }
  }

  /**
   * Récupère un élément du stockage sécurisé
   * Effectue une migration automatique si l'élément existe dans localStorage
   * 
   * @param key - Clé de stockage
   * @returns Valeur stockée ou null si non trouvée
   */
  static getItem(key: string): string | null {
    try {
      // Vérifier d'abord dans le stockage sécurisé
      const secureValue = secureStorage.getItem(key);
      if (secureValue !== null) {
        return secureValue;
      }

      // Migration automatique depuis localStorage
      const localValue = localStorage.getItem(key);
      if (localValue !== null) {
        console.log(`Migration automatique de la clé: ${key}`);
        
        // Stocker de manière sécurisée
        const success = secureStorage.setItem(key, localValue);
        if (success) {
          // Supprimer l'ancienne version
          localStorage.removeItem(key);
          return localValue;
        }
      }

      return null;
    } catch (error) {
      console.error('Erreur lors de la récupération sécurisée:', error);
      return null;
    }
  }

  /**
   * Supprime un élément du stockage sécurisé
   * 
   * @param key - Clé de stockage
   * @returns true si la suppression a réussi, false sinon
   */
  static removeItem(key: string): boolean {
    try {
      // Supprimer des deux emplacements pour être sûr
      const secureSuccess = secureStorage.removeItem(key);
      localStorage.removeItem(key);
      return secureSuccess;
    } catch (error) {
      console.error('Erreur lors de la suppression sécurisée:', error);
      return false;
    }
  }

  /**
   * Vérifie si un élément existe dans le stockage sécurisé
   * 
   * @param key - Clé de stockage
   * @returns true si l'élément existe, false sinon
   */
  static hasItem(key: string): boolean {
    try {
      return secureStorage.hasItem(key) || localStorage.getItem(key) !== null;
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      return false;
    }
  }

  /**
   * Efface tous les éléments du stockage sécurisé
   * 
   * @returns true si l'effacement a réussi, false sinon
   */
  static clear(): boolean {
    try {
      return secureStorage.clear();
    } catch (error) {
      console.error('Erreur lors de l\'effacement:', error);
      return false;
    }
  }

  /**
   * Récupère toutes les clés du stockage sécurisé
   * 
   * @returns Array des clés
   */
  static getAllKeys(): string[] {
    try {
      return secureStorage.getAllKeys();
    } catch (error) {
      console.error('Erreur lors de la récupération des clés:', error);
      return [];
    }
  }

  /**
   * Migre toutes les données du localStorage vers le stockage sécurisé
   * 
   * @param keysToMigrate - Array des clés à migrer (optionnel, sinon toutes les clés)
   * @returns Nombre d'éléments migrés
   */
  static migrateAll(keysToMigrate?: string[]): number {
    let migrated = 0;
    
    try {
      const keys = keysToMigrate || Object.keys(localStorage);
      
      for (const key of keys) {
        const value = localStorage.getItem(key);
        if (value !== null && !secureStorage.hasItem(key)) {
          const success = secureStorage.setItem(key, value);
          if (success) {
            localStorage.removeItem(key);
            migrated++;
            console.log(`Migré: ${key}`);
          }
        }
      }
      
      console.log(`Migration terminée: ${migrated} éléments migrés`);
    } catch (error) {
      console.error('Erreur lors de la migration:', error);
    }
    
    return migrated;
  }

  /**
   * Récupère les statistiques du stockage sécurisé
   * 
   * @returns Objet contenant les statistiques
   */
  static getStats() {
    try {
      return secureStorage.getStats();
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      return {
        totalItems: 0,
        totalSize: 0,
        expiredItems: 0,
        oldestItem: null,
      };
    }
  }

  /**
   * Nettoie les données expirées
   * 
   * @returns Nombre d'éléments nettoyés
   */
  static cleanup(): number {
    try {
      return secureStorage.cleanup();
    } catch (error) {
      console.error('Erreur lors du nettoyage:', error);
      return 0;
    }
  }
}

/**
 * Fonction utilitaire pour remplacer localStorage par secureStorage
 * 
 * @example
 * ```typescript
 * // Remplacer
 * localStorage.setItem('key', 'value');
 * const value = localStorage.getItem('key');
 * 
 * // Par
 * secureLocalStorage.setItem('key', 'value');
 * const value = secureLocalStorage.getItem('key');
 * ```
 */
export const secureLocalStorage = {
  setItem: SecureLocalStorage.setItem,
  getItem: SecureLocalStorage.getItem,
  removeItem: SecureLocalStorage.removeItem,
  hasItem: SecureLocalStorage.hasItem,
  clear: SecureLocalStorage.clear,
  getAllKeys: SecureLocalStorage.getAllKeys,
  migrateAll: SecureLocalStorage.migrateAll,
  getStats: SecureLocalStorage.getStats,
  cleanup: SecureLocalStorage.cleanup,
};

export default secureLocalStorage;
