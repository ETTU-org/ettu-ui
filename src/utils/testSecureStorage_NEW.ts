/**
 * Script de test pour vérifier le fonctionnement du secureStorage
 */

import secureStorage from './secureStorage';
import { cleanupCorruptedData, diagnoseStorage, resetAllStorage } from './storageCleanup';
import { runFullDebug } from './debugEncryption';

export function testSecureStorage() {
  console.log('🔧 Test du système secureStorage...');

  // Test 0: Diagnostic initial
  console.log('\n🔍 Test 0: Diagnostic initial');
  const initialDiag = diagnoseStorage();
  console.log(`État initial: ${initialDiag.totalItems} éléments, ${initialDiag.corruptedItems} corrompus`);

  // Test 1: Stockage et récupération basiques
  console.log('\n📝 Test 1: Stockage et récupération basiques');
  const testKey = 'test-key';
  const testData = 'Hello, World!';
  
  const stored = secureStorage.setItem(testKey, testData);
  console.log(`Stockage réussi: ${stored}`);
  
  const retrieved = secureStorage.getItem(testKey);
  console.log(`Données récupérées: ${retrieved}`);
  console.log(`Correspondance: ${retrieved === testData}`);

  // Test 2: Simulation de données non chiffrées
  console.log('\n🔄 Test 2: Simulation de données non chiffrées');
  const legacyKey = 'legacy-note';
  const legacyData = 'This is a legacy note';
  
  // Stocker directement dans localStorage (simulation de données anciennes)
  localStorage.setItem(legacyKey, legacyData);
  console.log(`Données legacy stockées: ${legacyData}`);
  
  // Essayer de récupérer avec secureStorage (doit déclencher la migration)
  const migratedData = secureStorage.getItem(legacyKey);
  console.log(`Données migrées: ${migratedData}`);
  console.log(`Migration réussie: ${migratedData === legacyData}`);

  // Test 3: Vérification que les données sont maintenant chiffrées
  console.log('\n🔒 Test 3: Vérification du chiffrement');
  const encryptedData = localStorage.getItem('__encrypted__' + legacyKey);
  console.log(`Données chiffrées stockées: ${encryptedData ? 'Oui' : 'Non'}`);
  console.log(`Anciennes données supprimées: ${!localStorage.getItem(legacyKey)}`);

  // Test 4: Migration globale
  console.log('\n🌐 Test 4: Migration globale');
  
  // Ajouter quelques données non chiffrées pour tester
  localStorage.setItem('note-1', 'Note 1 content');
  localStorage.setItem('note-2', 'Note 2 content');
  localStorage.setItem('snippet-1', 'console.log("Hello");');
  
  const migrationResult = secureStorage.migrateAllData();
  console.log(`Migration globale terminée:`);
  console.log(`  - Total: ${migrationResult.total}`);
  console.log(`  - Migrés: ${migrationResult.migrated}`);
  console.log(`  - Erreurs: ${migrationResult.errors.length}`);
  
  if (migrationResult.errors.length > 0) {
    console.log('  - Détails des erreurs:', migrationResult.errors);
  }

  // Test 5: Statistiques
  console.log('\n📊 Test 5: Statistiques');
  const stats = secureStorage.getStats();
  console.log(`Statistiques:`);
  console.log(`  - Éléments: ${stats.totalItems}`);
  console.log(`  - Taille totale: ${stats.totalSize} bytes`);
  console.log(`  - Éléments expirés: ${stats.expiredItems}`);
  console.log(`  - Élément le plus ancien: ${stats.oldestItem ? new Date(stats.oldestItem).toISOString() : 'N/A'}`);

  // Test 6: Nettoyage
  console.log('\n🧹 Test 6: Nettoyage');
  const cleanedItems = secureStorage.cleanup();
  console.log(`Éléments nettoyés: ${cleanedItems}`);

  // Test 7: Diagnostic final
  console.log('\n🔍 Test 7: Diagnostic final');
  const finalDiag = diagnoseStorage();
  console.log(`État final: ${finalDiag.totalItems} éléments, ${finalDiag.corruptedItems} corrompus`);

  console.log('\n✅ Tests terminés!');
}

// Fonction pour nettoyer les données de test
export function cleanupTestData() {
  console.log('🧹 Nettoyage des données de test...');
  
  const testKeys = [
    'test-key',
    'legacy-note',
    'note-1',
    'note-2',
    'snippet-1'
  ];
  
  testKeys.forEach(key => {
    secureStorage.removeItem(key);
    localStorage.removeItem(key); // Au cas où
  });
  
  console.log('✅ Nettoyage terminé!');
}

// Fonction pour nettoyer les données corrompues
export function cleanupCorrupted() {
  console.log('🧹 Nettoyage des données corrompues...');
  const result = cleanupCorruptedData();
  console.log(`Résultat: ${result.cleaned} supprimés, ${result.preserved} préservés`);
  if (result.errors.length > 0) {
    console.log('Erreurs:', result.errors);
  }
  return result;
}

// Fonction de diagnostic
export function runDiagnostic() {
  console.log('🔍 Diagnostic du stockage...');
  const result = diagnoseStorage();
  console.log('Résultat:', result);
  return result;
}

// Fonction de debug complet
export function runDebugTests() {
  console.log('🔧 Debug complet du système de chiffrement...');
  const result = runFullDebug();
  console.log('Debug terminé:', result);
  return result;
}

// Fonction de remise à zéro (ATTENTION: destructive)
export function resetStorage() {
  console.log('🚨 ATTENTION: Remise à zéro du stockage!');
  const result = resetAllStorage();
  console.log(`Remise à zéro: ${result ? 'Réussie' : 'Échouée'}`);
  return result;
}
