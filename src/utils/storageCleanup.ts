/**
 * Utilitaire de nettoyage d'urgence pour le localStorage
 */

import secureStorage from './secureStorage';

/**
 * Nettoie toutes les données corrompues du localStorage
 */
export function cleanupCorruptedData(): {
  cleaned: number;
  preserved: number;
  errors: string[];
} {
  const result = {
    cleaned: 0,
    preserved: 0,
    errors: [] as string[]
  };

  try {
    console.log('🧹 Nettoyage des données corrompues...');
    
    // Collecter toutes les clés
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        allKeys.push(key);
      }
    }

    allKeys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        if (!value) return;

        // Si c'est une clé chiffrée, tenter de la valider
        if (key.startsWith('__encrypted__')) {
          const originalKey = key.substring('__encrypted__'.length);
          
          // Essayer de récupérer les données
          const retrieved = secureStorage.getItem(originalKey);
          if (retrieved === null) {
            // Données corrompues, supprimer
            localStorage.removeItem(key);
            result.cleaned++;
            console.log(`❌ Supprimé: ${key} (données corrompues)`);
          } else {
            result.preserved++;
            console.log(`✅ Préservé: ${key}`);
          }
        } else {
          // Données non chiffrées, laisser en place pour migration
          result.preserved++;
        }
      } catch (error) {
        result.errors.push(`Erreur lors du traitement de ${key}: ${error}`);
        console.error(`Erreur lors du traitement de ${key}:`, error);
      }
    });

    console.log(`🧹 Nettoyage terminé: ${result.cleaned} supprimés, ${result.preserved} préservés`);
    return result;
    
  } catch (error) {
    result.errors.push(`Erreur globale: ${error}`);
    console.error('Erreur lors du nettoyage:', error);
    return result;
  }
}

/**
 * Remet à zéro complètement le localStorage (ATTENTION: destructif)
 */
export function resetAllStorage(): boolean {
  try {
    console.log('🚨 ATTENTION: Remise à zéro complète du localStorage');
    
    // Sauvegarder les données importantes (optionnel)
    const backup = {
      timestamp: new Date().toISOString(),
      data: {} as { [key: string]: string }
    };
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          backup.data[key] = value;
        }
      }
    }
    
    console.log('📦 Sauvegarde créée:', backup);
    
    // Vider complètement le localStorage
    localStorage.clear();
    
    console.log('✅ localStorage vidé');
    return true;
    
  } catch (error) {
    console.error('❌ Erreur lors de la remise à zéro:', error);
    return false;
  }
}

/**
 * Diagnostique les problèmes du localStorage
 */
export function diagnoseStorage(): {
  totalItems: number;
  encryptedItems: number;
  unencryptedItems: number;
  corruptedItems: number;
  issues: string[];
} {
  const result = {
    totalItems: 0,
    encryptedItems: 0,
    unencryptedItems: 0,
    corruptedItems: 0,
    issues: [] as string[]
  };

  try {
    console.log('🔍 Diagnostic du localStorage...');
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key) continue;
      
      result.totalItems++;
      
      try {
        const value = localStorage.getItem(key);
        if (!value) continue;
        
        if (key.startsWith('__encrypted__')) {
          result.encryptedItems++;
          
          // Tester le déchiffrement
          const originalKey = key.substring('__encrypted__'.length);
          const retrieved = secureStorage.getItem(originalKey);
          if (retrieved === null) {
            result.corruptedItems++;
            result.issues.push(`Données chiffrées corrompues: ${originalKey}`);
          }
        } else {
          result.unencryptedItems++;
          result.issues.push(`Données non chiffrées: ${key}`);
        }
      } catch (error) {
        result.corruptedItems++;
        result.issues.push(`Erreur lors du traitement de ${key}: ${error}`);
      }
    }
    
    console.log('📊 Résultats du diagnostic:', {
      total: result.totalItems,
      chiffrés: result.encryptedItems,
      nonChiffrés: result.unencryptedItems,
      corrompus: result.corruptedItems,
      problèmes: result.issues.length
    });
    
    return result;
    
  } catch (error) {
    result.issues.push(`Erreur globale: ${error}`);
    console.error('Erreur lors du diagnostic:', error);
    return result;
  }
}
