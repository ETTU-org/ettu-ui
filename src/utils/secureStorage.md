# Guide d'Utilisation - SecureStorage

## 📋 Vue d'ensemble

Le `SecureStorage` est un système de stockage local sécurisé pour ETTU qui remplace le localStorage standard avec :

- **Chiffrement AES-256** des données
- **Validation** et sanitisation des entrées
- **Compression** automatique
- **Gestion d'expiration** (TTL)
- **Vérification d'intégrité** par checksum
- **Gestion d'erreurs** robuste

## 🚀 Utilisation de Base

### Import
```typescript
import secureStorage from '../utils/secureStorage';
// ou
import { SecureStorage } from '../utils/secureStorage';
```

### Stockage Simple
```typescript
// Stocker des données
const success = secureStorage.setItem('user-notes', 'Mon contenu de note');

// Récupérer des données
const notes = secureStorage.getItem('user-notes');

// Supprimer des données
secureStorage.removeItem('user-notes');
```

### Stockage avec Options
```typescript
// Stockage avec expiration (1 heure)
secureStorage.setItem('temp-data', 'données temporaires', {
  ttl: 60 * 60 * 1000, // 1 heure en millisecondes
  compress: true,
  validate: true
});

// Stockage avec clé de chiffrement personnalisée
secureStorage.setItem('sensitive-data', 'données sensibles', {
  secretKey: 'ma-cle-personnalisee-2025',
  compress: false
});
```

## 🔧 Remplacement du localStorage Standard

### Avant (localStorage standard)
```typescript
// ❌ Non sécurisé
localStorage.setItem('noteEditor-content', content);
localStorage.setItem('noteEditor-fileName', fileName);

const savedContent = localStorage.getItem('noteEditor-content');
const savedFileName = localStorage.getItem('noteEditor-fileName');

localStorage.removeItem('noteEditor-content');
localStorage.removeItem('noteEditor-fileName');
```

### Après (SecureStorage)
```typescript
// ✅ Sécurisé
secureStorage.setItem('noteEditor-content', content);
secureStorage.setItem('noteEditor-fileName', fileName);

const savedContent = secureStorage.getItem('noteEditor-content');
const savedFileName = secureStorage.getItem('noteEditor-fileName');

secureStorage.removeItem('noteEditor-content');
secureStorage.removeItem('noteEditor-fileName');
```

## 🛠️ Exemples Pratiques

### 1. Stockage des Notes
```typescript
// Sauvegarder une note avec métadonnées
const saveNote = (content: string, fileName: string) => {
  const noteData = {
    content,
    fileName,
    lastModified: Date.now(),
    version: '1.0'
  };

  const success = secureStorage.setItem('current-note', JSON.stringify(noteData), {
    ttl: 24 * 60 * 60 * 1000, // 24 heures
    compress: true,
    validate: true
  });

  if (!success) {
    console.error('Erreur lors de la sauvegarde de la note');
  }
};

// Charger une note
const loadNote = () => {
  const noteJson = secureStorage.getItem('current-note');
  if (noteJson) {
    try {
      return JSON.parse(noteJson);
    } catch (error) {
      console.error('Erreur lors du parsing de la note:', error);
      return null;
    }
  }
  return null;
};
```

### 2. Stockage des Préférences Utilisateur
```typescript
interface UserPreferences {
  theme: 'light' | 'dark';
  fontSize: number;
  autoSave: boolean;
  language: string;
}

const savePreferences = (prefs: UserPreferences) => {
  return secureStorage.setItem('user-preferences', JSON.stringify(prefs), {
    compress: false, // Petites données, pas besoin de compression
    validate: true
  });
};

const loadPreferences = (): UserPreferences | null => {
  const prefsJson = secureStorage.getItem('user-preferences');
  if (prefsJson) {
    try {
      return JSON.parse(prefsJson);
    } catch (error) {
      console.error('Erreur lors du chargement des préférences:', error);
      return null;
    }
  }
  return null;
};
```

### 3. Cache Temporaire
```typescript
const cacheApiResponse = (key: string, data: any, cacheDuration: number = 5 * 60 * 1000) => {
  return secureStorage.setItem(`cache_${key}`, JSON.stringify(data), {
    ttl: cacheDuration,
    compress: true
  });
};

const getCachedData = (key: string) => {
  const cachedJson = secureStorage.getItem(`cache_${key}`);
  if (cachedJson) {
    try {
      return JSON.parse(cachedJson);
    } catch (error) {
      console.error('Erreur cache:', error);
      return null;
    }
  }
  return null;
};
```

## 🔒 Sécurité Avancée

### Clés de Chiffrement Personnalisées
```typescript
// Générer une clé basée sur l'utilisateur
const generateUserKey = (userId: string, timestamp: number) => {
  return `ettu-${userId}-${timestamp}`;
};

// Utiliser la clé personnalisée
const userKey = generateUserKey('user123', Date.now());
secureStorage.setItem('user-data', data, {
  secretKey: userKey
});
```

### Validation Stricte
```typescript
// Validation personnalisée
const validateNoteContent = (content: string): boolean => {
  // Vérifier la longueur
  if (content.length > 1000000) { // 1MB
    return false;
  }
  
  // Vérifier les caractères interdits
  const forbiddenPatterns = [
    /eval\(/gi,
    /Function\(/gi,
    /<script/gi,
    /javascript:/gi
  ];
  
  return !forbiddenPatterns.some(pattern => pattern.test(content));
};

// Utilisation
if (validateNoteContent(content)) {
  secureStorage.setItem('note', content, { validate: true });
}
```

## 📊 Gestion et Monitoring

### Statistiques du Stockage
```typescript
const stats = secureStorage.getStats();
console.log('Éléments stockés:', stats.totalItems);
console.log('Taille totale:', stats.totalSize, 'bytes');
console.log('Éléments expirés:', stats.expiredItems);
console.log('Élément le plus ancien:', new Date(stats.oldestItem || 0));
```

### Nettoyage Automatique
```typescript
// Nettoyer les données expirées
const cleanedItems = secureStorage.cleanup();
console.log(`${cleanedItems} éléments expirés supprimés`);

// Nettoyage automatique périodique
setInterval(() => {
  const cleaned = secureStorage.cleanup();
  if (cleaned > 0) {
    console.log(`Auto-nettoyage: ${cleaned} éléments supprimés`);
  }
}, 60 * 60 * 1000); // Toutes les heures
```

### Surveillance des Erreurs
```typescript
// Wrapper avec gestion d'erreurs
const safeStorage = {
  set: (key: string, value: string, options = {}) => {
    try {
      const success = secureStorage.setItem(key, value, options);
      if (!success) {
        console.error(`Échec du stockage pour: ${key}`);
      }
      return success;
    } catch (error) {
      console.error(`Erreur critique de stockage pour ${key}:`, error);
      return false;
    }
  },

  get: (key: string, defaultValue: string | null = null) => {
    try {
      return secureStorage.getItem(key) || defaultValue;
    } catch (error) {
      console.error(`Erreur de récupération pour ${key}:`, error);
      return defaultValue;
    }
  }
};
```

## 🚀 Migration du Code Existant

### Étape 1 : Identifier les utilisations de localStorage
```bash
# Rechercher dans le code
grep -r "localStorage" src/
```

### Étape 2 : Remplacer progressivement
```typescript
// Fonction helper pour la migration
const migrateFromLocalStorage = (oldKey: string, newKey: string) => {
  const oldData = localStorage.getItem(oldKey);
  if (oldData) {
    // Migrer vers le stockage sécurisé
    const success = secureStorage.setItem(newKey, oldData);
    if (success) {
      // Supprimer l'ancienne donnée
      localStorage.removeItem(oldKey);
      console.log(`Migré: ${oldKey} → ${newKey}`);
    }
  }
};

// Exemple de migration
migrateFromLocalStorage('noteEditor-content', 'note-content');
migrateFromLocalStorage('noteEditor-fileName', 'note-filename');
```

## 🧪 Tests et Validation

### Tests de Base
```typescript
// Test du cycle de vie
const testData = 'Test data 123';
const testKey = 'test-key';

// Test stockage
const stored = secureStorage.setItem(testKey, testData);
console.assert(stored === true, 'Stockage échoué');

// Test récupération
const retrieved = secureStorage.getItem(testKey);
console.assert(retrieved === testData, 'Récupération échouée');

// Test suppression
secureStorage.removeItem(testKey);
const deleted = secureStorage.getItem(testKey);
console.assert(deleted === null, 'Suppression échouée');
```

### Tests de Sécurité
```typescript
// Test de validation
const maliciousData = '<script>alert("XSS")</script>';
const stored = secureStorage.setItem('test', maliciousData, { validate: true });
console.assert(stored === false, 'Validation de sécurité échouée');

// Test d'expiration
secureStorage.setItem('temp', 'data', { ttl: 100 }); // 100ms
setTimeout(() => {
  const expired = secureStorage.getItem('temp');
  console.assert(expired === null, 'Expiration échouée');
}, 200);
```

## 🔧 Configuration Avancée

### Instance Personnalisée
```typescript
import { SecureStorage } from '../utils/secureStorage';

// Créer une instance avec configuration personnalisée
const userStorage = new SecureStorage('user-secret-key-2025', {
  compress: true,
  validate: true,
  ttl: 30 * 24 * 60 * 60 * 1000 // 30 jours par défaut
});

// Utiliser l'instance personnalisée
userStorage.setItem('user-profile', JSON.stringify(userProfile));
```

### Stockage par Domaine
```typescript
// Différents stockages pour différents modules
const noteStorage = new SecureStorage('notes-key');
const snippetStorage = new SecureStorage('snippets-key');
const configStorage = new SecureStorage('config-key');

// Utilisation isolée
noteStorage.setItem('current-note', noteContent);
snippetStorage.setItem('favorite-snippets', snippetsList);
configStorage.setItem('app-settings', appConfig);
```

## 📞 Support et Dépannage

### Problèmes Courants

1. **Données non récupérées**
   - Vérifier que la clé de chiffrement est la même
   - Vérifier l'expiration des données
   - Vérifier l'intégrité (checksum)

2. **Erreurs de chiffrement**
   - Vérifier que crypto-js est installé
   - Vérifier la validité de la clé secrète
   - Vérifier les permissions du localStorage

3. **Performance**
   - Éviter de stocker de très gros volumes
   - Utiliser la compression pour les textes longs
   - Nettoyer régulièrement les données expirées

### Debug
```typescript
// Activer le debug
const debugStorage = new SecureStorage('debug-key', {
  compress: false // Plus facile à déboguer
});

// Vérifier les métadonnées
const metadata = secureStorage.getMetadata('problem-key');
console.log('Métadonnées:', metadata);

// Vérifier toutes les clés
const allKeys = secureStorage.getAllKeys();
console.log('Clés stockées:', allKeys);
```

---

**Auteur :** Jules BOSSIS--GUYON  
**Date :** 14 juillet 2025  
**Version :** 1.0.0
