/**
 * Initialiseur du système de stockage sécurisé
 * Se lance au démarrage de l'application pour s'assurer que tout est correctement configuré
 */

import secureStorage from './secureStorage';

/**
 * Initialise le système de stockage sécurisé
 * - Vérifie la configuration
 * - Migre les données existantes si nécessaire
 * - Nettoie les données expirées
 */
export function initializeSecureStorage(): Promise<{
  initialized: boolean;
  migrationResult?: { migrated: number; errors: string[]; total: number };
  cleanupResult?: number;
  error?: string;
}> {
  return new Promise((resolve) => {
    try {
      console.log('🔧 Initialisation du système de stockage sécurisé...');

      // Étape 1: Vérifier que le système fonctionne
      const testKey = '__init_test__';
      const testValue = 'test_value_' + Date.now();
      
      const stored = secureStorage.setItem(testKey, testValue);
      if (!stored) {
        throw new Error('Échec du test de stockage');
      }
      
      const retrieved = secureStorage.getItem(testKey);
      if (retrieved !== testValue) {
        throw new Error('Échec du test de récupération');
      }
      
      // Nettoyer le test
      secureStorage.removeItem(testKey);

      // Étape 2: Migrer les données existantes
      console.log('🔄 Migration des données existantes...');
      const migrationResult = secureStorage.migrateAllData();
      
      if (migrationResult.migrated > 0) {
        console.log(`✅ Migration terminée: ${migrationResult.migrated} éléments migrés`);
      }
      
      if (migrationResult.errors.length > 0) {
        console.warn('⚠️ Erreurs lors de la migration:', migrationResult.errors);
      }

      // Étape 3: Nettoyer les données expirées
      console.log('🧹 Nettoyage des données expirées...');
      const cleanupResult = secureStorage.cleanup();
      
      if (cleanupResult > 0) {
        console.log(`✅ Nettoyage terminé: ${cleanupResult} éléments supprimés`);
      }

      // Étape 4: Afficher les statistiques
      const stats = secureStorage.getStats();
      console.log('📊 Statistiques du stockage:', {
        éléments: stats.totalItems,
        taille: `${(stats.totalSize / 1024).toFixed(2)} KB`,
        expirés: stats.expiredItems
      });

      console.log('✅ Système de stockage sécurisé initialisé avec succès');
      
      resolve({
        initialized: true,
        migrationResult,
        cleanupResult
      });
      
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation du stockage sécurisé:', error);
      
      resolve({
        initialized: false,
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });
}

/**
 * Fonction de migration d'urgence
 * À utiliser si l'initialisation automatique échoue
 */
export function emergencyMigration(): {
  success: boolean;
  details: string;
} {
  try {
    console.log('🚨 Migration d\'urgence en cours...');
    
    // Sauvegarder toutes les données brutes
    const backup: { [key: string]: string } = {};
    const keysToMigrate: string[] = [];
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('__encrypted__')) {
        const value = localStorage.getItem(key);
        if (value) {
          backup[key] = value;
          keysToMigrate.push(key);
        }
      }
    }
    
    let migrated = 0;
    let errors = 0;
    
    // Migrer chaque élément individuellement
    keysToMigrate.forEach(key => {
      try {
        const value = backup[key];
        if (secureStorage.setItem(key, value)) {
          localStorage.removeItem(key);
          migrated++;
        } else {
          errors++;
        }
      } catch (error) {
        console.error(`Erreur lors de la migration de ${key}:`, error);
        errors++;
      }
    });
    
    const details = `Migration d'urgence terminée: ${migrated} éléments migrés, ${errors} erreurs`;
    console.log(details);
    
    return {
      success: errors === 0,
      details
    };
    
  } catch (error) {
    const details = `Échec de la migration d'urgence: ${error}`;
    console.error(details);
    
    return {
      success: false,
      details
    };
  }
}

/**
 * Vérifie la santé du système de stockage
 */
export function checkStorageHealth(): {
  healthy: boolean;
  issues: string[];
  recommendations: string[];
} {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  try {
    // Test de base
    const testKey = '__health_test__';
    const testValue = 'health_check_' + Date.now();
    
    if (!secureStorage.setItem(testKey, testValue)) {
      issues.push('Impossible de stocker des données');
    }
    
    const retrieved = secureStorage.getItem(testKey);
    if (retrieved !== testValue) {
      issues.push('Impossible de récupérer des données');
    }
    
    secureStorage.removeItem(testKey);
    
    // Vérifier les statistiques
    const stats = secureStorage.getStats();
    
    if (stats.totalSize > 5 * 1024 * 1024) { // 5MB
      issues.push('Stockage trop volumineux');
      recommendations.push('Nettoyer les données anciennes');
    }
    
    if (stats.expiredItems > 0) {
      recommendations.push('Exécuter le nettoyage des données expirées');
    }
    
    // Vérifier les données non migrées
    let unmigratedCount = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && !key.startsWith('__encrypted__')) {
        unmigratedCount++;
      }
    }
    
    if (unmigratedCount > 0) {
      issues.push(`${unmigratedCount} éléments non migrés détectés`);
      recommendations.push('Exécuter la migration des données');
    }
    
    return {
      healthy: issues.length === 0,
      issues,
      recommendations
    };
    
  } catch (error) {
    return {
      healthy: false,
      issues: [`Erreur lors du test de santé: ${error}`],
      recommendations: ['Redémarrer l\'application', 'Vérifier la console pour plus de détails']
    };
  }
}
