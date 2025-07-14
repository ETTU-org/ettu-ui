/**
 * SecureStorage - Système de stockage local sécurisé pour ETTU
 * 
 * Ce module fournit une interface sécurisée pour le localStorage avec :
 * - Chiffrement AES-256 des données
 * - Validation et sanitisation des entrées
 * - Gestion d'erreurs robuste
 * - Compression pour optimiser l'espace
 * - Vérification d'intégrité des données
 * 
 * @author Jules BOSSIS--GUYON
 * @date 14 juillet 2025
 */

import CryptoJS from 'crypto-js';

// Configuration du chiffrement
const ENCRYPTION_CONFIG = {
  algorithm: 'AES',
  keySize: 256,
  ivSize: 128,
  iterations: 10000,
  mode: CryptoJS.mode.CBC,
  padding: CryptoJS.pad.Pkcs7
};

// Clé de chiffrement par défaut (à changer en production)
const DEFAULT_SECRET_KEY = 'ettu-secure-storage-2025';

// Préfixe pour identifier les données chiffrées
const ENCRYPTED_PREFIX = 'ETTU_ENCRYPTED_';

// Taille maximale des données (5MB)
const MAX_DATA_SIZE = 5 * 1024 * 1024;

/**
 * Interface pour les options de stockage
 */
interface StorageOptions {
  /** Clé de chiffrement personnalisée */
  secretKey?: string;
  /** Activer la compression */
  compress?: boolean;
  /** Durée de vie des données (en millisecondes) */
  ttl?: number;
  /** Valider les données avant stockage */
  validate?: boolean;
}

/**
 * Interface pour les métadonnées des données stockées
 */
interface StorageMetadata {
  /** Timestamp de création */
  created: number;
  /** Timestamp d'expiration */
  expires?: number;
  /** Checksum pour vérification d'intégrité */
  checksum: string;
  /** Version du format de données */
  version: string;
  /** Indique si les données sont compressées */
  compressed: boolean;
}

/**
 * Interface pour les données encapsulées
 */
interface StorageEnvelope {
  /** Données chiffrées */
  data: string;
  /** Métadonnées */
  metadata: StorageMetadata;
}

/**
 * Classe pour la gestion sécurisée du localStorage
 */
class SecureStorage {
  private secretKey: string;
  private defaultOptions: StorageOptions;

  constructor(secretKey: string = DEFAULT_SECRET_KEY, options: StorageOptions = {}) {
    this.secretKey = secretKey;
    this.defaultOptions = {
      compress: true,
      validate: true,
      ...options
    };
  }

  /**
   * Génère une clé de chiffrement basée sur une phrase secrète
   */
  private generateKey(secret: string): string {
    return CryptoJS.PBKDF2(secret, 'ettu-salt', {
      keySize: ENCRYPTION_CONFIG.keySize / 32,
      iterations: ENCRYPTION_CONFIG.iterations
    }).toString();
  }

  /**
   * Chiffre les données avec AES-256
   */
  private encrypt(data: string, secret: string): string {
    try {
      const keyString = this.generateKey(secret);
      const key = CryptoJS.enc.Hex.parse(keyString);
      const iv = CryptoJS.lib.WordArray.random(16); // 16 bytes = 128 bits
      
      const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: ENCRYPTION_CONFIG.mode,
        padding: ENCRYPTION_CONFIG.padding
      });

      // Combiner IV et données chiffrées (IV + ciphertext)
      const ivStr = iv.toString(CryptoJS.enc.Base64);
      const ciphertextStr = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
      
      // Format: IV_BASE64:CIPHERTEXT_BASE64
      return ivStr + ':' + ciphertextStr;
    } catch (error) {
      console.error('Erreur de chiffrement:', error);
      throw new Error('Échec du chiffrement des données');
    }
  }

  /**
   * Déchiffre les données
   */
  private decrypt(encryptedData: string, secret: string): string {
    try {
      const keyString = this.generateKey(secret);
      const key = CryptoJS.enc.Hex.parse(keyString);
      
      // Séparer IV et données chiffrées
      const parts = encryptedData.split(':');
      if (parts.length !== 2) {
        throw new Error('Format de données chiffrées invalide');
      }
      
      const ivStr = parts[0];
      const ciphertextStr = parts[1];
      
      // Reconstituer IV et ciphertext
      const iv = CryptoJS.enc.Base64.parse(ivStr);
      const ciphertext = CryptoJS.enc.Base64.parse(ciphertextStr);

      const decrypted = CryptoJS.AES.decrypt(
        CryptoJS.lib.CipherParams.create({
          ciphertext: ciphertext
        }),
        key,
        {
          iv: iv,
          mode: ENCRYPTION_CONFIG.mode,
          padding: ENCRYPTION_CONFIG.padding
        }
      );

      // Vérifier que le déchiffrement a réussi
      if (decrypted.sigBytes <= 0) {
        throw new Error('Déchiffrement échoué - données vides');
      }

      const utf8String = decrypted.toString(CryptoJS.enc.Utf8);
      
      // Vérifier que la conversion UTF-8 a réussi
      if (!utf8String || utf8String.length === 0) {
        throw new Error('Déchiffrement échoué - conversion UTF-8 impossible');
      }

      return utf8String;
    } catch (error) {
      console.error('Erreur de déchiffrement:', error);
      throw new Error(`Échec du déchiffrement des données: ${error}`);
    }
  }

  /**
   * Compresse les données (simulation avec base64)
   */
  private compress(data: string): string {
    try {
      // En production, utiliser une vraie compression (pako, lz-string, etc.)
      return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(data));
    } catch (error) {
      console.error('Erreur de compression:', error);
      return data;
    }
  }

  /**
   * Décompresse les données
   */
  private decompress(compressedData: string): string {
    try {
      return CryptoJS.enc.Base64.parse(compressedData).toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Erreur de décompression:', error);
      return compressedData;
    }
  }

  /**
   * Calcule un checksum MD5 pour vérifier l'intégrité
   */
  private calculateChecksum(data: string): string {
    return CryptoJS.MD5(data).toString();
  }

  /**
   * Valide les données avant stockage
   */
  private validateData(data: string): boolean {
    if (!data || typeof data !== 'string') {
      return false;
    }

    // Vérifier la taille
    if (data.length > MAX_DATA_SIZE) {
      console.warn('Données trop volumineuses pour le stockage');
      return false;
    }

    // Vérifier les caractères dangereux
    const dangerousPatterns = [
      /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /data:text\/html/gi,
      /eval\(/gi,
      /Function\(/gi
    ];

    const hasDangerousContent = dangerousPatterns.some(pattern => pattern.test(data));
    if (hasDangerousContent) {
      console.warn('Contenu potentiellement dangereux détecté');
      return false;
    }

    return true;
  }

  /**
   * Stocke des données de manière sécurisée
   */
  public setItem(key: string, value: string, options: StorageOptions = {}): boolean {
    try {
      const opts = { ...this.defaultOptions, ...options };
      const secretKey = opts.secretKey || this.secretKey;

      // Validation des données
      if (opts.validate && !this.validateData(value)) {
        throw new Error('Données invalides ou potentiellement dangereuses');
      }

      // Préparation des données
      let processedData = value;
      
      // Compression si activée
      if (opts.compress) {
        processedData = this.compress(processedData);
      }

      // Création des métadonnées
      const now = Date.now();
      const metadata: StorageMetadata = {
        created: now,
        expires: opts.ttl ? now + opts.ttl : undefined,
        checksum: this.calculateChecksum(processedData),
        version: '1.0.0',
        compressed: opts.compress || false
      };

      // Encapsulation des données
      const envelope: StorageEnvelope = {
        data: processedData,
        metadata
      };

      // Chiffrement
      const serialized = JSON.stringify(envelope);
      const encrypted = this.encrypt(serialized, secretKey);

      // Stockage avec préfixe
      const storageKey = ENCRYPTED_PREFIX + key;
      localStorage.setItem(storageKey, encrypted);

      return true;
    } catch (error) {
      console.error('Erreur lors du stockage:', error);
      return false;
    }
  }

  /**
   * Vérifie si les données sont chiffrées
   */
  private isEncrypted(data: string): boolean {
    try {
      // Vérifier le format IV:CIPHERTEXT
      const parts = data.split(':');
      if (parts.length !== 2) {
        return false;
      }
      
      const ivStr = parts[0];
      const ciphertextStr = parts[1];
      
      // Vérifier que les deux parties sont du base64 valide
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(ivStr) || !/^[A-Za-z0-9+/]*={0,2}$/.test(ciphertextStr)) {
        return false;
      }

      // Essayer de décoder le base64
      const iv = CryptoJS.enc.Base64.parse(ivStr);
      const ciphertext = CryptoJS.enc.Base64.parse(ciphertextStr);
      
      // Vérifier que l'IV fait 16 bytes (128 bits)
      if (iv.sigBytes !== 16) {
        return false;
      }
      
      // Vérifier que le ciphertext a une taille cohérente
      return ciphertext.sigBytes >= 16;
    } catch {
      return false;
    }
  }

  /**
   * Migre les données non chiffrées vers le format chiffré
   */
  private migrateUnencryptedData(key: string, rawData: string): string | null {
    try {
      console.log(`Migration des données non chiffrées pour: ${key}`);
      
      // Stocker les données en format chiffré
      const success = this.setItem(key, rawData);
      if (success) {
        // Supprimer l'ancienne version non chiffrée
        localStorage.removeItem(key);
        console.log(`Migration réussie pour: ${key}`);
        return rawData;
      }
      
      console.error(`Échec de la migration pour: ${key}`);
      return null;
    } catch (error) {
      console.error(`Erreur lors de la migration de ${key}:`, error);
      return null;
    }
  }

  /**
   * Récupère des données de manière sécurisée
   */
  public getItem(key: string, options: StorageOptions = {}): string | null {
    try {
      const opts = { ...this.defaultOptions, ...options };
      const secretKey = opts.secretKey || this.secretKey;
      const storageKey = ENCRYPTED_PREFIX + key;

      // Récupération des données chiffrées
      const encrypted = localStorage.getItem(storageKey);
      
      // Si pas de données chiffrées, chercher les données non chiffrées
      if (!encrypted) {
        const rawData = localStorage.getItem(key);
        if (rawData) {
          // Migrer les données non chiffrées
          return this.migrateUnencryptedData(key, rawData);
        }
        return null;
      }

      // Vérifier si les données sont effectivement chiffrées
      if (!this.isEncrypted(encrypted)) {
        console.warn(`Données corrompues ou non chiffrées détectées pour: ${key}`);
        // Essayer de traiter comme des données brutes
        return this.migrateUnencryptedData(key, encrypted);
      }

      // Déchiffrement
      const decrypted = this.decrypt(encrypted, secretKey);
      const envelope: StorageEnvelope = JSON.parse(decrypted);

      // Vérification de l'expiration
      if (envelope.metadata.expires && Date.now() > envelope.metadata.expires) {
        this.removeItem(key);
        return null;
      }

      // Vérification de l'intégrité
      const currentChecksum = this.calculateChecksum(envelope.data);
      if (currentChecksum !== envelope.metadata.checksum) {
        console.warn('Intégrité des données compromise pour:', key);
        this.removeItem(key);
        return null;
      }

      // Décompression si nécessaire
      let data = envelope.data;
      if (envelope.metadata.compressed) {
        data = this.decompress(data);
      }

      return data;
    } catch (error) {
      console.error('Erreur lors de la récupération:', error);
      
      // En cas d'erreur de déchiffrement, essayer de récupérer les données brutes
      const rawData = localStorage.getItem(key);
      if (rawData) {
        console.log(`Tentative de récupération des données brutes pour: ${key}`);
        return this.migrateUnencryptedData(key, rawData);
      }
      
      return null;
    }
  }

  /**
   * Supprime un élément du stockage
   */
  public removeItem(key: string): boolean {
    try {
      const storageKey = ENCRYPTED_PREFIX + key;
      localStorage.removeItem(storageKey);
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      return false;
    }
  }

  /**
   * Vérifie si un élément existe
   */
  public hasItem(key: string): boolean {
    const storageKey = ENCRYPTED_PREFIX + key;
    return localStorage.getItem(storageKey) !== null;
  }

  /**
   * Récupère toutes les clés stockées
   */
  public getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(ENCRYPTED_PREFIX)) {
        keys.push(key.substring(ENCRYPTED_PREFIX.length));
      }
    }
    return keys;
  }

  /**
   * Efface toutes les données sécurisées
   */
  public clear(): boolean {
    try {
      const keys = this.getAllKeys();
      keys.forEach(key => this.removeItem(key));
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'effacement:', error);
      return false;
    }
  }

  /**
   * Récupère les métadonnées d'un élément
   */
  public getMetadata(key: string): StorageMetadata | null {
    try {
      const storageKey = ENCRYPTED_PREFIX + key;
      const encrypted = localStorage.getItem(storageKey);
      if (!encrypted) {
        return null;
      }

      const decrypted = this.decrypt(encrypted, this.secretKey);
      const envelope: StorageEnvelope = JSON.parse(decrypted);
      return envelope.metadata;
    } catch (error) {
      console.error('Erreur lors de la récupération des métadonnées:', error);
      return null;
    }
  }

  /**
   * Nettoie les données expirées
   */
  public cleanup(): number {
    let cleaned = 0;
    const keys = this.getAllKeys();
    
    keys.forEach(key => {
      const metadata = this.getMetadata(key);
      if (metadata && metadata.expires && Date.now() > metadata.expires) {
        this.removeItem(key);
        cleaned++;
      }
    });

    return cleaned;
  }

  /**
   * Récupère les statistiques du stockage
   */
  public getStats(): {
    totalItems: number;
    totalSize: number;
    expiredItems: number;
    oldestItem: number | null;
  } {
    const keys = this.getAllKeys();
    let totalSize = 0;
    let expiredItems = 0;
    let oldestItem: number | null = null;

    keys.forEach(key => {
      const storageKey = ENCRYPTED_PREFIX + key;
      const data = localStorage.getItem(storageKey);
      if (data) {
        totalSize += data.length;
      }

      const metadata = this.getMetadata(key);
      if (metadata) {
        if (metadata.expires && Date.now() > metadata.expires) {
          expiredItems++;
        }
        if (oldestItem === null || metadata.created < oldestItem) {
          oldestItem = metadata.created;
        }
      }
    });

    return {
      totalItems: keys.length,
      totalSize,
      expiredItems,
      oldestItem
    };
  }

  /**
   * Migre toutes les données non chiffrées vers le format chiffré
   */
  public migrateAllData(): {
    migrated: number;
    errors: string[];
    total: number;
  } {
    const result = {
      migrated: 0,
      errors: [] as string[],
      total: 0
    };

    try {
      // Parcourir tous les éléments du localStorage
      const allKeys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && !key.startsWith(ENCRYPTED_PREFIX)) {
          allKeys.push(key);
        }
      }

      result.total = allKeys.length;

      allKeys.forEach(key => {
        try {
          const rawData = localStorage.getItem(key);
          if (rawData) {
            // Vérifier si c'est déjà des données chiffrées
            if (this.isEncrypted(rawData)) {
              // Déjà chiffré, ignorer
              return;
            }

            // Essayer de migrer
            const migrated = this.migrateUnencryptedData(key, rawData);
            if (migrated !== null) {
              result.migrated++;
            } else {
              result.errors.push(`Échec de la migration pour: ${key}`);
            }
          }
        } catch (error) {
          result.errors.push(`Erreur lors de la migration de ${key}: ${error}`);
        }
      });

      console.log(`Migration terminée: ${result.migrated}/${result.total} éléments migrés`);
      if (result.errors.length > 0) {
        console.warn('Erreurs de migration:', result.errors);
      }

      return result;
    } catch (error) {
      console.error('Erreur lors de la migration globale:', error);
      result.errors.push(`Erreur globale: ${error}`);
      return result;
    }
  }
}

// Instance par défaut
const secureStorage = new SecureStorage();

export default secureStorage;
export { SecureStorage };
export type { StorageOptions, StorageMetadata };
