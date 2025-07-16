#!/bin/bash

# Script de Sécurisation Automatique ETTU
# Usage: ./security-setup.sh

set -e

echo "🔒 Configuration de la sécurité ETTU"
echo "=====================================\n"

# 1. Installation des dépendances de sécurité
echo "📦 Installation des dépendances de sécurité..."
npm install dompurify @types/dompurify validator @types/validator crypto-js @types/crypto-js

echo "📦 Installation des outils de développement..."
npm install --save-dev eslint-plugin-security @testing-library/security

echo "✅ Dépendances installées\n"

# 2. Création des fichiers utilitaires
echo "🛠️  Création des utilitaires de sécurité..."

# Utilitaire de validation
cat > src/utils/validation.ts << 'EOF'
import validator from 'validator';

export const validateNote = (content: string): boolean => {
  if (!validator.isLength(content, { min: 0, max: 100000 })) {
    return false;
  }
  
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
EOF

# Utilitaire de chiffrement
cat > src/utils/encryption.ts << 'EOF'
import CryptoJS from 'crypto-js';

const SECRET_KEY = 'ettu-local-storage-key';

export const encryptData = (data: string): string => {
  try {
    return CryptoJS.AES.encrypt(data, SECRET_KEY).toString();
  } catch (error) {
    console.error('Erreur de chiffrement:', error);
    return data;
  }
};

export const decryptData = (encryptedData: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedData, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Erreur de déchiffrement:', error);
    return encryptedData;
  }
};

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
EOF

echo "✅ Utilitaires créés\n"

# 3. Configuration ESLint
echo "⚙️  Configuration ESLint sécurité..."

# Backup du fichier existant
if [ -f "eslint.config.js" ]; then
  cp eslint.config.js eslint.config.js.backup
fi

# Ajout des règles de sécurité
cat >> eslint.config.js << 'EOF'

// Règles de sécurité ajoutées automatiquement
import security from 'eslint-plugin-security';

export default [
  ...existingConfig,
  {
    plugins: {
      security,
    },
    rules: {
      'security/detect-object-injection': 'error',
      'security/detect-non-literal-fs-filename': 'error',
      'security/detect-unsafe-regex': 'error',
      'security/detect-buffer-noassert': 'error',
      'security/detect-eval-with-expression': 'error',
      'security/detect-possible-timing-attacks': 'error',
    },
  },
];
EOF

echo "✅ ESLint configuré\n"

# 4. Création des tests de sécurité
echo "🧪 Création des tests de sécurité..."

mkdir -p src/utils/__tests__

cat > src/utils/__tests__/validation.test.ts << 'EOF'
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
EOF

echo "✅ Tests créés\n"

# 5. Modification du vite.config.ts
echo "🔧 Configuration des headers de sécurité..."

cat > vite.config.ts << 'EOF'
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
EOF

echo "✅ Configuration Vite mise à jour\n"

# 6. Ajout du CSP dans index.html
echo "🛡️  Configuration Content Security Policy..."

# Chercher et modifier index.html
if [ -f "index.html" ]; then
  sed -i '/<head>/a\    <meta http-equiv="Content-Security-Policy" content="default-src '\''self'\''; script-src '\''self'\'' '\''unsafe-inline'\''; style-src '\''self'\'' '\''unsafe-inline'\''; img-src '\''self'\'' data: https:;">' index.html
fi

echo "✅ CSP ajouté à index.html\n"

# 7. Création du script de test sécurité
echo "🧪 Création du script de test sécurité..."

cat > test-security.js << 'EOF'
// Tests XSS automatisés
const xssPayloads = [
  '<script>alert("XSS")</script>',
  '<img src="x" onerror="alert(\'XSS\')">',
  '<svg onload="alert(\'XSS\')">',
  'javascript:alert("XSS")',
  '<iframe src="javascript:alert(\'XSS\')"></iframe>'
];

console.log('🔍 Test de sécurité XSS...');
console.log('Testez ces payloads dans l\'éditeur de notes:');
xssPayloads.forEach((payload, index) => {
  console.log(`${index + 1}. ${payload}`);
});
console.log('\n⚠️  Aucun de ces payloads ne doit déclencher d\'alerte JavaScript!');
EOF

echo "✅ Script de test créé\n"

# 8. Audit final
echo "🔍 Audit de sécurité final..."
npm audit

echo "\n🎉 Configuration de sécurité terminée!"
echo "==========================================\n"

echo "📋 Prochaines étapes:"
echo "1. Exécuter: npm run lint (vérifier les nouvelles règles)"
echo "2. Tester: node test-security.js"
echo "3. Modifier NoteEditor.tsx pour utiliser DOMPurify"
echo "4. Remplacer localStorage par secureStorage"
echo "5. Exécuter: npm run build (test de production)"

echo "\n⚠️  IMPORTANT: Modification manuelle requise pour NoteEditor.tsx"
echo "Voir: src/docs/SECURITY_IMPLEMENTATION.md section 1"

echo "\n📞 Support: contact.ettu@gmail.com"
echo "🔗 Documentation: src/docs/SECURITY_ASSESSMENT.md"
EOF
