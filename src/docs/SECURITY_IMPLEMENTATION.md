# Guide de Sécurité ETTU - Implémentation

## 🚨 Corrections Critiques à Implémenter

### 1. Sanitisation HTML (CRITIQUE)

#### Installation DOMPurify
```bash
npm install dompurify @types/dompurify
```

#### Modification du NoteEditor.tsx
```tsx
// Ajouter l'import
import DOMPurify from 'dompurify';

// Modifier la fonction MarkdownPreview
function MarkdownPreview({ content }: { content: string }) {
  marked.setOptions({
    gfm: true,
    breaks: true,
  });

  const htmlContent = marked(content);
  // CRITIQUE: Sanitiser le HTML avant de l'injecter
  const sanitizedHTML = DOMPurify.sanitize(htmlContent, {
    ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'blockquote', 'code', 'pre', 'a', 'img'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class'],
    ALLOW_DATA_ATTR: false
  });

  return (
    <div className="p-4 overflow-y-auto h-full bg-gray-900 text-gray-100">
      <div
        className="markdown-preview"
        dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      />
    </div>
  );
}
```

### 2. Content Security Policy

#### Ajout dans index.html
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' data:;
  connect-src 'self';
">
```

#### Ou configuration Vite (vite.config.ts)
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:;",
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
})
```

### 3. Validation d'Entrée

#### Installation validator
```bash
npm install validator @types/validator
```

#### Utilitaire de validation
```tsx
// src/utils/validation.ts
import validator from 'validator';

export const validateNote = (content: string): boolean => {
  // Vérifier la longueur
  if (!validator.isLength(content, { min: 0, max: 100000 })) {
    return false;
  }
  
  // Vérifier les caractères dangereux
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /data:text\/html/gi
  ];
  
  return !dangerousPatterns.some(pattern => pattern.test(content));
};

export const sanitizeFileName = (filename: string): string => {
  return validator.escape(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
};
```

### 4. Chiffrement localStorage

#### Installation crypto-js
```bash
npm install crypto-js @types/crypto-js
```

#### Utilitaire de chiffrement
```tsx
// src/utils/encryption.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'ettu-local-storage-key'; // À générer dynamiquement en production

export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error('Erreur de chiffrement:', error);
    return data; // Fallback en cas d'erreur
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Erreur de déchiffrement:', error);
    return encryptedData; // Fallback en cas d'erreur
  }
};

// Wrapper pour localStorage sécurisé
export const secureStorage = {
  setItem: (key: string, value: string): void => {
    const encrypted = encryptData(value);
    localStorage.setItem(key, encrypted);
  },
  
  getItem: (key: string): string | null => {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;
    return decryptData(encrypted);
  },
  
  removeItem: (key: string): void => {
    localStorage.removeItem(key);
  }
};
```

### 5. Configuration ESLint Sécurité

#### Installation
```bash
npm install --save-dev eslint-plugin-security
```

#### Configuration .eslintrc.js
```javascript
module.exports = {
  extends: [
    // ... autres configurations
    'plugin:security/recommended'
  ],
  plugins: [
    // ... autres plugins
    'security'
  ],
  rules: {
    'security/detect-object-injection': 'error',
    'security/detect-non-literal-fs-filename': 'error',
    'security/detect-non-literal-regexp': 'error',
    'security/detect-unsafe-regex': 'error',
    'security/detect-buffer-noassert': 'error',
    'security/detect-child-process': 'error',
    'security/detect-disable-mustache-escape': 'error',
    'security/detect-eval-with-expression': 'error',
    'security/detect-new-buffer': 'error',
    'security/detect-no-csrf-before-method-override': 'error',
    'security/detect-possible-timing-attacks': 'error',
    'security/detect-pseudoRandomBytes': 'error'
  }
};
```

## 🧪 Tests de Sécurité

### Tests XSS Manuels

#### Payloads de test à injecter dans l'éditeur
```markdown
# Test XSS 1 - Script basique
<script>alert('XSS')</script>

# Test XSS 2 - Event handler
<img src="x" onerror="alert('XSS')">

# Test XSS 3 - JavaScript URL
[Lien malveillant](javascript:alert('XSS'))

# Test XSS 4 - Data URL
<img src="data:text/html,<script>alert('XSS')</script>">

# Test XSS 5 - SVG
<svg onload="alert('XSS')">

# Test XSS 6 - Iframe
<iframe src="javascript:alert('XSS')"></iframe>
```

### Tests Automatisés

#### Test unitaire pour la validation
```tsx
// src/utils/__tests__/validation.test.ts
import { validateNote, sanitizeFileName } from '../validation';

describe('Validation Security', () => {
  test('should reject malicious scripts', () => {
    const maliciousContent = '<script>alert("XSS")</script>';
    expect(validateNote(maliciousContent)).toBe(false);
  });

  test('should accept safe markdown', () => {
    const safeContent = '# Titre\n\nContenu **gras**';
    expect(validateNote(safeContent)).toBe(true);
  });

  test('should sanitize filename', () => {
    const maliciousFilename = 'test<script>alert("XSS")</script>.md';
    const result = sanitizeFileName(maliciousFilename);
    expect(result).not.toContain('<script>');
  });
});
```

## 📊 Monitoring et Alertes

### Monitoring des Erreurs

#### Configuration Sentry (optionnel)
```tsx
// src/utils/errorMonitoring.ts
import * as Sentry from '@sentry/react';

export const initErrorMonitoring = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    beforeSend(event) {
      // Filtrer les données sensibles
      if (event.extra) {
        delete event.extra.localStorage;
        delete event.extra.sessionStorage;
      }
      return event;
    }
  });
};
```

### Détection d'Anomalies

#### Surveillance localStorage
```tsx
// src/utils/securityMonitoring.ts
export const monitorLocalStorage = () => {
  const originalSetItem = localStorage.setItem;
  const originalGetItem = localStorage.getItem;

  localStorage.setItem = function(key: string, value: string) {
    // Log les tentatives d'écriture suspectes
    if (value.includes('<script>') || value.includes('javascript:')) {
      console.warn('Tentative d\'injection détectée:', { key, value });
    }
    return originalSetItem.call(this, key, value);
  };

  localStorage.getItem = function(key: string) {
    const result = originalGetItem.call(this, key);
    // Vérifier l'intégrité des données
    if (result && typeof result === 'string') {
      try {
        // Tentative de déchiffrement pour vérifier l'intégrité
        decryptData(result);
      } catch (error) {
        console.warn('Données localStorage potentiellement corrompues:', key);
      }
    }
    return result;
  };
};
```

## 🚀 Déploiement Sécurisé

### Checklist Pre-Deploy

- [ ] DOMPurify installé et configuré
- [ ] CSP configuré dans index.html
- [ ] Headers de sécurité ajoutés
- [ ] Validation d'entrée implémentée
- [ ] Tests XSS passés
- [ ] Audit npm clean
- [ ] ESLint security rules actives
- [ ] Monitoring d'erreurs configuré

### Configuration Serveur Web

#### Nginx (exemple)
```nginx
server {
    listen 443 ssl;
    server_name ettu.example.com;
    
    # Headers de sécurité
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
    
    # Configuration SSL
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📞 Support Sécurité

**Contact :** julesbossis@gmail.com  
**Objet :** [ETTU] Sécurité - Implémentation  
**Urgence :** Critique < 24h, Important < 72h

---

*Guide mis à jour le 14 juillet 2025*
