# 📚 Documentation ETTU - Vue d'ensemble

## 🎯 Objectif

Cette documentation complète couvre tous les aspects techniques et d'utilisation de l'application ETTU (Éditeur de Texte et Transfert Universel).

## 📁 Structure de la Documentation

### 📋 Documents principaux

1. **[SECURITY_COMPLETE.md](./SECURITY_COMPLETE.md)** - Documentation sécurité complète

   - Évaluation globale de sécurité (Score 9.2/10)
   - Mesures de sécurité implémentées
   - Tests et validation
   - Conformité RGPD

2. **[LEGAL_COMPLETE.md](./LEGAL_COMPLETE.md)** - Documentation légale complète

   - Conditions générales d'utilisation
   - Politique de confidentialité
   - Mentions légales
   - Conformité RGPD

3. **[STORAGE_SYSTEM.md](./STORAGE_SYSTEM.md)** - Système de stockage sécurisé

   - SecureStorage avec chiffrement AES-256
   - Hooks React pour intégration
   - Migration automatique
   - Performance et sécurité

4. **[RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md)** - Système responsive

   - Architecture mobile-first
   - Composants adaptatifs
   - Hooks pour responsive design
   - Optimisations mobiles

5. **[SNIPPETS_SYSTEM.md](./SNIPPETS_SYSTEM.md)** - Système de snippets

   - Gestion d'extraits de code
   - Support multi-langages
   - Éditeur CodeMirror
   - Interface responsive

6. **[DEV_AUTH_SYSTEM.md](../DEV_AUTH_SYSTEM.md)** - Système d'authentification dev
   - Authentification de développement
   - Séparation dev/production
   - Panel d'administration
   - Sécurité des outils de dev

## 🚀 Démarrage Rapide

### Installation

```bash
git clone https://github.com/julesbossis/ettu-ui.git
cd ettu-ui
npm install
```

### Développement normal

```bash
npm run dev
# Accès sur http://localhost:5173
```

### Développement sécurisé

```bash
npm run dev:secure
# Accès sur http://localhost:5199
# Identifiants : admin/admin
```

### Production

```bash
npm run build
npm run preview
```

## 🔍 Architecture Générale

### Technologies utilisées

- **Framework** : React 18 + TypeScript
- **Bundler** : Vite
- **Styling** : Tailwind CSS
- **Éditeur** : CodeMirror 6
- **Sécurité** : DOMPurify, CryptoJS
- **Tests** : Vitest, Testing Library

### Structure du projet

```
ettu-ui/
├── src/
│   ├── components/        # Composants réutilisables
│   ├── pages/            # Pages de l'application
│   ├── features/         # Fonctionnalités (notes, snippets)
│   ├── hooks/            # Hooks personnalisés
│   ├── utils/            # Utilitaires
│   ├── types/            # Types TypeScript
│   └── contexts/         # Contextes React
├── docs/                 # Documentation complète
├── public/              # Fichiers statiques
└── tests/               # Tests
```

## 🛡️ Sécurité

### Score de sécurité : 9.2/10 🟢

- ✅ **Protection XSS** complète avec DOMPurify
- ✅ **Stockage chiffré** AES-256
- ✅ **CSP stricte** et headers de sécurité
- ✅ **Validation robuste** des entrées
- ✅ **Tests automatisés** (27/27 passés)
- ✅ **Authentification dev** sécurisée

### Vérification de sécurité

```bash
npm run test:security
npm run security:check
```

## 📱 Responsive Design

### Breakpoints

- **Mobile** : < 768px
- **Desktop** : ≥ 768px

### Fonctionnalités

- Interface adaptative automatique
- Onglets mobiles pour navigation
- Optimisations de performance
- Support tactile

## 💾 Stockage

### Système SecureStorage

- Chiffrement AES-256 des données
- Compression et validation
- Gestion TTL (Time To Live)
- Migration automatique

### Hooks disponibles

- `useSecureStorage<T>` - Stockage typé
- `useUserPreferences` - Préférences utilisateur
- `useDevAuth` - Authentification dev

## 🧪 Tests

### Tests de sécurité

```bash
npm run test:security
```

### Tests unitaires

```bash
npm run test
```

### Tests en mode watch

```bash
npm run test:watch
```

## 📊 Monitoring

### Logs de sécurité

Les événements de sécurité sont automatiquement loggés et peuvent être consultés dans le panel admin (mode dev).

### Performance

Le système surveille les performances et alerte en cas de dégradation.

## 🔧 Configuration

### Variables d'environnement

```bash
NODE_ENV=development|production
VITE_DEV_PORT=5199
```

### Configuration personnalisée

Consultez les fichiers de configuration dans `src/config/`.

## 🚀 Déploiement

### Build de production

```bash
npm run build
```

### Vérifications avant déploiement

```bash
npm run lint
npm run test
npm run test:security
```

### Hébergement

L'application est prête pour être hébergée sur :

- GitHub Pages
- Netlify
- Vercel
- Serveur statique

## 📞 Support

### Contact

- **Email** : julesbossis@gmail.com
- **GitHub** : [julesbossis/ettu-ui](https://github.com/julesbossis/ettu-ui)

### Documentation

- **Sécurité** : [SECURITY_COMPLETE.md](./SECURITY_COMPLETE.md)
- **Légal** : [LEGAL_COMPLETE.md](./LEGAL_COMPLETE.md)
- **Stockage** : [STORAGE_SYSTEM.md](./STORAGE_SYSTEM.md)
- **Responsive** : [RESPONSIVE_SYSTEM.md](./RESPONSIVE_SYSTEM.md)
- **Snippets** : [SNIPPETS_SYSTEM.md](./SNIPPETS_SYSTEM.md)

### Délais de réponse

- **Questions générales** : 48h
- **Bugs critiques** : 24h
- **Problèmes de sécurité** : 12h

## 🔄 Maintenance

### Mises à jour

- **Dépendances** : Vérification mensuelle
- **Sécurité** : Vérification hebdomadaire
- **Documentation** : Mise à jour à chaque release

### Versioning

Le projet suit le versioning sémantique (SemVer).

## 🎯 Roadmap

### Prochaines fonctionnalités

- [ ] Système de thèmes
- [ ] Export/import de données
- [ ] Collaboration en temps réel
- [ ] PWA complète
- [ ] Synchronisation cloud

### Améliorations continues

- [ ] Performances mobiles
- [ ] Accessibilité
- [ ] Internationalisation
- [ ] Analytics avancées

---

_Documentation mise à jour le 14 juillet 2025_  
_Version de l'application : 1.0.0_  
_Prochaine révision : Avant déploiement production_
