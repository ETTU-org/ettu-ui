/**
 * Utilitaire de migration pour transformer une application utilisant localStorage
 * vers secureStorage de manière progressive
 * 
 * @file migrationUtils.ts
 * @author BOSSIS--GUYON Jules
 * @date 2025-07-14
 */

import { secureLocalStorage } from './secureLocalStorage';

/**
 * Configuration de migration
 */
interface MigrationConfig {
  /** Clés à migrer du localStorage */
  keysToMigrate: string[];
  /** Préfixe à retirer des clés lors de la migration */
  removePrefix?: string;
  /** Préfixe à ajouter aux clés lors de la migration */
  addPrefix?: string;
  /** Fonction de transformation des valeurs */
  transformValue?: (key: string, value: string) => string;
  /** Fonction de validation des valeurs */
  validateValue?: (key: string, value: string) => boolean;
}

/**
 * Résultat de la migration
 */
interface MigrationResult {
  /** Nombre d'éléments migrés avec succès */
  migrated: number;
  /** Nombre d'éléments ignorés */
  skipped: number;
  /** Nombre d'erreurs rencontrées */
  errors: number;
  /** Détails des erreurs */
  errorDetails: Array<{ key: string; error: string }>;
  /** Détails des éléments migrés */
  migratedItems: Array<{ oldKey: string; newKey: string }>;
}

/**
 * Utilitaire de migration progressive
 */
export class MigrationUtils {
  /**
   * Migre des données du localStorage vers secureStorage
   * 
   * @param config - Configuration de migration
   * @returns Résultat de la migration
   */
  static migrateToSecure(config: MigrationConfig): MigrationResult {
    const result: MigrationResult = {
      migrated: 0,
      skipped: 0,
      errors: 0,
      errorDetails: [],
      migratedItems: [],
    };

    for (const originalKey of config.keysToMigrate) {
      try {
        const value = localStorage.getItem(originalKey);
        
        if (value === null) {
          result.skipped++;
          continue;
        }

        // Validation optionnelle
        if (config.validateValue && !config.validateValue(originalKey, value)) {
          result.skipped++;
          continue;
        }

        // Transformation de la clé
        let newKey = originalKey;
        if (config.removePrefix) {
          newKey = newKey.replace(new RegExp(`^${config.removePrefix}`), '');
        }
        if (config.addPrefix) {
          newKey = config.addPrefix + newKey;
        }

        // Transformation de la valeur
        const transformedValue = config.transformValue 
          ? config.transformValue(originalKey, value)
          : value;

        // Vérifier si la nouvelle clé existe déjà
        if (secureLocalStorage.hasItem(newKey)) {
          result.skipped++;
          continue;
        }

        // Migrer vers le stockage sécurisé
        const success = secureLocalStorage.setItem(newKey, transformedValue);
        
        if (success) {
          localStorage.removeItem(originalKey);
          result.migrated++;
          result.migratedItems.push({ oldKey: originalKey, newKey });
        } else {
          result.errors++;
          result.errorDetails.push({
            key: originalKey,
            error: 'Échec du stockage sécurisé'
          });
        }
      } catch (error) {
        result.errors++;
        result.errorDetails.push({
          key: originalKey,
          error: error instanceof Error ? error.message : 'Erreur inconnue'
        });
      }
    }

    return result;
  }

  /**
   * Détecte automatiquement les clés à migrer basées sur des patterns
   * 
   * @param patterns - Patterns regex pour détecter les clés
   * @returns Array des clés trouvées
   */
  static detectKeys(patterns: string[]): string[] {
    const keys: string[] = [];
    const regexes = patterns.map(pattern => new RegExp(pattern));

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && regexes.some(regex => regex.test(key))) {
        keys.push(key);
      }
    }

    return keys;
  }

  /**
   * Migre toutes les données ETTU vers le stockage sécurisé
   * 
   * @returns Résultat de la migration
   */
  static migrateETTUData(): MigrationResult {
    const keysToMigrate = this.detectKeys([
      '^noteEditor-',
      '^snippet-',
      '^user-preferences',
      '^ettu-',
      '^settings-',
      '^editor-'
    ]);

    return this.migrateToSecure({
      keysToMigrate,
      validateValue: (key, value) => {
        // Validation basique
        if (value.length > 5 * 1024 * 1024) { // 5MB max
          console.warn(`Valeur trop grande ignorée: ${key}`);
          return false;
        }
        return true;
      },
      transformValue: (key, value) => {
        // Transformation basique pour certaines clés
        if (key.includes('Date') || key.includes('time')) {
          try {
            // Vérifier si c'est une date valide
            const date = new Date(value);
            if (isNaN(date.getTime())) {
              return value;
            }
            return date.toISOString();
          } catch {
            return value;
          }
        }
        return value;
      }
    });
  }

  /**
   * Génère un rapport de migration
   * 
   * @param result - Résultat de la migration
   * @returns Rapport formaté
   */
  static generateReport(result: MigrationResult): string {
    const report = [
      '=== RAPPORT DE MIGRATION ETTU ===',
      `Date: ${new Date().toISOString()}`,
      '',
      `✅ Éléments migrés: ${result.migrated}`,
      `⏭️  Éléments ignorés: ${result.skipped}`,
      `❌ Erreurs: ${result.errors}`,
      '',
    ];

    if (result.migratedItems.length > 0) {
      report.push('📦 Éléments migrés:');
      result.migratedItems.forEach(item => {
        report.push(`  ${item.oldKey} → ${item.newKey}`);
      });
      report.push('');
    }

    if (result.errorDetails.length > 0) {
      report.push('⚠️  Erreurs rencontrées:');
      result.errorDetails.forEach(error => {
        report.push(`  ${error.key}: ${error.error}`);
      });
      report.push('');
    }

    const stats = secureLocalStorage.getStats();
    report.push('📊 Statistiques du stockage sécurisé:');
    report.push(`  Éléments totaux: ${stats.totalItems}`);
    report.push(`  Taille totale: ${(stats.totalSize / 1024).toFixed(2)} KB`);
    report.push(`  Éléments expirés: ${stats.expiredItems}`);
    
    return report.join('\n');
  }

  /**
   * Effectue une migration complète avec rapport
   * 
   * @param verbose - Afficher les détails dans la console
   * @returns Résultat de la migration
   */
  static performFullMigration(verbose: boolean = true): MigrationResult {
    if (verbose) {
      console.log('🔄 Début de la migration ETTU...');
    }

    const result = this.migrateETTUData();
    
    if (verbose) {
      console.log(this.generateReport(result));
    }

    // Nettoyage des données expirées
    const cleaned = secureLocalStorage.cleanup();
    if (verbose && cleaned > 0) {
      console.log(`🧹 Nettoyage terminé: ${cleaned} éléments expirés supprimés`);
    }

    return result;
  }

  /**
   * Sauvegarde les données avant migration
   * 
   * @param filename - Nom du fichier de sauvegarde
   */
  static backupLocalStorage(filename?: string): void {
    const backup: Record<string, string> = {};
    
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        backup[key] = localStorage.getItem(key) || '';
      }
    }

    const data = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      data: backup
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json'
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || `ettu-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
}

/**
 * Fonction utilitaire pour une migration rapide
 */
export function quickMigration(): void {
  console.log('🚀 Migration rapide ETTU...');
  
  // Sauvegarde optionnelle
  if (confirm('Voulez-vous créer une sauvegarde avant la migration ?')) {
    MigrationUtils.backupLocalStorage();
  }
  
  // Migration
  const result = MigrationUtils.performFullMigration(true);
  
  // Notification
  if (result.migrated > 0) {
    alert(`Migration terminée avec succès !\n${result.migrated} éléments migrés.`);
  } else {
    alert('Aucun élément à migrer trouvé.');
  }
}

export default MigrationUtils;
