# 💾 Documentation Système de Stockage - ETTU

## 📋 Vue d'ensemble

Le système de stockage d'ETTU est basé sur `SecureStorage`, un système de stockage local sécurisé qui remplace le localStorage standard avec :

- **Chiffrement AES-256** des données
- **Validation** et sanitisation des entrées
- **Compression** automatique
- **Gestion d'expiration** (TTL)
- **Vérification d'intégrité** par checksum
- **Gestion d'erreurs** robuste
- **Migration automatique** des données existantes

## 🚀 Architecture du Système

### Composants principaux

1. **`secureStorage.ts`** - Core du système de stockage sécurisé
2. **`secureLocalStorage.ts`** - Wrapper pour migration automatique
3. **`useSecureStorage.ts`** - Hook React pour intégration
4. **`useUserPreferences.ts`** - Hook pour préférences utilisateur

### Flux de données

```
Application → secureLocalStorage → secureStorage → localStorage chiffré
```

## 🔧 Utilisation de Base

### Import

```typescript
import secureStorage from "../utils/secureStorage";
// ou
import { secureLocalStorage } from "../utils/secureLocalStorage";
// ou
import { useSecureStorage } from "../hooks/useSecureStorage";
```

### Stockage Simple

```typescript
// Stocker des données
const success = secureStorage.setItem("user-notes", "Mon contenu de note");

// Récupérer des données
const notes = secureStorage.getItem("user-notes");

// Supprimer des données
secureStorage.removeItem("user-notes");
```

### Stockage avec Options

```typescript
// Stockage avec expiration (1 heure)
secureStorage.setItem("temp-data", "données temporaires", {
  ttl: 60 * 60 * 1000, // 1 heure en millisecondes
  compress: true,
  validate: true,
});

// Stockage avec clé de chiffrement personnalisée
secureStorage.setItem("sensitive-data", "données sensibles", {
  secretKey: "ma-cle-personnalisee-2025",
  compress: false,
});
```

## 🔄 Migration Automatique

### Wrapper secureLocalStorage

```typescript
import { secureLocalStorage } from "../utils/secureLocalStorage";

// Utilisation identique au localStorage mais sécurisée
secureLocalStorage.setItem("key", "value");
const value = secureLocalStorage.getItem("key");
secureLocalStorage.removeItem("key");
```

### Migration des données existantes

```typescript
// Migration automatique lors du premier accès
const migrateExistingData = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("noteEditor-") || key.startsWith("user-")) {
      const value = localStorage.getItem(key);
      if (value) {
        secureStorage.setItem(key, value);
        localStorage.removeItem(key);
      }
    }
  });
};
```

## 🛠️ Intégrations Existantes

### 1. NoteEditor (utilise secureLocalStorage)

```typescript
// Dans NoteEditor.tsx
import { secureLocalStorage } from "../../utils/secureLocalStorage";

// Auto-sauvegarde sécurisée
const autoSave = useCallback(() => {
  if (content) {
    secureLocalStorage.setItem("noteEditor-content", content);
  }
  if (fileName) {
    secureLocalStorage.setItem("noteEditor-fileName", fileName);
  }
}, [content, fileName]);
```

### 2. SnippetsPage (utilise useSecureStorage)

```typescript
// Dans SnippetsPage.tsx
import { useSecureStorage } from "../hooks/useSecureStorage";

const {
  data: snippets,
  setData: setSnippets,
  loading,
  error,
} = useSecureStorage<Snippet[]>("user-snippets", []);
```

### 3. Préférences utilisateur (utilise useUserPreferences)

```typescript
// Dans composants avec préférences
import { useUserPreferences } from "../hooks/useUserPreferences";

const { preferences, updatePreference } = useUserPreferences();
```

## 🔒 Sécurité et Chiffrement

### Chiffrement AES-256

```typescript
class SecureStorage {
  private encrypt(data: string): string {
    const key = this.deriveKey();
    return CryptoJS.AES.encrypt(data, key).toString();
  }

  private decrypt(encryptedData: string): string {
    const key = this.deriveKey();
    const bytes = CryptoJS.AES.decrypt(encryptedData, key);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  private deriveKey(): string {
    const baseKey = this.secretKey || "ettu-default-key-2025";
    return CryptoJS.PBKDF2(baseKey, "ettu-salt", {
      keySize: 256 / 32,
      iterations: 1000,
    }).toString();
  }
}
```

### Validation et sanitisation

```typescript
private validateData(data: any): boolean {
  if (typeof data !== 'string') return false;
  if (data.length > this.maxDataSize) return false;

  const dangerousPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];

  return !dangerousPatterns.some(pattern => pattern.test(data));
}
```

## 🧪 Tests et Validation

### Tests automatisés

```typescript
// Dans security.test.ts
describe("SecureStorage", () => {
  test("chiffrement/déchiffrement", () => {
    const testData = "données de test";
    secureStorage.setItem("test-key", testData);
    const retrieved = secureStorage.getItem("test-key");
    expect(retrieved).toBe(testData);
  });

  test("validation des données", () => {
    const maliciousData = '<script>alert("xss")</script>';
    const success = secureStorage.setItem("test-key", maliciousData);
    expect(success).toBe(false);
  });
});
```

### Outils de debugging

```typescript
// Dans debugEncryption.ts
export function runFullDebug() {
  console.log("🔍 Test de chiffrement/déchiffrement");
  const testData = "Test de données";

  secureStorage.setItem("debug-test", testData);
  const retrieved = secureStorage.getItem("debug-test");

  console.log("✅ Données stockées:", testData);
  console.log("✅ Données récupérées:", retrieved);
  console.log("✅ Correspondance:", testData === retrieved);
}
```

## 📊 Monitoring et Logs

### Événements de sécurité

```typescript
private logSecurityEvent(event: string, details: any) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: navigator.userAgent
  };

  // Stockage des logs de sécurité
  const existingLogs = JSON.parse(localStorage.getItem('security-logs') || '[]');
  existingLogs.push(logEntry);
  localStorage.setItem('security-logs', JSON.stringify(existingLogs));
}
```

### Métriques de performance

```typescript
private trackPerformance(operation: string, startTime: number) {
  const endTime = performance.now();
  const duration = endTime - startTime;

  console.log(`⏱️ ${operation}: ${duration.toFixed(2)}ms`);

  // Alertes si performances dégradées
  if (duration > 100) {
    console.warn(`⚠️ ${operation} lent: ${duration.toFixed(2)}ms`);
  }
}
```

## 🔄 Hooks React

### useSecureStorage

```typescript
// Hook pour intégration React
export function useSecureStorage<T>(key: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        const stored = secureStorage.getItem(key);
        if (stored) {
          setData(JSON.parse(stored));
        }
      } catch (err) {
        setError(`Erreur lors du chargement de ${key}`);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [key]);

  return { data, setData, loading, error };
}
```

### useUserPreferences

```typescript
// Hook pour préférences utilisateur
export function useUserPreferences() {
  const [preferences, setPreferences] =
    useState<UserPreferences>(defaultPreferences);

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    secureStorage.setItem("user-preferences", JSON.stringify(newPreferences));
  };

  return { preferences, updatePreference };
}
```

## 📱 Responsive et Mobile

### Gestion des performances mobiles

```typescript
// Optimisation pour mobile
const isMobile = window.innerWidth < 768;
const compressionLevel = isMobile ? "high" : "standard";

secureStorage.setItem("data", value, {
  compress: true,
  compressionLevel,
});
```

### Limitation de stockage

```typescript
// Vérification de l'espace disponible
const checkStorageSpace = () => {
  try {
    const testKey = "storage-test";
    const testData = "x".repeat(1024 * 1024); // 1MB
    localStorage.setItem(testKey, testData);
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
};
```

## 🚀 Déploiement et Production

### Configuration de production

```typescript
// Variables d'environnement
const isProduction = process.env.NODE_ENV === "production";

const storageConfig = {
  maxDataSize: isProduction ? 5 * 1024 * 1024 : 10 * 1024 * 1024, // 5MB en prod
  enableLogging: !isProduction,
  enableDebug: !isProduction,
};
```

### Nettoyage automatique

```typescript
// Nettoyage des données expirées
const cleanup = () => {
  const keys = Object.keys(localStorage);
  keys.forEach((key) => {
    if (key.startsWith("secure-")) {
      const item = secureStorage.getItem(key);
      if (!item) {
        // Donnée expirée ou corrompue
        localStorage.removeItem(key);
      }
    }
  });
};
```

## 📞 Support et Maintenance

### Diagnostics

```typescript
// Outil de diagnostic
export function diagnoseStorage() {
  const report = {
    totalKeys: Object.keys(localStorage).length,
    secureKeys: Object.keys(localStorage).filter((k) =>
      k.startsWith("secure-")
    ),
    storageSize: JSON.stringify(localStorage).length,
    encryptionWorking: testEncryption(),
    lastCleanup: localStorage.getItem("last-cleanup"),
  };

  console.table(report);
  return report;
}
```

### Contact

**Support technique :** contact.ettu@gmail.com  
**Documentation :** `/docs/STORAGE_SYSTEM.md`  
**Tests :** `npm run test:security`

---

_Documentation mise à jour le 14 juillet 2025_  
_Prochaine révision : Avant déploiement production_
