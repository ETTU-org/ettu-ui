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
export function debugEncryptionBasic() {
  console.log('🔍 Debug - Test de chiffrement basique');
  
  try {
    const testData = 'Hello World';
    const secret = DEFAULT_SECRET_KEY;
    
    console.log('1. Données originales:', testData);
    console.log('2. Secret:', secret);
    
    // Générer la clé
    const keyString = generateKey(secret);
    const key = CryptoJS.enc.Hex.parse(keyString);
    console.log('3. Clé générée:', keyString.substring(0, 32) + '...');
    
    // Chiffrer
    const iv = CryptoJS.lib.WordArray.random(16);
    console.log('4. IV généré:', iv.toString(CryptoJS.enc.Base64));
    
    const encrypted = CryptoJS.AES.encrypt(testData, key, {
      iv: iv,
      mode: ENCRYPTION_CONFIG.mode,
      padding: ENCRYPTION_CONFIG.padding
    });
    
    console.log('5. Chiffrement réussi:', encrypted.toString());
    
    // Format final
    const ivStr = iv.toString(CryptoJS.enc.Base64);
    const ciphertextStr = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const finalFormat = ivStr + ':' + ciphertextStr;
    
    console.log('6. Format final:', finalFormat);
    
    // Déchiffrer
    const parts = finalFormat.split(':');
    console.log('7. Parties séparées:', parts.length);
    
    const ivParsed = CryptoJS.enc.Base64.parse(parts[0]);
    const ciphertextParsed = CryptoJS.enc.Base64.parse(parts[1]);
    
    console.log('8. IV parsé:', ivParsed.toString(CryptoJS.enc.Base64));
    console.log('9. Ciphertext parsé:', ciphertextParsed.toString(CryptoJS.enc.Base64));
    
    const decrypted = CryptoJS.AES.decrypt(
      CryptoJS.lib.CipherParams.create({
        ciphertext: ciphertextParsed
      }),
      key,
      {
        iv: ivParsed,
        mode: ENCRYPTION_CONFIG.mode,
        padding: ENCRYPTION_CONFIG.padding
      }
    );
    
    console.log('10. Déchiffrement réussi, sigBytes:', decrypted.sigBytes);
    
    const result = decrypted.toString(CryptoJS.enc.Utf8);
    console.log('11. Résultat final:', result);
    
    console.log('✅ Test réussi:', result === testData);
    
    return { success: true, result };
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error);
    return { success: false, error };
  }
}

/**
 * Test avec les données réelles du localStorage
 */
export function debugStorageData() {
  console.log('🔍 Debug - Données du localStorage');
  
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('__encrypted__')) {
        keys.push(key);
      }
    }
    
    console.log('Clés chiffrées trouvées:', keys.length);
    
    keys.forEach((key, index) => {
      const value = localStorage.getItem(key);
      console.log(`${index + 1}. Clé: ${key}`);
      console.log(`   Valeur: ${value?.substring(0, 100)}...`);
      console.log(`   Longueur: ${value?.length}`);
      
      if (value) {
        const parts = value.split(':');
        console.log(`   Parties: ${parts.length}`);
        if (parts.length === 2) {
          console.log(`   IV: ${parts[0].substring(0, 20)}...`);
          console.log(`   Ciphertext: ${parts[1].substring(0, 20)}...`);
        }
      }
    });
    
    return { success: true, keys };
    
  } catch (error) {
    console.error('❌ Erreur lors de l\'analyse:', error);
    return { success: false, error };
  }
}

/**
 * Test de la fonction generateKey
 */
export function debugKeyGeneration() {
  console.log('🔍 Debug - Génération de clé');
  
  try {
    const secret = DEFAULT_SECRET_KEY;
    const key1 = generateKey(secret);
    const key2 = generateKey(secret);
    
    console.log('Secret:', secret);
    console.log('Clé 1:', key1);
    console.log('Clé 2:', key2);
    console.log('Identiques:', key1 === key2);
    console.log('Longueur:', key1.length);
    
    return { success: true, key1, key2, identical: key1 === key2 };
    
  } catch (error) {
    console.error('❌ Erreur génération clé:', error);
    return { success: false, error };
  }
}

/**
 * Test complet de debug
 */
export function runFullDebug() {
  console.log('🔧 Debug complet du système de chiffrement');
  
  const results = {
    keyGeneration: debugKeyGeneration(),
    basicEncryption: debugEncryptionBasic(),
    storageData: debugStorageData()
  };
  
  console.log('📊 Résultats du debug:', results);
  
  return results;
}
