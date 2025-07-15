/**
 * Debug pour identifier le problème de chiffrement/déchiffrement
 */

import CryptoJS from 'crypto-js';

// Configuration de test
const ENCRYPTION_CONFIG = {
  keySize: 256,
  iterations: 1000,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7,
  ivSize: 128
};

const DEFAULT_SECRET_KEY = 'ettu-default-secret-key-2024';

/**
 * Génère une clé de chiffrement
 */
function generateKey(secret: string): string {
  return CryptoJS.PBKDF2(secret, 'ettu-salt', {
    keySize: ENCRYPTION_CONFIG.keySize / 32,
    iterations: ENCRYPTION_CONFIG.iterations
  }).toString();
}

/**
 * Test de chiffrement/déchiffrement basique
 */
function testBasicEncryption() {
  console.log('🔐 Test de chiffrement basique...');
  
  const testData = 'Hello, World!';
  const key = generateKey(DEFAULT_SECRET_KEY);
  
  try {
    // Chiffrement
    const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize / 8);
    const encrypted = CryptoJS.AES.encrypt(testData, key, {
      iv: iv,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding
    });
    
    const encryptedString = iv.toString() + ':' + encrypted.toString();
    console.log('✅ Chiffrement réussi:', encryptedString.substring(0, 50) + '...');
    
    // Déchiffrement
    const parts = encryptedString.split(':');
    const ivPart = CryptoJS.enc.Hex.parse(parts[0]);
    const encryptedPart = parts[1];
    
    const decrypted = CryptoJS.AES.decrypt(encryptedPart, key, {
      iv: ivPart,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding
    });
    
    const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('✅ Déchiffrement réussi:', decryptedString);
    console.log('✅ Correspondance:', decryptedString === testData);
    
    return {
      success: true,
      original: testData,
      encrypted: encryptedString,
      decrypted: decryptedString,
      match: decryptedString === testData
    };
    
  } catch (error) {
    console.error('❌ Erreur de chiffrement:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    };
  }
}

/**
 * Test de migration de données
 */
function testDataMigration() {
  console.log('🔄 Test de migration de données...');
  
  const testCases = [
    { key: 'test-string', value: 'Simple string' },
    { key: 'test-object', value: { name: 'John', age: 30 } },
    { key: 'test-array', value: [1, 2, 3, 'test'] },
    { key: 'test-boolean', value: true },
    { key: 'test-number', value: 42 }
  ];
  
  const results = [];
  
  for (const testCase of testCases) {
    try {
      // Simuler des données non chiffrées
      const originalValue = typeof testCase.value === 'string' 
        ? testCase.value 
        : JSON.stringify(testCase.value);
      
      localStorage.setItem(testCase.key, originalValue);
      
      // Tenter de migrer
      const key = generateKey(DEFAULT_SECRET_KEY);
      const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize / 8);
      const encrypted = CryptoJS.AES.encrypt(originalValue, key, {
        iv: iv,
        mode: ENCRYPTION_CONFIG.mode,
        padding: ENCRYPTION_CONFIG.padding
      });
      
      const encryptedString = iv.toString() + ':' + encrypted.toString();
      
      // Vérifier le déchiffrement
      const parts = encryptedString.split(':');
      const ivPart = CryptoJS.enc.Hex.parse(parts[0]);
      const encryptedPart = parts[1];
      
      const decrypted = CryptoJS.AES.decrypt(encryptedPart, key, {
        iv: ivPart,
        mode: ENCRYPTION_CONFIG.mode,
        padding: ENCRYPTION_CONFIG.padding
      });
      
      const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);
      
      results.push({
        key: testCase.key,
        type: typeof testCase.value,
        success: decryptedString === originalValue,
        originalLength: originalValue.length,
        encryptedLength: encryptedString.length
      });
      
      // Nettoyer
      localStorage.removeItem(testCase.key);
      
    } catch (error) {
      results.push({
        key: testCase.key,
        type: typeof testCase.value,
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue'
      });
    }
  }
  
  console.log('📊 Résultats de migration:', results);
  return results;
}

/**
 * Test de performance
 */
function testPerformance() {
  console.log('⚡ Test de performance...');
  
  const testData = 'A'.repeat(1000); // 1KB de données
  const iterations = 100;
  
  const key = generateKey(DEFAULT_SECRET_KEY);
  
  // Test de chiffrement
  const encryptStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize / 8);
    CryptoJS.AES.encrypt(testData, key, {
      iv: iv,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding
    });
  }
  const encryptEnd = performance.now();
  
  // Test de déchiffrement
  const iv = CryptoJS.lib.WordArray.random(ENCRYPTION_CONFIG.ivSize / 8);
  const encrypted = CryptoJS.AES.encrypt(testData, key, {
    iv: iv,
    mode: ENCRYPTION_CONFIG.mode,
    padding: ENCRYPTION_CONFIG.padding
  });
  const encryptedString = iv.toString() + ':' + encrypted.toString();
  
  const decryptStart = performance.now();
  for (let i = 0; i < iterations; i++) {
    const parts = encryptedString.split(':');
    const ivPart = CryptoJS.enc.Hex.parse(parts[0]);
    const encryptedPart = parts[1];
    
    CryptoJS.AES.decrypt(encryptedPart, key, {
      iv: ivPart,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding
    });
  }
  const decryptEnd = performance.now();
  
  const results = {
    dataSize: testData.length,
    iterations,
    encryptTime: encryptEnd - encryptStart,
    decryptTime: decryptEnd - decryptStart,
    avgEncryptTime: (encryptEnd - encryptStart) / iterations,
    avgDecryptTime: (decryptEnd - decryptStart) / iterations
  };
  
  console.log('📊 Résultats de performance:', results);
  return results;
}

/**
 * Diagnostic du localStorage
 */
function diagnoseLocalStorage() {
  console.log('🔍 Diagnostic du localStorage...');
  
  const diagnosis = {
    totalItems: 0,
    encryptedItems: 0,
    unencryptedItems: 0,
    corruptedItems: 0,
    totalSize: 0,
    items: [] as Array<{
      key: string;
      type: 'encrypted' | 'unencrypted' | 'corrupted';
      size: number;
      preview: string;
    }>
  };
  
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;
    
    const value = localStorage.getItem(key);
    if (!value) continue;
    
    diagnosis.totalItems++;
    diagnosis.totalSize += value.length;
    
    let type: 'encrypted' | 'unencrypted' | 'corrupted' = 'unencrypted';
    const preview = value.substring(0, 50) + (value.length > 50 ? '...' : '');
    
    // Vérifier si c'est chiffré (format: iv:encrypted)
    if (key.startsWith('__encrypted__') || value.includes(':')) {
      try {
        const parts = value.split(':');
        if (parts.length >= 2) {
          type = 'encrypted';
          diagnosis.encryptedItems++;
        }
      } catch {
        type = 'corrupted';
        diagnosis.corruptedItems++;
      }
    } else {
      diagnosis.unencryptedItems++;
    }
    
    diagnosis.items.push({
      key,
      type,
      size: value.length,
      preview
    });
  }
  
  console.log('📊 Diagnostic:', diagnosis);
  return diagnosis;
}

/**
 * Fonction principale de debug
 */
export function runFullDebug() {
  console.log('🔧 === DEBUG COMPLET DU SYSTÈME DE CHIFFREMENT ===');
  
  const results = {
    timestamp: new Date().toISOString(),
    basicEncryption: testBasicEncryption(),
    dataMigration: testDataMigration(),
    performance: testPerformance(),
    localStorage: diagnoseLocalStorage()
  };
  
  console.log('📋 Résultats complets:', results);
  return results;
}

/**
 * Export des fonctions individuelles pour les tests
 */
export {
  testBasicEncryption,
  testDataMigration,
  testPerformance,
  diagnoseLocalStorage,
  generateKey
};
